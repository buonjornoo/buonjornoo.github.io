/**
 * Decision core for the page-number drift guard.
 *
 * pageNumber is hand-written in front matter across content collections
 * *and* independently maintained in pageRoutes.json, with nothing checking
 * they agree. Kept as pure functions so the comparison is testable directly
 * (tests/unit/page-number-drift.test.ts); astro.config.mjs wires it into an
 * astro:build:start hook and fails the build on drift.
 */

export type PageCollection = 'blog' | 'projects' | 'pages';

export interface PageDoc {
  collection: PageCollection;
  id: string;
  slug?: string;
  pageNumber: string | null;
}

export interface DriftEntry {
  doc: string;
  declaredNumber: string;
  expectedUrl: string;
  routeEntry: string | undefined;
}

const FRONTMATTER_BLOCK = /^---\r?\n([\s\S]*?)\r?\n---/;

/**
 * Extracts a scalar front-matter field's value. Only looks inside the
 * leading `---`-delimited block, so a line elsewhere in the document that
 * happens to match can never be mistaken for real front matter.
 */
export function parseFrontmatterString(rawMarkdown: string, field: string): string | null {
  const block = FRONTMATTER_BLOCK.exec(rawMarkdown);
  if (!block) return null;
  const fieldPattern = new RegExp(`^${field}:\\s*["']?([^"'\\r\\n]+?)["']?\\s*$`, 'm');
  const match = fieldPattern.exec(block[1]);
  return match ? match[1] : null;
}

// The "pages" collection has no dynamic route ([...slug].astro) — each entry
// is hand-wired into a specific template: "home" into src/pages/index.astro
// (page 100), "about" into src/pages/about.astro (page 103, JOR-75).
const PAGES_COLLECTION_URLS: Record<string, string> = {
  home: '/',
  about: '/about/',
};

/**
 * Mirrors the getStaticPaths URL each collection's [...slug].astro route
 * actually generates, so drift is checked against how a document really
 * resolves rather than a guess.
 */
export function expectedUrlFor(doc: Pick<PageDoc, 'collection' | 'id' | 'slug'>): string {
  switch (doc.collection) {
    case 'blog':
      return `/blog/${doc.id}/`;
    case 'projects':
      if (!doc.slug) {
        throw new Error(`projects/${doc.id}.md declares a pageNumber but has no slug`);
      }
      return `/projects/${doc.slug}/`;
    case 'pages': {
      const url = PAGES_COLLECTION_URLS[doc.id];
      if (!url) {
        throw new Error(
          `pages/${doc.id}.md has no known URL mapping — add one to PAGES_COLLECTION_URLS`,
        );
      }
      return url;
    }
  }
}

/**
 * Every document that declares a front-matter pageNumber must agree with
 * pageRoutes.json: the URL that number maps to must be the document's own
 * URL. Documents that declare no pageNumber are out of scope entirely.
 */
export function findPageNumberDrift(docs: PageDoc[], routes: Record<string, string>): DriftEntry[] {
  const drift: DriftEntry[] = [];
  for (const doc of docs) {
    if (doc.pageNumber === null) continue;
    const expectedUrl = expectedUrlFor(doc);
    const routeEntry = routes[doc.pageNumber];
    if (routeEntry !== expectedUrl) {
      drift.push({
        doc: `${doc.collection}/${doc.id}.md`,
        declaredNumber: doc.pageNumber,
        expectedUrl,
        routeEntry,
      });
    }
  }
  return drift;
}
