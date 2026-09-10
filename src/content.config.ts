import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Every piece of content on the site is a markdown file in src/content/.
 * The fields below are what you fill in at the top of each file.
 * Anything written BELOW the frontmatter is free-form: headings,
 * paragraphs, lists, images, links. It renders on the topic page.
 */

const CHANNELS = [
  'gfp',
  'dapi',
  'mcherry',
  'farred',
  'amber',
  'cyan',
  'slate',
  'chalk',
] as const;

const detailFields={
 figures:z.array(z.object({image:z.string().optional(),caption:z.string(),credit:z.string().optional(),alt:z.string().optional()})).default([]),
 funders:z.array(z.object({name:z.string(),logo:z.string().optional(),url:z.string().optional()})).default([]),
 methods:z.array(z.string()).default([]),
 questions:z.array(z.string()).default([]),
};

const topics = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/topics' }),
  schema: z.object({
    // Shown inside the bubble. Two or three words maximum.
    ...detailFields,
    shortName: z.string(),
    // Full title on the topic page.
    title: z.string(),
    // One sentence, under 15 words, no jargon.
    hook: z.string(),
    // 60 to 100 words for the map panel and the top of the topic page.
    summary: z.string(),
    // Which imaging channel colour this topic uses.
    colour: z.enum(CHANNELS),
    // Slugs of people from src/content/people/, in display order.
    people: z.array(z.string()).default([]),
    // DOIs of the key papers, nothing else. They are matched against the feed.
    dois: z.array(z.string()).default([]),
    // Funder and grant, shown on the topic page. Optional.
    funding: z.array(z.string()).default([]),
    // Named collaborators outside the group. Optional.
    collaborators: z.array(z.string()).default([]),
    // Datasets or resources this topic produced. Optional.
    datasets: z
      .array(z.object({ name: z.string(), url: z.string().url().optional() }))
      .default([]),
    // Year the topic started, used on the topic page.
    since: z.string().optional(),
    status: z.enum(['Active', 'Recruiting', 'Wrapping up', 'Open source']).default('Active'),
    // Where the bubble sits and how big it is. Set by hand so the map is
    // stable and needs no physics in the browser. See README.
    x: z.number().optional(),
    y: z.number().optional(),
    r: z.number().optional(),
    // Lower numbers appear first in lists.
    order: z.number().default(50),
    draft: z.boolean().default(false),
  }),
});

const people = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/people' }),
  schema: z.object({
    sourceUrl: z.string().url().optional(),
    interests: z.array(z.string()).default([]),
    ...detailFields,
    name: z.string(),
    role: z.string(),
    // 40 to 60 words, written for a first-year student.
    focus: z.string(),
    // Needed for the publication feed. Ask everyone for it.
    orcid: z.string().optional(),
    email: z.string().optional(),
    links: z
      .array(z.object({ label: z.string(), url: z.string().url() }))
      .default([]),
    // Put the file in public/people/ and write "/people/name.jpg" here.
    // Leave empty and a generated placeholder is drawn instead.
    photo: z.string().optional(),
    colour: z.enum(CHANNELS).default('chalk'),
    // Sort order in the People grid. PI first, then postdocs, and so on.
    order: z.number().default(50),
    alumnus: z.boolean().default(false),
    // Alumni only.
    leftIn: z.string().optional(),
    nowAt: z.string().optional(),
  }),
});

const tools = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/tools' }),
  schema: z.object({
    name: z.string(),
    summary: z.string(),
    language: z.string().optional(),
    repo: z.string().url(),
    docs: z.string().url().optional(),
    doi: z.string().optional(),
    colour: z.enum(CHANNELS).default('cyan'),
    order: z.number().default(50),
  }),
});

const gallery = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/gallery' }),
  schema: z.object({
    caption: z.string(),
    // Put the file in public/lab-life/ and write "/lab-life/retreat.jpg" here.
    photo: z.string().optional(),
    credit: z.string().optional(),
    date: z.string().optional(),
    wide: z.boolean().default(false),
    layout: z.enum(["landscape", "portrait"]).default("landscape"),
    alt: z.string().optional(),
    position: z.string().default("50% 50%"),
    order: z.number().default(50),
  }),
});

/**
 * Ordinary pages. Drop a markdown file in src/content/pages/ and it appears
 * at /its-filename. Set navLabel to add it to the top navigation.
 */
const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    intro: z.string().optional(),
    navLabel: z.string().optional(),
    navOrder: z.number().default(50),
    draft: z.boolean().default(false),
  }),
});

const projects = defineCollection({
 loader:glob({pattern:'**/*.md',base:'./src/content/projects'}),
 schema:z.object({...detailFields,title:z.string(),summary:z.string(),topics:z.array(z.string()).default([]),people:z.array(z.string()).default([]),dois:z.array(z.string()).default([]),funding:z.array(z.string()).default([]),collaborators:z.array(z.string()).default([]),resources:z.array(z.object({name:z.string(),url:z.string().url()})).default([]),status:z.enum(['Active','Completed','Recruiting']).default('Active'),colour:z.enum(CHANNELS).default('cyan'),order:z.number().default(50),draft:z.boolean().default(false)})
});
const news=defineCollection({
 loader:glob({pattern:'**/*.md',base:'./src/content/news'}),
 schema:z.object({title:z.string(),date:z.coerce.date(),summary:z.string(),image:z.string().optional(),imageAlt:z.string().optional(),imageCredit:z.string().optional(),topics:z.array(z.string()).default([]),projects:z.array(z.string()).default([]),people:z.array(z.string()).default([]),dois:z.array(z.string()).default([]),draft:z.boolean().default(true)})
});
export const collections = { topics, people, tools, gallery, pages, projects, news };
