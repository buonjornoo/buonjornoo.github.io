import { describe, expect, it } from 'vitest';
import { nextCurrentSection } from '../../src/lib/section-counter';

/**
 * Seam: the reading-progress decision core (src/lib/section-counter.ts).
 * Spec source: issues/13 AC — "header shows k/N, updating correctly
 * scrolling down AND up". Only reacts to headings newly entering the
 * observation band (isIntersecting: true); ignores exit events. That
 * asymmetry is what makes it correct in both directions — scrolling back
 * up re-triggers the heading above as it re-enters the band from below.
 */
describe('nextCurrentSection', () => {
  it('keeps the previous index when nothing is intersecting', () => {
    expect(nextCurrentSection([{ index: 2, isIntersecting: false }], 1)).toBe(1);
  });

  it('advances to a heading that newly enters the band (scrolling down)', () => {
    expect(nextCurrentSection([{ index: 1, isIntersecting: true }], 1)).toBe(2);
  });

  it('retreats to a heading that re-enters the band from below (scrolling up)', () => {
    expect(nextCurrentSection([{ index: 0, isIntersecting: true }], 3)).toBe(1);
  });

  it('ignores exit events entirely, even mixed in the same batch', () => {
    expect(
      nextCurrentSection(
        [
          { index: 0, isIntersecting: false },
          { index: 1, isIntersecting: false },
        ],
        2,
      ),
    ).toBe(2);
  });

  it('applies the last intersecting entry when a batch carries several', () => {
    expect(
      nextCurrentSection(
        [
          { index: 3, isIntersecting: true },
          { index: 4, isIntersecting: true },
        ],
        1,
      ),
    ).toBe(5);
  });

  it('starts at section 1 by convention, before any heading has crossed the band', () => {
    expect(nextCurrentSection([], 1)).toBe(1);
  });
});
