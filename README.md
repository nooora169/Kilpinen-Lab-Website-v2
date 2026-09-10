# Kilpinen Lab website

An Astro static website with linked research topics, projects, people, publications, resources and lab-life photographs. This version is a private design review; review imported topic assignments, roles and project descriptions with the group before a public launch.

## Start locally

Use Node 22.12+ (or a compatible supported Node release).

```sh
npm ci
npm run dev
```

Open http://localhost:4321. Run `npm run build` to produce `dist`, or `npm run preview` to inspect the built pages. The site uses semantic HTML and a small navigation script. The bubble map uses bounded CSS animation; it respects reduced-motion preferences. Static delivery reduces runtime work but does not guarantee zero bugs.

## Edit through forms

The content editor is Decap CMS. The hosted review site currently shows setup information, not a working hosted login. No GitHub repository or OAuth credentials were supplied. Website viewing access and content editing permissions are separate.

For local editing, run `npx --yes decap-server@3.3.1` in another terminal from the project root, then open http://localhost:4321/admin/ and select Open content editor. Internet access is required to load the pinned Decap script. Local editing writes files on your computer; it does not publish the hosted site. `publish_mode: simple` is used because local Decap does not support editorial workflow.

For team editing:
1. Put the project in a GitHub repository owned by the lab.
2. Set `backend.repo` and `backend.branch` in `public/admin/config.yml`.
3. Configure a GitHub OAuth authentication service and its `base_url` / `auth_endpoint` as described in the Decap documentation. Keep client secrets on the authentication server; never commit them.
4. Give editors the repository access required by Decap. These permissions allow repository editing, not only editing their own biographies. Fine-grained author/reviewer roles require a separate permissions design.
5. Connect the repository to the chosen production host. Build command: `npm ci && npm run build`; output: `dist`.
6. Test a complete sign-in, edit, save, build and rollback cycle. Only then set `enabled` to `true` in `public/admin/editor-settings.json`.
7. For draft/review publishing, configure `publish_mode: editorial_workflow` on the hosted editor and a compatible deployment preview workflow. Keep simple mode when testing locally.

Sources: https://decapcms.org/docs/decap-proxy/ and https://decapcms.org/docs/github-backend/ .

## Content model

- `src/content/topics/*.md`: automatically appears in the floating topic grid and at `/research/filename/`. No coordinates needed. Includes related people, DOI references, funders, collaborators and datasets.
- `src/content/projects/*.md`: automatically gets `/projects/filename/`, appears on the homepage and related topic pages. Includes topics, team, publications, resources/documents, collaborators and funding.
- `src/content/people/*.md`: automatically gets `/people/filename/`. Add a biography below the frontmatter; associate people using their filenames without `.md`. Missing photos show initials.
- `src/content/pages/*.md`: creates `/filename/`; `navLabel` adds it to navigation. Reserve `research`, `projects`, `people`, `admin` and `404` for built-in routes.
- `src/content/gallery/*.md`: only entries with real photos appear. Put uploads under `public/` and use the URL path, such as `/uploads/retreat.jpg`. Include a caption, date and credit.
- `src/content/tools/*.md`: repository cards.
- `src/data/publications.json`: curated list; first three items form the results section. Optional `summary` provides a brief result description. Enter preprints with journal `bioRxiv` to display the review-status label.
- `src/data/site.json`: identity and contact text. The headline and its highlighted phrase are editable here; structural design edits belong in Astro and CSS.

All are available in the Decap forms. Add a topic with a title, shortName, hook, summary, colour, order and optional relationship fields, then write the long description in Markdown. Topic pages are generated automatically. Use `draft: true` to hide a topic, project or general page. The schema validates content during the build.

## Publication imports

`npm run publications` queries Europe PMC into `src/data/publications.import.json`. Review its results before adding approved entries to the curated file. It uses author-name matching until you supply ORCIDs in the script; neither author names nor ORCIDs guarantee a complete, deduplicated lab bibliography. The manual GitHub action uploads candidates for review and never commits over curated content. Imported summaries and selected order are preserved.

## Design and images

Theme tokens are in `src/styles/global.css`. No generated scientific images, artificial plots or synthesized portraits are used. The homepage uses two real assets already published by the lab; exact sources are recorded in `ASSETS.md`. Other existing gallery records without photographs stay hidden. The preview uses initials instead of copying member portraits.

## Hosting and maintenance

The current review copy is saved and hosted through ChatGPT Sites. Its source identity is in `.openai/hosting.json`. Keep that identity when continuing this Site here. Decap's GitHub backend does not automatically connect to the Sites source repository.

For a separately managed university/lab production site, choose a host that serves Astro's static `dist` directory and connects to the lab's GitHub repository. Configure the domain/DNS with its owner, HTTPS, build-on-change and rollback. Set `site` in `astro.config.mjs` to the final public origin. Hosting and domain costs depend on the provider and service limits; free hosting is not guaranteed. Lovable is not required to build or maintain this project.

Before public launch, confirm current roles, research assignments, funding and publication metadata; obtain lab approval for photo reuse and captions; confirm university branding/accessibility requirements with the responsible team. Browser, mobile, keyboard, screen-reader and full CMS end-to-end checks remain necessary before declaring production readiness. No claim of formal WCAG conformance is made.

After launch, assign a lab owner and backup maintainer, review edits before publishing, keep source and media backups, update dependencies with review, and regularly check links. Git history supports rollback of source; verify the chosen host's redeployment process too.

## September design feedback

The research map now uses fixed, irregular positions and static surrounding dots. It is labelled as a conceptual map, not a measured UMAP. New topics beyond the initial eight are placed in additional rows with an expanded viewBox. Mobile visitors also receive full-size topic links.

Topic and project detail forms now include Images and figures (image, caption, alt text, credit), Funder logos (name, logo, URL), Methods and Research questions. Existing funding, collaborators and resource fields remain supported. Empty areas intentionally show labelled placeholders in this private review. Person profiles include a portrait placeholder, interests, optional figures, related projects and papers from their related research topics. These paper links do not assert authorship. Before public launch, fill or intentionally hide empty placeholder sections.

People summaries were paraphrased from the lab and University of Helsinki people pages; each profile links its source. Role labels retain the existing listing; public sources disagree about Marc's role (UH lists Doctoral Researcher, the lab page says MSc Research Assistant).

The admin landing page is now a real Astro route at /admin/, so it resolves in the development server too. Decap server is pinned to 3.3.1 because the 3.11.1 published dependency metadata contains unsupported catalog: references.

## Pages and the new homepage

Home keeps the original introduction and neuron, followed by the original research
map, the latest three news items, funder logos and a contact link. Research and
projects are grouped at /research/; People, Publications, Resources, Lab life and
News each have their own pages. Existing topic, project and person URLs remain
valid. The homepage forwards old section links to their new destinations.

### Add news in the editing interface

Use News > New News item. Fill in the title, date and short description; optionally
upload an image and credit, write the full announcement, and select related topics,
projects, people or publication DOIs. Turn off Hide from site when ready. The
homepage displays the three newest published entries automatically after a build.
Future-dated news stays hidden until a build on or after its date; there is no
scheduled publishing service. The example news item is a hidden draft.

### Change homepage funders

Use Homepage funders > Funder logos. Add, remove or reorder entries and edit their
names, individual logo images and optional website links. The original supplied
banner is displayed as five responsive crops; uploading an individual logo
replaces its crop automatically. Specific grant details still belong on the
relevant project or research-topic page.

The local editor continues to use the existing two-terminal setup. Online editor
login still requires a GitHub repository and OAuth configuration; these new content
fields do not activate shared hosted editing by themselves.
