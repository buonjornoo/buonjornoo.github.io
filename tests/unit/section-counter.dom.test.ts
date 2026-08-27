// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { initSectionCounter } from '../../src/lib/section-counter';

/**
 * Seam: the DOM wiring itself (initSectionCounter against a real-ish DOM),
 * mirroring teletext-nav.dom.test.ts's pattern of faking the one browser
 * API the decision core can't be tested through directly.
 * Spec source: issues/13 AC — counter text lives in both a full ("Title
 * k/N") and a compact ("k/N") copy, kept in sync, and reflects the heading
 * that most recently crossed the observation band in either direction.
 */

class MockIntersectionObserver {
  static instances: MockIntersectionObserver[] = [];
  callback: IntersectionObserverCallback;
  observed: Element[] = [];

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
    MockIntersectionObserver.instances.push(this);
  }

  observe(el: Element) {
    this.observed.push(el);
  }

  unobserve() {}
  disconnect() {}

  /** Test helper: fire a batch of entries keyed by observed-list index. */
  fire(entries: Array<{ index: number; isIntersecting: boolean }>) {
    const fabricated = entries.map(
      ({ index, isIntersecting }) =>
        ({ target: this.observed[index], isIntersecting }) as IntersectionObserverEntry,
    );
    this.callback(fabricated, this as unknown as IntersectionObserver);
  }
}

let originalIntersectionObserver: typeof IntersectionObserver | undefined;

beforeEach(() => {
  MockIntersectionObserver.instances = [];
  originalIntersectionObserver = window.IntersectionObserver;
  // @ts-expect-error -- test double, real constructor shape not needed
  window.IntersectionObserver = MockIntersectionObserver;
  document.body.innerHTML = `
    <div class="ceefax-page-title">
      <span class="page-title-full">Workflow Evolution <span class="section-counter-value"></span></span>
      <span class="page-title-compact section-counter-value"></span>
    </div>
    <div class="prose-teletext">
      <h2 id="one">One</h2>
      <h2 id="two">Two</h2>
      <h2 id="three">Three</h2>
    </div>`;
});

afterEach(() => {
  if (originalIntersectionObserver) window.IntersectionObserver = originalIntersectionObserver;
});

function counterTexts(): string[] {
  return Array.from(document.querySelectorAll('.section-counter-value')).map(
    (el) => el.textContent ?? '',
  );
}

describe('initSectionCounter', () => {
  it('renders 1/N immediately, before any heading has crossed the band', () => {
    initSectionCounter({ count: 3 });
    expect(counterTexts()).toEqual(['1/3', '1/3']);
  });

  it('observes every ## heading', () => {
    initSectionCounter({ count: 3 });
    expect(MockIntersectionObserver.instances[0].observed).toHaveLength(3);
  });

  it('advances both counter copies together when heading 2 enters the band', () => {
    initSectionCounter({ count: 3 });
    MockIntersectionObserver.instances[0].fire([{ index: 1, isIntersecting: true }]);
    expect(counterTexts()).toEqual(['2/3', '2/3']);
  });

  it('walks back down when scrolling back up past an earlier heading', () => {
    initSectionCounter({ count: 3 });
    const observer = MockIntersectionObserver.instances[0];
    observer.fire([{ index: 2, isIntersecting: true }]);
    expect(counterTexts()).toEqual(['3/3', '3/3']);
    observer.fire([{ index: 0, isIntersecting: true }]);
    expect(counterTexts()).toEqual(['1/3', '1/3']);
  });

  it('does nothing when the page has no counter (count 0)', () => {
    initSectionCounter({ count: 0 });
    expect(MockIntersectionObserver.instances).toHaveLength(0);
  });
});
