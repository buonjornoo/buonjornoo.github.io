import { describe, expect, it } from 'vitest';
import { blogSchema } from '../../src/lib/content-schemas';

/**
 * Seam: the blog collection's zod schema — the part of Astro's content
 * loader this repo actually controls and can unit-test directly, without
 * spinning up the full content layer. Spec source: JOR-75 — a new optional
 * `featured` field must parse without breaking the loader.
 *
 * Which real post (if any) carries `featured: true` at launch is an
 * explicit content-authoring decision this ticket leaves open (see JOR-75
 * "Out of Scope"), so this exercises the schema directly rather than
 * committing a real fixture post.
 */
describe('blog schema — featured field (JOR-75)', () => {
  const baseFrontmatter = {
    title: 'Test Post',
    description: 'A test post.',
    pubDate: '2026-01-01',
  };

  it('parses a post with featured: true', () => {
    const result = blogSchema.parse({ ...baseFrontmatter, featured: true });
    expect(result.featured).toBe(true);
  });

  it('defaults featured to false when omitted, matching the projects collection pattern', () => {
    const result = blogSchema.parse(baseFrontmatter);
    expect(result.featured).toBe(false);
  });

  it('still parses every other existing field unaffected by the new field', () => {
    const result = blogSchema.parse({
      ...baseFrontmatter,
      tags: ['design'],
      draft: false,
      pageNumber: '303',
    });
    expect(result.tags).toEqual(['design']);
    expect(result.pageNumber).toBe('303');
  });
});
