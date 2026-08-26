import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const dist = join(import.meta.dirname, '..', '..', 'dist');

/**
 * Seam: the rendered site (dist/) — confirms rehypePageLinks (astro.config.mjs)
 * is actually wired into the markdown build, not just unit-tested in
 * isolation. Spec source: issues/12 acceptance criteria.
 */
describe('rendered this-site page (208)', () => {
  const html = readFileSync(join(dist, 'projects', 'this-site', 'index.html'), 'utf-8');

  it('never links a bare page number reference ("Type 100 anywhere")', () => {
    // Real live copy (src/data/projects/this-site.md) — the exact case
    // issues/12 exists to guard against: "100" here is not "page 100" or
    // "P100", so it must stay plain text.
    const idx = html.indexOf('Type 100 anywhere');
    expect(idx).toBeGreaterThan(-1);
    const window = html.slice(Math.max(0, idx - 40), idx + 40);
    expect(window).not.toMatch(/<a[^>]*>\s*100\s*<\/a>/);
    expect(window).not.toContain('<a href="/">100');
  });
});
