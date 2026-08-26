// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { initTeletextNav } from '../../src/lib/teletext-nav';

/**
 * Seam: the DOM wiring itself (initTeletextNav against a real-ish DOM).
 * Spec source: issues/07 review findings F1/F2/F5 — the flash-red path,
 * the passive live region and the wired modifier guard were previously
 * asserted only at decision level.
 *
 * The mount mirrors BaseLayout's production header shape: visible buffer
 * inside the tap-target button, announced text in a passive sr-only
 * sibling (#page-number-live) so screen readers see a plain live region.
 *
 * Note: initTeletextNav binds document-level listeners, which accumulate
 * across tests in this file (each closes over its own DOM snapshot, so
 * stale handlers only ever touch detached nodes). That is why assertions
 * below are scoped to the current test's nodes and use semantic
 * called/not-called checks rather than exact call counts.
 */

const CURRENT_PAGE = '206';
const ROUTES = { '206': '/projects/table-hunter/', '100': '/' };

/** Stand-in for window.location: records href writes, never navigates. */
let locationWrites: string[];
const ORIGINAL_HREF = 'https://siebrands.test/';
let currentHref: string;
let originalLocation: PropertyDescriptor | undefined;

beforeEach(() => {
  document.body.innerHTML = `
    <header class="ceefax-header">
      <button id="page-number-btn" class="ceefax-page-number" aria-label="Enter page number">
        <span class="ceefax-buffer">P<span id="page-number-display">${CURRENT_PAGE}</span></span>
      </button>
      <span id="page-number-live" class="sr-only" aria-live="polite" aria-atomic="true">${CURRENT_PAGE}</span>
      <span class="remote-page-display">${CURRENT_PAGE}</span>
      <span id="clock" class="ceefax-clock"></span>
    </header>`;
  locationWrites = [];
  currentHref = ORIGINAL_HREF;
  originalLocation =
    Object.getOwnPropertyDescriptor(window, 'location') ??
    Object.getOwnPropertyDescriptor(Object.getPrototypeOf(window), 'location');
  const locationStub = {};
  Object.defineProperty(locationStub, 'href', {
    enumerable: true,
    get: () => currentHref,
    set: (value: string) => {
      locationWrites.push(value);
      currentHref = value;
    },
  });
  Object.defineProperty(window, 'location', { value: locationStub, configurable: true });
});

afterEach(() => {
  vi.useRealTimers();
  if (originalLocation) Object.defineProperty(window, 'location', originalLocation);
});

/** Types digits through the real keyboard seam: keydown on document. */
function pressKeys(keys: string[]): KeyboardEvent[] {
  return keys.map((key) => {
    const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });
    document.dispatchEvent(event);
    return event;
  });
}

function headerDisplay(): HTMLElement {
  return document.getElementById('page-number-display')!;
}

describe('passive live region (F2)', () => {
  it('updates the announced text alongside the visible buffer while typing', () => {
    initTeletextNav({ routes: ROUTES, currentPage: CURRENT_PAGE });
    pressKeys(['5']);
    expect(headerDisplay().textContent).toBe('5__');
    expect(document.getElementById('page-number-live')?.textContent).toBe('5__');
  });
});

describe('wired modifier guard (F5)', () => {
  it.each([
    ['Cmd', { metaKey: true }],
    ['Ctrl', { ctrlKey: true }],
    ['Alt', { altKey: true }],
  ])(
    'lets %s+digit reach the browser — default not suppressed, nothing captured',
    (_modifier, modifiers) => {
      initTeletextNav({ routes: ROUTES, currentPage: CURRENT_PAGE });
      const event = new KeyboardEvent('keydown', { key: '1', cancelable: true, ...modifiers });
      const spy = vi.spyOn(event, 'preventDefault');
      document.dispatchEvent(event);
      expect(spy).not.toHaveBeenCalled();
      expect(headerDisplay().textContent).toBe(CURRENT_PAGE);
    },
  );

  it('still intercepts bare digits — preventDefault called, digit buffered', () => {
    initTeletextNav({ routes: ROUTES, currentPage: CURRENT_PAGE });
    const event = new KeyboardEvent('keydown', { key: '5', cancelable: true });
    const spy = vi.spyOn(event, 'preventDefault');
    document.dispatchEvent(event);
    expect(spy).toHaveBeenCalled();
    expect(headerDisplay().textContent).toBe('5__');
  });
});

describe('unmapped number handling (F1)', () => {
  beforeEach(() => {
    // rAF must be faked explicitly: the roll animation navigates from
    // inside its frame callback, so the fake clock has to drive it.
    vi.useFakeTimers({
      toFake: ['setTimeout', 'clearTimeout', 'clearInterval', 'Date', 'requestAnimationFrame'],
    });
  });

  it('flashes the buffer red for an unmapped number instead of routing', () => {
    initTeletextNav({ routes: ROUTES, currentPage: CURRENT_PAGE });
    pressKeys(['5', '5', '5']);
    const display = headerDisplay();
    expect(display.textContent).toBe('555');
    expect(display.classList.contains('invalid')).toBe(true);
    expect(display.classList.contains('navigating')).toBe(false);
    expect(display.classList.contains('typing')).toBe(false);
  });

  it('resets to the current page after ~800ms, everywhere, without navigating', () => {
    initTeletextNav({ routes: ROUTES, currentPage: CURRENT_PAGE });
    pressKeys(['5', '5', '5']);

    vi.advanceTimersByTime(799);
    expect(headerDisplay().classList.contains('invalid')).toBe(true);

    vi.advanceTimersByTime(1);
    expect(headerDisplay().classList.contains('invalid')).toBe(false);
    expect(headerDisplay().textContent).toBe(CURRENT_PAGE);
    // Reset fans out to every surface: announced text and remote display.
    expect(document.getElementById('page-number-live')?.textContent).toBe(CURRENT_PAGE);
    expect(document.querySelector('.remote-page-display')?.textContent).toBe(CURRENT_PAGE);
    // The URL must be untouched — /404 serves genuinely bad URLs only.
    expect(locationWrites).toEqual([]);
    expect(window.location.href).toBe(ORIGINAL_HREF);
  });

  it('still navigates for a mapped number — roll plays, then the route is followed', () => {
    initTeletextNav({ routes: ROUTES, currentPage: CURRENT_PAGE });
    pressKeys(['2', '0', '6']);
    vi.advanceTimersByTime(500); // roll duration is 400ms
    // Stale handlers from earlier tests roll too, so ≥1 write, all correct
    // (see the isolation note at the top of this file).
    expect(locationWrites.length).toBeGreaterThanOrEqual(1);
    expect(locationWrites.every((url) => url === '/projects/table-hunter/')).toBe(true);
    expect(window.location.href).toBe('/projects/table-hunter/');
  });
});
