import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const dist = join(import.meta.dirname, '..', '..', 'dist');

function fullBleedFigureCount(html: string): number {
  return (html.match(/<figure[^>]*\bclass="[^"]*\bfull-bleed\b[^"]*"/g) ?? []).length;
}

/**
 * Seam: the rendered project pages (dist/) — the site's public interface.
 * Spec source: issues/15-full-bleed-figures.md acceptance criteria — a
 * 3-4 figure opt-in escape hatch from the 80ch prose column, scoped to
 * screen-flow figures only.
 */
describe('opt-in full-bleed figures', () => {
  it('marks 3-4 screen-flow figures full-bleed on the Workflow Evolution page', () => {
    const html = readFileSync(join(dist, 'projects', 'do24-workflow-evolution', 'index.html'), 'utf-8');
    const count = fullBleedFigureCount(html);
    expect(count).toBeGreaterThanOrEqual(3);
    expect(count).toBeLessThanOrEqual(4);
  });

  it('leaves the AR City Exploration cover/hero GIFs untouched (out of scope: issue 18)', () => {
    const html = readFileSync(join(dist, 'projects', 'ar-city-exploration', 'index.html'), 'utf-8');
    expect(fullBleedFigureCount(html)).toBe(0);
  });

  it('touches no other project page (all other figures stay in the 80ch column)', () => {
    const untouched = [
      'bikemap-route-planner',
      'bikemap-pause-mode',
      'arin-und-der-drache',
      'table-hunter',
      'cycling-coach',
      'do24-teal-ui',
    ];
    for (const slug of untouched) {
      const html = readFileSync(join(dist, 'projects', slug, 'index.html'), 'utf-8');
      expect(fullBleedFigureCount(html), `${slug} should have no full-bleed figures`).toBe(0);
    }
  });
});

describe('ADR 0001 — 80ch prose column', () => {
  const path = join(import.meta.dirname, '..', '..', 'docs', 'adr', '0001-80ch-prose-column.md');

  it('exists', () => {
    expect(existsSync(path)).toBe(true);
  });

  it('documents the full-bleed escape hatch as the trade-off being decided', () => {
    const md = readFileSync(path, 'utf-8');
    expect(md).toContain('80ch');
    expect(md.toLowerCase()).toContain('full-bleed');
  });
});
