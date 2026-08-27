import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const dist = join(import.meta.dirname, '..', '..', 'dist');

/**
 * Seam: the rendered site (dist/) — the remote rail's public markup.
 * Spec source: issues/11 AC — "Rail + footer present one consistent
 * mnemonic system" (designer-approved: rail badges become color-initial
 * R/G/Y/C, matching the r/g/y/c keyboard hotkeys and real Fastext
 * hardware, which keys by color, not by word).
 */
describe('remote rail mnemonic (issues/11)', () => {
  const html = readFileSync(join(dist, 'index.html'), 'utf-8');

  it('labels the four color badges R/G/Y/C, not word-initial letters', () => {
    expect(html).toMatch(/<a[^>]+class="remote-color remote-color-red"[^>]*>\s*R\s*<\/a>/);
    expect(html).toMatch(/<a[^>]+class="remote-color remote-color-green"[^>]*>\s*G\s*<\/a>/);
    expect(html).toMatch(/<a[^>]+class="remote-color remote-color-yellow"[^>]*>\s*Y\s*<\/a>/);
    expect(html).toMatch(/<a[^>]+class="remote-color remote-color-cyan"[^>]*>\s*C\s*<\/a>/);
  });

  it('keeps the full-word aria-labels unchanged by the letter swap', () => {
    expect(html).toContain('aria-label="Home, page 100"');
    expect(html).toContain('aria-label="Projects, page 200"');
    expect(html).toContain('aria-label="Blog, page 300"');
    expect(html).toContain('aria-label="Contact, page 400"');
  });
});

/**
 * Seam: the rendered site (dist/) — the contextual neighbour affordance
 * above the Fastext bar. Spec source: issues/11 — "a small ◀ 203 · 205 ▶
 * affordance ... showing the previous/next neighbours from issue 10's
 * sequence walk", worked example given verbatim against page 204.
 */
describe('sequential-paging neighbour affordance (issues/11)', () => {
  it('shows the correct wrapped neighbours on page 204 (Workflow Evolution)', () => {
    const html = readFileSync(
      join(dist, 'projects', 'do24-workflow-evolution', 'index.html'),
      'utf-8',
    );
    expect(html).toContain('page-nav-neighbours');
    expect(html).toMatch(/<a[^>]+href="\/projects\/ar-city-exploration\/"[^>]*>[^<]*203/);
    expect(html).toMatch(/<a[^>]+href="\/projects\/do24-teal-ui\/"[^>]*>[^<]*205/);
  });

  it('wraps forward from the last entry (400, Contact) to the first (100, Home)', () => {
    const html = readFileSync(join(dist, 'contact', 'index.html'), 'utf-8');
    expect(html).toMatch(/<a[^>]+href="\/"[^>]*>[^<]*100/);
  });

  it('omits the affordance on 404 — its page number is not in the route map', () => {
    const html = readFileSync(join(dist, '404.html'), 'utf-8');
    expect(html).not.toContain('page-nav-neighbours');
  });
});
