import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  capturesDigit,
  classifySwipe,
  formatHeaderDate,
  neighbourPageNumber,
  pageNumberForUrl,
  resolveFastextHotkey,
  resolveTarget,
} from '../../src/lib/teletext-nav';

/**
 * Seam: the teletext nav decision core (src/lib/teletext-nav.ts).
 * Spec source: issues/07 — "With Cmd/Ctrl/Alt held, digits reach the
 * browser (tab switching works); bare digits still navigate as before".
 */
describe('capturesDigit', () => {
  it('captures a bare digit', () => {
    expect(capturesDigit({ key: '5' })).toBe(true);
  });

  it('captures every digit 0–9 when bare', () => {
    for (let d = 0; d <= 9; d++) {
      expect(capturesDigit({ key: String(d) })).toBe(true);
    }
  });

  it('never captures Cmd+digit (browser tab switching)', () => {
    expect(capturesDigit({ key: '1', metaKey: true })).toBe(false);
    expect(capturesDigit({ key: '3', metaKey: true })).toBe(false);
  });

  it('never captures Ctrl+digit', () => {
    expect(capturesDigit({ key: '1', ctrlKey: true })).toBe(false);
  });

  it('never captures Alt+digit', () => {
    expect(capturesDigit({ key: '1', altKey: true })).toBe(false);
  });

  it('ignores non-digit keys even without modifiers', () => {
    expect(capturesDigit({ key: 'a' })).toBe(false);
    expect(capturesDigit({ key: 'Enter' })).toBe(false);
    expect(capturesDigit({ key: 'ArrowUp' })).toBe(false);
  });
});

/**
 * Seam: route resolution for typed page numbers.
 * Spec source: issues/07 — "Typing an unmapped number (e.g. 555) flashes the
 * buffer red, resets to the current page after ~800ms, leaves the URL
 * unchanged; /404 goes back to serving genuinely bad URLs only."
 */
describe('resolveTarget', () => {
  // Independent source of truth: the shipped route table, not a hand copy.
  const routes = JSON.parse(readFileSync('src/data/pageRoutes.json', 'utf-8')) as Record<string, string>;

  it('resolves the home page', () => {
    expect(resolveTarget(routes, '100')).toBe('/');
  });

  it('resolves a project page', () => {
    expect(resolveTarget(routes, '206')).toBe('/projects/table-hunter/');
  });

  it('resolves the game page', () => {
    expect(resolveTarget(routes, '210')).toBe('/game/arin-und-der-drache/');
  });

  it('returns null for an unmapped number — never /404', () => {
    expect(resolveTarget(routes, '555')).toBeNull();
  });

  it('returns null for numbers that merely look routable (999)', () => {
    expect(resolveTarget(routes, '999')).toBeNull();
  });
});

/**
 * Seam: reverse URL -> page-number lookup, the piece that lets arrow/swipe
 * paging know where it stands without trusting the `currentPage` prop
 * (which defaults to '100' for unmapped pages like /404 — issues/10).
 */
describe('pageNumberForUrl', () => {
  const routes = JSON.parse(readFileSync('src/data/pageRoutes.json', 'utf-8')) as Record<string, string>;

  it('resolves the home URL to 100', () => {
    expect(pageNumberForUrl(routes, '/')).toBe('100');
  });

  it('resolves a project URL to its page number', () => {
    expect(pageNumberForUrl(routes, '/projects/table-hunter/')).toBe('206');
  });

  it('resolves the game page (210, which 07 gave chrome to)', () => {
    expect(pageNumberForUrl(routes, '/game/arin-und-der-drache/')).toBe('210');
  });

  it('returns null for a URL absent from the route map — never guesses', () => {
    expect(pageNumberForUrl(routes, '/404/')).toBeNull();
  });
});

/**
 * Seam: the ascending-order walk with 400 -> 100 wraparound.
 * Spec source: issues/10 AC — "-> from page 209 reaches 210; from 400 wraps
 * to 100; <- walks the inverse direction."
 */
