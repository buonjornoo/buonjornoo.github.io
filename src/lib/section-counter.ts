/**
 * Decision core for the reading-progress counter (issues/13): "k/N" in the
 * page-title header slot on long-form pages, driven by `##` headings.
 *
 * Kept as a pure function so the direction-agnostic logic is testable
 * directly (tests/unit/section-counter.test.ts); initSectionCounter wires
 * it to a real IntersectionObserver.
 */

export interface HeadingIntersection {
  /** 0-based position of the heading within the observed list. */
  index: number;
  isIntersecting: boolean;
}

/**
 * Only reacts to headings newly entering the observation band
 * (isIntersecting: true); exit events are ignored. That asymmetry is what
 * makes this correct in both scroll directions: scrolling back up
 * re-triggers the heading above as it re-enters the band from below, so
 * the count walks back down without any separate "which way am I
 * scrolling" logic.
 */
export function nextCurrentSection(
  entries: HeadingIntersection[],
  previousIndex: number,
): number {
  let next = previousIndex;
  for (const entry of entries) {
    if (entry.isIntersecting) next = entry.index + 1;
  }
  return next;
}

export interface SectionCounterConfig {
  /** Total `##` sections on this page; 0 (or absent) means no counter. */
  count: number;
}

/**
 * Wires the reading-progress counter to the page: observes every
 * `.prose-teletext h2`, keeps both the full and compact counter copies in
 * sync. A thin band near the top of the viewport (rather than the whole
 * viewport) is what makes "isIntersecting: true" mean "just crossed",
 * which is the event nextCurrentSection relies on.
 */
export function initSectionCounter({ count }: SectionCounterConfig): void {
  if (!count || count < 1) return;

  const headings = Array.from(document.querySelectorAll<HTMLElement>('.prose-teletext h2'));
  if (headings.length === 0) return;

  const displays = document.querySelectorAll('.section-counter-value');
  let current = 1;

  function render() {
    displays.forEach((el) => {
      el.textContent = `${current}/${headings.length}`;
    });
  }
  render();

  const observer = new IntersectionObserver(
    (observerEntries) => {
      const mapped = observerEntries.map((entry) => ({
        index: headings.indexOf(entry.target as HTMLElement),
        isIntersecting: entry.isIntersecting,
      }));
      current = nextCurrentSection(mapped, current);
      render();
    },
    { rootMargin: '-10% 0px -85% 0px' },
  );

  headings.forEach((heading) => observer.observe(heading));
}
