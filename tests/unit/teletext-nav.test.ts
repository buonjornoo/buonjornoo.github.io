import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { capturesDigit, resolveTarget } from '../../src/lib/teletext-nav';

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
