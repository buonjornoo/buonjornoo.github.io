// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import pageRoutes from '../../src/data/pageRoutes.json';
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
/** Current pathname arrow/swipe paging reads via pageNumberForUrl. */
let currentPathname: string;
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
    </header>
    <aside id="remote-rail" class="remote-rail">
      <button type="button" class="remote-key" data-digit="2">2</button>
      <button type="button" class="remote-key" data-digit="0">0</button>
    </aside>
    <dialog id="remote-dialog" class="remote-dialog">
      <button type="button" class="remote-key" data-digit="2">2</button>
      <button type="button" class="remote-key" data-digit="0">0</button>
    </dialog>`;
  locationWrites = [];
  currentHref = ORIGINAL_HREF;
  currentPathname = '/projects/table-hunter/';
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
  Object.defineProperty(locationStub, 'pathname', {
    enumerable: true,
    get: () => currentPathname,
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

function remoteKeys(digit: string): HTMLElement[] {
  return Array.from(document.querySelectorAll(`.remote-key[data-digit="${digit}"]`));
}

/** Dispatches an arrow-key press through the real keydown seam. */
function pressArrow(key: 'ArrowLeft' | 'ArrowRight', modifiers: KeyboardEventInit = {}): KeyboardEvent {
  const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...modifiers });
  document.dispatchEvent(event);
  return event;
}

/** Dispatches a touchstart -> touchend pair through the real swipe seam. */
function swipe(start: { x: number; y: number }, end: { x: number; y: number }): void {
  const touchStart = new Event('touchstart', { bubbles: true, cancelable: true });
  Object.defineProperty(touchStart, 'touches', { value: [{ clientX: start.x, clientY: start.y }] });
  document.dispatchEvent(touchStart);

  const touchEnd = new Event('touchend', { bubbles: true, cancelable: true });
  Object.defineProperty(touchEnd, 'changedTouches', { value: [{ clientX: end.x, clientY: end.y }] });
  document.dispatchEvent(touchEnd);
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

/**
 * Spec source: issues/08 AC 1 — "typing 102 navigates to /experience/".
 * Asserted here against the real route map, through the keyboard seam, so the
 * claim is covered end to end rather than at payload level only (F9).
 */
describe('experience matrix, page 102 (issues/08)', () => {
  beforeEach(() => {
    vi.useFakeTimers({
      toFake: ['setTimeout', 'clearTimeout', 'clearInterval', 'Date', 'requestAnimationFrame'],
    });
  });

  it('navigates to /experience/ when 1-0-2 is typed', () => {
    initTeletextNav({ routes: pageRoutes, currentPage: CURRENT_PAGE });
    pressKeys(['1', '0', '2']);
    vi.advanceTimersByTime(500); // roll duration is 400ms

    expect(locationWrites.length).toBeGreaterThanOrEqual(1);
    expect(locationWrites.every((url) => url === '/experience/')).toBe(true);
    expect(headerDisplay().classList.contains('invalid')).toBe(false);
  });
});

/**
 * Seam: fixed Fastext hotkeys (r/g/y/c) wired to real keydown events.
 * Spec source: issues/11 AC — "r/g/y/c navigate to /, /projects/, /blog/,
 * /contact/ from every BaseLayout page"; these are direct navigations (no
 * roll animation), mirroring a plain click on the Fastext footer anchors.
 */
describe('fastext hotkeys (issues/11)', () => {
  it('r navigates straight to Home', () => {
    initTeletextNav({ routes: ROUTES, currentPage: CURRENT_PAGE });
    const event = new KeyboardEvent('keydown', { key: 'r', cancelable: true, bubbles: true });
    const spy = vi.spyOn(event, 'preventDefault');
    document.dispatchEvent(event);
    expect(spy).toHaveBeenCalled();
    expect(window.location.href).toBe('/');
  });

  it('g/y/c navigate to Projects/Blog/Contact', () => {
    initTeletextNav({ routes: ROUTES, currentPage: CURRENT_PAGE });
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'g', cancelable: true, bubbles: true }));
    expect(window.location.href).toBe('/projects/');
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'y', cancelable: true, bubbles: true }));
    expect(window.location.href).toBe('/blog/');
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'c', cancelable: true, bubbles: true }));
    expect(window.location.href).toBe('/contact/');
  });

  it.each([
    ['Cmd', { metaKey: true }],
    ['Ctrl', { ctrlKey: true }],
    ['Alt', { altKey: true }],
  ])('lets %s+r reach the browser untouched', (_modifier, modifiers) => {
    initTeletextNav({ routes: ROUTES, currentPage: CURRENT_PAGE });
    const event = new KeyboardEvent('keydown', { key: 'r', cancelable: true, bubbles: true, ...modifiers });
    const spy = vi.spyOn(event, 'preventDefault');
    document.dispatchEvent(event);
    expect(spy).not.toHaveBeenCalled();
    expect(window.location.href).toBe(ORIGINAL_HREF);
  });

  it('does not hijack r/g/y/c typed into a text field', () => {
    document.body.insertAdjacentHTML('beforeend', '<input id="scratch" type="text" />');
    initTeletextNav({ routes: ROUTES, currentPage: CURRENT_PAGE });
    const input = document.getElementById('scratch') as HTMLInputElement;
    input.focus();
    const event = new KeyboardEvent('keydown', { key: 'r', cancelable: true, bubbles: true });
    Object.defineProperty(event, 'target', { value: input });
    document.dispatchEvent(event);
    expect(window.location.href).toBe(ORIGINAL_HREF);
  });
});

/**
 * Seam: sequential paging wired to real keyboard/touch events, against the
 * real route map, through the same roll animation as digit-nav.
 * Spec source: issues/10 AC.
 */
describe('sequential paging (issues/10)', () => {
  beforeEach(() => {
    vi.useFakeTimers({
      toFake: ['setTimeout', 'clearTimeout', 'clearInterval', 'Date', 'requestAnimationFrame'],
    });
  });

  it('ArrowRight from 209 reaches 210 (210 stays in the run)', () => {
    currentPathname = '/projects/arin-und-der-drache/'; // 209
    initTeletextNav({ routes: pageRoutes, currentPage: '209' });
    pressArrow('ArrowRight');
    vi.advanceTimersByTime(500);
    expect(locationWrites.length).toBeGreaterThanOrEqual(1);
    expect(locationWrites.every((url) => url === '/game/arin-und-der-drache/')).toBe(true);
  });

  it('ArrowRight from 400 wraps to 100', () => {
    currentPathname = '/contact/'; // 400
    initTeletextNav({ routes: pageRoutes, currentPage: '400' });
    pressArrow('ArrowRight');
    vi.advanceTimersByTime(500);
    expect(locationWrites.length).toBeGreaterThanOrEqual(1);
    expect(locationWrites.every((url) => url === '/')).toBe(true);
  });

  it('ArrowLeft walks the inverse direction', () => {
    currentPathname = '/game/arin-und-der-drache/'; // 210
    initTeletextNav({ routes: pageRoutes, currentPage: '210' });
    pressArrow('ArrowLeft');
    vi.advanceTimersByTime(500);
    expect(locationWrites.length).toBeGreaterThanOrEqual(1);
    expect(locationWrites.every((url) => url === '/projects/arin-und-der-drache/')).toBe(true);
  });

  it('does nothing on a page absent from the route map — no navigation, no error', () => {
    currentPathname = '/404/';
    initTeletextNav({ routes: pageRoutes, currentPage: '100' }); // prop defaults to 100, must not be trusted
    expect(() => pressArrow('ArrowRight')).not.toThrow();
    vi.advanceTimersByTime(500);
    expect(locationWrites).toEqual([]);
  });

  it.each([
    ['Cmd', { metaKey: true }],
    ['Ctrl', { ctrlKey: true }],
    ['Alt', { altKey: true }],
  ])('lets %s+ArrowRight reach the browser untouched', (_modifier, modifiers) => {
    currentPathname = '/projects/arin-und-der-drache/';
    initTeletextNav({ routes: pageRoutes, currentPage: '209' });
    const event = pressArrow('ArrowRight', modifiers);
    vi.advanceTimersByTime(500);
    expect(locationWrites).toEqual([]);
    expect(event.defaultPrevented).toBe(false);
  });

  it('swipe left mirrors ArrowRight (next)', () => {
    currentPathname = '/projects/arin-und-der-drache/'; // 209
    initTeletextNav({ routes: pageRoutes, currentPage: '209' });
    swipe({ x: 300, y: 200 }, { x: 100, y: 205 });
    vi.advanceTimersByTime(500);
    expect(locationWrites.length).toBeGreaterThanOrEqual(1);
    expect(locationWrites.every((url) => url === '/game/arin-und-der-drache/')).toBe(true);
  });

  it('swipe right mirrors ArrowLeft (prev)', () => {
    currentPathname = '/game/arin-und-der-drache/'; // 210
    initTeletextNav({ routes: pageRoutes, currentPage: '210' });
    swipe({ x: 100, y: 200 }, { x: 300, y: 195 });
    vi.advanceTimersByTime(500);
    expect(locationWrites.length).toBeGreaterThanOrEqual(1);
    expect(locationWrites.every((url) => url === '/projects/arin-und-der-drache/')).toBe(true);
  });

  it('a short/vertical drag does not trigger navigation (does not fight scrolling)', () => {
    currentPathname = '/projects/arin-und-der-drache/';
    initTeletextNav({ routes: pageRoutes, currentPage: '209' });
    swipe({ x: 100, y: 100 }, { x: 130, y: 400 }); // vertical scroll gesture
    vi.advanceTimersByTime(500);
    expect(locationWrites).toEqual([]);
  });
});

/**
 * Seam: rail/dialog button "pressed" sync driven by real keyboard digits.
 * Spec source: issues/14 AC — "Typing digits visibly depresses the matching
 * rail buttons"; "Mobile dialog keypad: same sync when open" (satisfied for
 * free here since both surfaces share the same `.remote-key[data-digit]`
 * selector, not by special-casing the dialog).
 */
describe('key-sync animation (issues/14)', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
  });

  it('depresses the matching digit on both the rail and dialog keypads', () => {
    initTeletextNav({ routes: ROUTES, currentPage: CURRENT_PAGE });
    pressKeys(['2']);
    const keys = remoteKeys('2');
    expect(keys).toHaveLength(2);
    expect(keys.every((el) => el.classList.contains('pressed'))).toBe(true);
    // The other digit's buttons are untouched.
    expect(remoteKeys('0').some((el) => el.classList.contains('pressed'))).toBe(false);
  });

  it('releases the pressed state after the flash duration', () => {
    initTeletextNav({ routes: ROUTES, currentPage: CURRENT_PAGE });
    pressKeys(['2']);
    vi.advanceTimersByTime(150);
    expect(remoteKeys('2').every((el) => el.classList.contains('pressed'))).toBe(false);
  });

  it('restarts the flash on a repeated same digit instead of cutting it short (e.g. typing "200")', () => {
    initTeletextNav({ routes: ROUTES, currentPage: CURRENT_PAGE });
    pressKeys(['2', '0']);
    vi.advanceTimersByTime(100);
    pressKeys(['0']); // second '0' — should restart its own flash timer
    vi.advanceTimersByTime(100); // 200ms since the first '0', but only 100ms since the second
    expect(remoteKeys('0').every((el) => el.classList.contains('pressed'))).toBe(true);
    vi.advanceTimersByTime(50);
    expect(remoteKeys('0').every((el) => el.classList.contains('pressed'))).toBe(false);
  });

  it('also depresses on a direct remote-key click (shared pressDigit path)', () => {
    initTeletextNav({ routes: ROUTES, currentPage: CURRENT_PAGE });
    remoteKeys('2')[0].dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(remoteKeys('2').every((el) => el.classList.contains('pressed'))).toBe(true);
  });
});
