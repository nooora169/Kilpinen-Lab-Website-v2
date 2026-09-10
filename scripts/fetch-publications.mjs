#!/usr/bin/env node
/**
 * Refreshes src/data/publications.json from Europe PMC.
 *
 *   npm run publications
 *
 * Once you have collected ORCID iDs from the group, put them in ORCIDS below.
 * An ORCID query is far cleaner than an author-name query: searching for
 * "Kilpinen H" pulls in the whole PCAWG consortium and dozens of duplicated
 * "Author Correction" records, which is exactly what the filters below exist
 * to remove until the ORCIDs are in place.
 *
 * Nothing here runs in the browser. It writes a JSON file that the site reads
 * at build time, so the published pages stay static and fast.
 */

import { writeFile, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(here, '../src/data/publications.import.json');

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

/** Fill these in as people send them. Example: '0000-0002-1825-0097' */
const ORCIDS = [];

/** Used only while ORCIDS is empty. */
const AUTHOR_FALLBACK = 'AUTH:"Kilpinen H"';

/** Papers before this year are dropped. Set to 0 to keep everything. */
const FROM_YEAR = 2013;

/** Titles matching any of these are dropped. */
const TITLE_BLOCKLIST = [
  /^author correction/i,
  /^publisher correction/i,
  /^correction:/i,
  /^erratum/i,
];

/**
 * Consortium papers with hundreds of authors drown out the group's own work.
 * Drop anything whose title matches these unless you want them listed.
 */
const CONSORTIUM_BLOCKLIST = [/pan-cancer/i, /whole cancer genomes/i, /2,658 (human )?cancers/i];

// ---------------------------------------------------------------------------

const BASE = 'https://www.ebi.ac.uk/europepmc/webservices/rest/search';

function buildQuery() {
  if (ORCIDS.length > 0) {
    return ORCIDS.map((id) => `AUTHORID:"${id}"`).join(' OR ');
  }
  return AUTHOR_FALLBACK;
}

async function fetchPage(cursorMark) {
  const params = new URLSearchParams({
    query: buildQuery(),
    format: 'json',
    pageSize: '100',
    resultType: 'core',
    cursorMark,
  });
  const res = await fetch(`${BASE}?${params}`, {signal: AbortSignal.timeout(30000)});
  if (!res.ok) throw new Error(`Europe PMC returned ${res.status}`);
  return res.json();
}

function tidyJournal(result) {
  const info = result.journalInfo?.journal;
  return info?.title || result.bookOrReportDetails?.publisher || result.source || '';
}

function tidyAuthors(result) {
  const list = result.authorList?.author || [];
  if (list.length === 0) return result.authorString || '';
  const names = list.slice(0, 3).map((a) => {
    if (a.lastName && a.initials) return `${a.lastName} ${a.initials}`;
    return a.fullName || '';
  });
  return list.length > 3 ? `${names.join(', ')}, et al.` : `${names.join(', ')}.`;
}

function keep(result) {
  const title = (result.title || '').trim();
  if (!title) return false;
  const year = Number(result.pubYear);
  if (Number.isFinite(year) && year < FROM_YEAR) return false;
  if (TITLE_BLOCKLIST.some((re) => re.test(title))) return false;
  if (CONSORTIUM_BLOCKLIST.some((re) => re.test(title))) return false;
  return true;
}

async function main() {
  const seen = new Map();
  let cursorMark = '*';

  for (let page = 0; page < 6; page += 1) {
    const data = await fetchPage(cursorMark);
    const results = data.resultList?.result || [];
    for (const r of results) {
      if (!keep(r)) continue;
      const doi = (r.doi || '').toLowerCase();
      const key = doi || `${r.pubYear}-${r.title}`;
      // Prefer the peer-reviewed record over its own preprint when both exist.
      const existing = seen.get(key);
      if (existing && existing.source === 'MED') continue;
      seen.set(key, {
        year: Number(r.pubYear) || null,
        authors: tidyAuthors(r),
        title: (r.title || '').replace(/\.$/, ''),
        journal: tidyJournal(r),
        doi: r.doi || null,
        source: r.source,
      });
    }
    if (!data.nextCursorMark || data.nextCursorMark === cursorMark) break;
    cursorMark = data.nextCursorMark;
    if (results.length === 0) break;
  }

  const list = [...seen.values()]
    .map(({ source, ...rest }) => rest)
    .sort((a, b) => (b.year || 0) - (a.year || 0) || a.title.localeCompare(b.title));

  if (list.length === 0) {
    console.error('No publications returned. Leaving the existing file untouched.');
    process.exitCode = 1;
    return;
  }

  let previous = 0;
  try {
    previous = JSON.parse(await readFile(OUT, 'utf8')).length;
  } catch {
    previous = 0;
  }

  await writeFile(OUT, `${JSON.stringify(list, null, 2)}\n`, 'utf8');
  console.log(`Wrote ${list.length} publications to src/data/publications.import.json for review (was ${previous}).`);
  if (ORCIDS.length === 0) {
    console.log('Note: still using the author-name fallback. Add ORCID iDs for a clean list.');
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exitCode = 1;
});
