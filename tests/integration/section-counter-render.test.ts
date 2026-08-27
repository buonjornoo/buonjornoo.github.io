import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const dist = join(import.meta.dirname, '..', '..', 'dist');

/**
 * Seam: the rendered site (dist/) — the page-title reading-progress slot.
 * Spec source: issues/13 — long-form pages (Project/Blog layouts) show
 * "k/N" in the page-title slot; long-form detection comes from the layout
 * used, not a heading-count heuristic (issues/13.md: "not a heuristic").
 * Since issues/22 (header restructure), the page-title slot itself renders
 * on every page — only the "k/N" counter suffix is conditional on the
 * layout providing a sectionCount.
 */
describe('section counter — page-title slot (issues/13)', () => {
  it('shows "Title 1/N" on first paint, on a project page (do24-workflow-evolution, 7 sections)', () => {
    const html = readFileSync(
      join(dist, 'projects', 'do24-workflow-evolution', 'index.html'),
      'utf-8',
    );
    expect(html).toContain('ceefax-page-title');
    expect(html).toMatch(/page-title-full"[^>]*>\s*Workflow Evolution/);
    expect(html).toMatch(/section-counter-value"[^>]*>\s*1\/7\s*</);
  });

  it('carries two synced counter copies — full and compact — both starting at 1/N', () => {
    const html = readFileSync(
      join(dist, 'projects', 'do24-workflow-evolution', 'index.html'),
      'utf-8',
    );
    const matches = html.match(/section-counter-value"[^>]*>\s*1\/7\s*</g) ?? [];
    expect(matches).toHaveLength(2);
  });

  it('shows the right N on a blog post (hello-world, 3 sections)', () => {
    const html = readFileSync(join(dist, 'blog', 'hello-world', 'index.html'), 'utf-8');
    expect(html).toMatch(/section-counter-value"[^>]*>\s*1\/3\s*</);
  });

  it('is readable text, not hidden from screen readers (deliberate: no aria-hidden)', () => {
    const html = readFileSync(
      join(dist, 'projects', 'do24-workflow-evolution', 'index.html'),
      'utf-8',
    );
    const block = html.match(/<div class="ceefax-page-title"[^>]*>/)?.[0] ?? '';
    expect(block).not.toContain('aria-hidden');
  });

  it('shows the title with no counter suffix on index pages (issues/22: title everywhere, counter only where sectionCount applies)', () => {
    for (const page of ['index.html', join('projects', 'index.html'), join('blog', 'index.html'), join('contact', 'index.html')]) {
      const html = readFileSync(join(dist, page), 'utf-8');
      expect(html).toContain('ceefax-page-title');
      expect(html).not.toContain('section-counter-value');
    }
  });
});
