import { readdirSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  expectedUrlFor,
  findPageNumberDrift,
  parseFrontmatterString,
} from '../../src/lib/page-number-drift';

/**
 * Seam: the drift-detection core (src/lib/page-number-drift.ts).
 * Spec source: issues/17 — every document declaring a front-matter
 * pageNumber must agree with pageRoutes.json (same number -> same URL).
 */
describe('parseFrontmatterString', () => {
  it('extracts a quoted value from the front-matter block', () => {
    const raw = '---\ntitle: "Table Hunter"\npageNumber: "206"\n---\n\nBody text.';
    expect(parseFrontmatterString(raw, 'pageNumber')).toBe('206');
  });

  it('extracts an unquoted value', () => {
    const raw = '---\npageNumber: 206\n---\n';
    expect(parseFrontmatterString(raw, 'pageNumber')).toBe('206');
  });

  it('returns null when the field is absent from the front matter', () => {
    const raw = '---\ntitle: "No page number here"\n---\n';
    expect(parseFrontmatterString(raw, 'pageNumber')).toBeNull();
  });

  it('ignores a matching line that lives outside the front-matter block', () => {
    const raw = '---\ntitle: "Body mentions it"\n---\n\npageNumber: "999" is prose, not YAML.';
    expect(parseFrontmatterString(raw, 'pageNumber')).toBeNull();
  });
});

describe('expectedUrlFor', () => {
  it('derives a blog URL from the document id', () => {
    expect(expectedUrlFor({ collection: 'blog', id: 'hello-world' })).toBe('/blog/hello-world/');
  });

  it('derives a project URL from the front-matter slug, not the file id', () => {
    expect(
      expectedUrlFor({ collection: 'projects', id: 'table-hunter-file', slug: 'table-hunter' }),
    ).toBe('/projects/table-hunter/');
  });

  it('throws for a project document missing its slug', () => {
    expect(() => expectedUrlFor({ collection: 'projects', id: 'no-slug' })).toThrow();
  });

  it('resolves the known "pages" collection mapping (about -> home)', () => {
    expect(expectedUrlFor({ collection: 'pages', id: 'about' })).toBe('/');
  });

  it('throws for an unmapped "pages" collection id', () => {
    expect(() => expectedUrlFor({ collection: 'pages', id: 'unknown' })).toThrow();
  });
});

describe('findPageNumberDrift', () => {
  const routes = { '100': '/', '206': '/projects/table-hunter/', '301': '/blog/hello-world/' };

  it('reports no drift when every declared number matches its route URL', () => {
    const docs = [
      { collection: 'pages' as const, id: 'about', pageNumber: '100' },
      { collection: 'projects' as const, id: 'th', slug: 'table-hunter', pageNumber: '206' },
      { collection: 'blog' as const, id: 'hello-world', pageNumber: '301' },
    ];
    expect(findPageNumberDrift(docs, routes)).toEqual([]);
  });

  it('ignores documents that declare no pageNumber', () => {
    const docs = [{ collection: 'blog' as const, id: 'hello-world', pageNumber: null }];
    expect(findPageNumberDrift(docs, routes)).toEqual([]);
  });

  it('flags a document whose declared number maps to a different URL', () => {
    // Declares 206 (table-hunter's real number) but is actually cycling-coach.
    const docs = [
      { collection: 'projects' as const, id: 'wrong', slug: 'cycling-coach', pageNumber: '206' },
    ];
    const drift = findPageNumberDrift(docs, routes);
    expect(drift).toHaveLength(1);
    expect(drift[0]).toMatchObject({
      doc: 'projects/wrong.md',
      declaredNumber: '206',
      expectedUrl: '/projects/cycling-coach/',
      routeEntry: '/projects/table-hunter/',
    });
  });

  it('flags a document whose declared number has no pageRoutes.json entry at all', () => {
    const docs = [
      { collection: 'blog' as const, id: 'orphan', pageNumber: '999' },
    ];
    const drift = findPageNumberDrift(docs, routes);
    expect(drift).toEqual([
      {
        doc: 'blog/orphan.md',
        declaredNumber: '999',
        expectedUrl: '/blog/orphan/',
        routeEntry: undefined,
      },
    ]);
  });
});

describe('findPageNumberDrift against the real site tree', () => {
  // Independent source of truth: the shipped route table, not a hand copy.
  const routes = JSON.parse(readFileSync('src/data/pageRoutes.json', 'utf-8')) as Record<
    string,
    string
  >;

  it('finds zero drift in the current repo content', () => {
    const collect = (collection: 'blog' | 'projects' | 'pages', dir: string) =>
      readdirSync(dir)
        .filter((name) => name.endsWith('.md'))
        .map((name) => {
          const raw = readFileSync(`${dir}/${name}`, 'utf-8');
          const id = name.replace(/\.md$/, '');
          return {
            collection,
            id,
            slug: parseFrontmatterString(raw, 'slug') ?? undefined,
            pageNumber: parseFrontmatterString(raw, 'pageNumber'),
          };
        });

    const docs = [
      ...collect('blog', 'src/data/blog'),
      ...collect('projects', 'src/data/projects'),
      ...collect('pages', 'src/data/pages'),
    ];

    expect(findPageNumberDrift(docs, routes)).toEqual([]);
  });
});
