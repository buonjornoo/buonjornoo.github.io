import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const dist = join(import.meta.dirname, '..', '..', 'dist');

/**
 * Seam: the rendered site (dist/) — the static site's public interface.
 * Spec source: issues/07 acceptance criteria.
 */
describe('rendered home page', () => {
  const html = readFileSync(join(dist, 'index.html'), 'utf-8');

  // The header page-number control block, from its button to end of header.
  const headerStart = html.indexOf('id="page-number-btn"');
  const headerEnd = html.indexOf('</header>');
  const headerBlock = html.slice(headerStart, headerEnd);

  it('wraps the header buffer in a polite atomic live region', () => {
    expect(headerBlock).toContain('aria-live="polite"');
    expect(headerBlock).toContain('aria-atomic="true"');
  });

  // Review F2: a control named via aria-label can swallow inner text
  // changes in some screen readers, so the announced text must sit in a
  // passive wrapper beside the button — never inside it.
  it('keeps the live region outside the button (passive-wrapper pattern)', () => {
    const button = html.match(/<button[^>]*id="page-number-btn"[\s\S]*?<\/button>/)?.[0] ?? '';
    expect(button).not.toContain('aria-live');
  });

  it('carries a passive polite atomic live region for typed digits', () => {
    const liveTag = html.match(/<span[^>]*id="page-number-live"[^>]*>/)?.[0] ?? '';
    expect(liveTag).toContain('aria-live="polite"');
    expect(liveTag).toContain('aria-atomic="true"');
  });

  it('keeps the remote displays live too (pattern parity)', () => {
    expect(html.match(/aria-live="polite"/g)?.length).toBeGreaterThanOrEqual(3);
  });
});

/**
 * Seam: the game page at /game/arin-und-der-drache/ (public/, copied
 * verbatim into dist/). Spec source: issues/07 defect 2 — Ceefax chrome
 * with working links back, and NO digit-nav listener: the keyboard stays
 * the game's (up/space/r/escape via Kaboom).
 */
describe('rendered game page (210)', () => {
  const html = readFileSync(
    join(dist, 'game', 'arin-und-der-drache', 'index.html'),
    'utf-8',
  );

  it('shows the Ceefax header with service name, page number and clock', () => {
    expect(html).toContain('SIEBRANDS');
    expect(html).toMatch(/P\s*210/);
    expect(html).toContain('id="clock"');
  });

  it('links back home from the service name', () => {
    expect(html).toMatch(/<a[^>]+href="\/"[^>]*>\s*SIEBRANDS\s*<\/a>/);
  });

  it('carries the full Fastext colour bar with working links', () => {
    expect(html).toMatch(/<a[^>]+href="\/"[^>]*class="[^"]*fastext-red/);
    expect(html).toMatch(/<a[^>]+href="\/projects\/"[^>]*class="[^"]*fastext-green/);
    expect(html).toMatch(/<a[^>]+href="\/blog\/"[^>]*class="[^"]*fastext-yellow/);
    expect(html).toMatch(/<a[^>]+href="\/contact\/"[^>]*class="[^"]*fastext-cyan/);
  });

  it('never loads digit navigation — the keyboard belongs to the game', () => {
    expect(html).not.toContain('teletext-nav');
    expect(html).not.toContain('pageRoutes');
    expect(html).not.toContain("addEventListener('keydown'");
    expect(html).not.toContain('pressDigit');
  });

  it('still boots the game untouched', () => {
    expect(html).toContain('kaboom@3000.1.17');
    expect(html).toContain('style.js');
    expect(html).toContain('figuren.js');
    expect(html).toContain('game.js');
  });

  it('labels its chrome in English, matching every other page (review F3)', () => {
    // Verbatim parity with BaseLayout's header/fastext labels.
    expect(html).toContain('aria-label="SIEBRANDS — go to home page"');
    expect(html).toContain('aria-label="Quick navigation"');
    expect(html).not.toContain('zur Startseite');
    expect(html).not.toContain('Schnellnavigation');
  });
});