describe('neighbourPageNumber', () => {
  const routes = JSON.parse(readFileSync('src/data/pageRoutes.json', 'utf-8')) as Record<string, string>;

  it('walks forward from 209 to 210 (210 stays in the run)', () => {
    expect(neighbourPageNumber(routes, '209', 'next')).toBe('210');
  });

  it('walks backward from 210 to 209', () => {
    expect(neighbourPageNumber(routes, '210', 'prev')).toBe('209');
  });

  it('wraps forward from the last entry (400) to the first (100)', () => {
    expect(neighbourPageNumber(routes, '400', 'next')).toBe('100');
  });

  it('wraps backward from the first entry (100) to the last (400)', () => {
    expect(neighbourPageNumber(routes, '100', 'prev')).toBe('400');
  });

  it('returns null when the current number is not itself in the map', () => {
    expect(neighbourPageNumber(routes, '555', 'next')).toBeNull();
  });
});

/**
 * Seam: fixed Fastext keyboard mnemonics — bare r/g/y/c always resolve to
 * Home/Projects/Blog/Contact, on every page, independent of context.
 * Spec source: issues/11 AC — "r/g/y/c navigate to /, /projects/, /blog/,
 * /contact/ from every BaseLayout page"; boundaries reject contextual
 * Fastext destinations (see ADR 0002), so these four must never vary.
 */
describe('resolveFastextHotkey', () => {
  it('resolves r to Home', () => {
    expect(resolveFastextHotkey({ key: 'r' })).toBe('/');
  });

  it('resolves g to Projects', () => {
    expect(resolveFastextHotkey({ key: 'g' })).toBe('/projects/');
  });

  it('resolves y to Blog', () => {
    expect(resolveFastextHotkey({ key: 'y' })).toBe('/blog/');
  });

  it('resolves c to Contact', () => {
    expect(resolveFastextHotkey({ key: 'c' })).toBe('/contact/');
  });

  it('ignores unrelated keys', () => {
    expect(resolveFastextHotkey({ key: 'a' })).toBeNull();
    expect(resolveFastextHotkey({ key: 'R' })).toBeNull();
  });

  it('never captures Cmd/Ctrl/Alt+letter — those belong to the browser', () => {
    expect(resolveFastextHotkey({ key: 'r', metaKey: true })).toBeNull();
    expect(resolveFastextHotkey({ key: 'g', ctrlKey: true })).toBeNull();
    expect(resolveFastextHotkey({ key: 'c', altKey: true })).toBeNull();
  });
});

/**
 * Seam: the header date format (issues/22 — DESIGNSYSTEM.md header table).
 * Spec: "THU 27 AUG" — 3-letter weekday, 2-digit day, 3-letter month, all
 * caps, space-separated, no comma, no year.
 */
describe('formatHeaderDate', () => {
  it('formats a Thursday as "THU 27 AUG"', () => {
    // 2026-08-27 is a Thursday.
    expect(formatHeaderDate(new Date(2026, 7, 27))).toBe('THU 27 AUG');
  });

  it('pads a single-digit day to two digits', () => {
    // 2026-08-02 is a Sunday.
    expect(formatHeaderDate(new Date(2026, 7, 2))).toBe('SUN 02 AUG');
  });

  it('formats a different month correctly', () => {
    // 2026-01-01 is a Thursday.
    expect(formatHeaderDate(new Date(2026, 0, 1))).toBe('THU 01 JAN');
  });
});

/**
 * Seam: touch-gesture classification for mobile paging. Threshold-gated so
 * small drags and vertical scrolling never get mistaken for a page swipe
 * (issues/10 AC — "swipe doesn't fight ... vertical scroll gestures").
 */
describe('classifySwipe', () => {
  it('classifies a leftward drag past the threshold as next', () => {
    expect(classifySwipe({ x: 200, y: 100 }, { x: 100, y: 105 })).toBe('next');
  });

  it('classifies a rightward drag past the threshold as prev', () => {
    expect(classifySwipe({ x: 100, y: 100 }, { x: 200, y: 95 })).toBe('prev');
  });

  it('ignores a drag shorter than the threshold', () => {
    expect(classifySwipe({ x: 100, y: 100 }, { x: 120, y: 100 })).toBeNull();
  });

  it('ignores a vertical-dominant drag (scrolling)', () => {
    expect(classifySwipe({ x: 100, y: 100 }, { x: 130, y: 300 })).toBeNull();
  });
});

/**
 * Seam: the module's own source, as a style drift guard.
 * Spec source: issues/07 review finding F4 — new TypeScript must not
 * carry `var`; "ported verbatim" does not excuse it past review.
 */
describe('source hygiene', () => {
  const source = readFileSync('src/lib/teletext-nav.ts', 'utf-8');

  it('declares no var — const/let only', () => {
    expect(source).not.toMatch(/\bvar\s/);
  });
});
