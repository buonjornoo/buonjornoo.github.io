/**
 * Decision core for Ceefax keyboard navigation.
 *
 * Kept as pure functions so the capture rules are testable directly
 * (tests/unit/teletext-nav.test.ts); BaseLayout wires them to real DOM events.
 */

export interface DigitKeyEvent {
  key: string;
  metaKey?: boolean;
  ctrlKey?: boolean;
  altKey?: boolean;
}

/**
 * True when this keypress is a bare digit that teletext page nav owns.
 * Modified digits (Cmd/Ctrl/Alt) belong to the browser — tab switching,
 * bookmarks — and must pass through untouched (issues/07 defect 1).
 */
export function capturesDigit(e: DigitKeyEvent): boolean {
  if (e.metaKey || e.ctrlKey || e.altKey) return false;
  return e.key >= '0' && e.key <= '9';
}

/**
 * Resolves a fully typed 3-digit page number against the route table.
 * Returns the URL to navigate to, or null when unmapped — an unknown page
 * must never route to /404; it flashes red instead (issues/07 defect 3).
 */
export function resolveTarget(
  routes: Record<string, string>,
  typed: string,
): string | null {
  return Object.prototype.hasOwnProperty.call(routes, typed) ? routes[typed] : null;
}

export interface TeletextNavConfig {
  routes: Record<string, string>;
  currentPage: string;
}

/** How long an unmapped number stays red before the buffer resets. */
const INVALID_RESET_MS = 800;

/**
 * Wires teletext navigation to the page: keyboard digits, remote keypad
 * buttons, the roll animation, the live clock and the remote dialog.
 * Ported verbatim from BaseLayout's former inline script so behaviour is
 * unchanged; the decision rules above are the tested seam.
 */
export function initTeletextNav({ routes, currentPage }: TeletextNavConfig): void {
  let typed = '';
  let typingTimeout: ReturnType<typeof setTimeout> | undefined;
  let invalidTimeout: ReturnType<typeof setTimeout> | undefined;
  const displays = document.querySelectorAll(
    '#page-number-display, #page-number-live, .remote-page-display',
  );

  function setDisplays(text: string) {
    displays.forEach(function (el) { el.textContent = text; });
  }

  function setDisplayClass(className: string, on: boolean) {
    displays.forEach(function (el) {
      el.classList.toggle(className, on);
    });
  }

  // Shared digit-accumulation logic, used by keyboard input and every
  // remote keypad button (rail + dialog).
  function pressDigit(digit: string) {
    typed += digit;
    setDisplays(typed.padEnd(3, '_'));
    setDisplayClass('typing', true);
    clearTimeout(typingTimeout);
    // A new entry supersedes any pending invalid-flash reset.
    setDisplayClass('invalid', false);
    clearTimeout(invalidTimeout);

    if (typed.length === 3) {
      const target = typed;
      typed = '';
      setDisplayClass('typing', false);
      setDisplayClass('navigating', true);
      startRoll(target);
    } else {
      typingTimeout = setTimeout(function () {
        typed = '';
        setDisplays(currentPage);
        setDisplayClass('typing', false);
      }, 2000);
    }
  }

  // Animate the page-number display(s) counting from the current page
  // to the typed target over a fixed capped duration, then navigate.
  // Unmapped numbers flash red and reset instead — never a /404 hop.
  function startRoll(targetStr: string) {
    const url = resolveTarget(routes, targetStr);

    if (url === null) {
      setDisplays(targetStr);
      setDisplayClass('navigating', false);
      setDisplayClass('invalid', true);
      clearTimeout(invalidTimeout);
      invalidTimeout = setTimeout(function () {
        setDisplayClass('invalid', false);
        setDisplays(currentPage);
      }, INVALID_RESET_MS);
      return;
    }

    // Narrow past the null check into a const so the frame closure keeps
    // the narrowed type.
    const destination: string = url;
    const target = parseInt(targetStr, 10);
    const start = parseInt(currentPage, 10) || 0;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      setDisplays(String(target).padStart(3, '0'));
      window.location.href = destination;
      return;
    }

    const duration = 400;
    let startTime: number | null = null;
    let lastRendered: number | null = null;

    function frame(timestamp: number) {
      if (startTime === null) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(start + (target - start) * eased);

      if (value !== lastRendered) {
        setDisplays(String(value).padStart(3, '0'));
        lastRendered = value;
      }

      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        window.location.href = destination;
      }
    }

    requestAnimationFrame(frame);
  }

  // Keyboard number input
  document.addEventListener('keydown', function (e) {
    if (e.target instanceof Element && e.target.closest('input, textarea, [contenteditable]')) return;

    if (capturesDigit(e)) {
      e.preventDefault();
      pressDigit(e.key);
    }
  });

  // Remote keypad buttons (rail + dialog) share the same digit logic
  document.querySelectorAll('.remote-key').forEach(function (btn) {
    btn.addEventListener('click', function () {
      pressDigit((btn as HTMLElement).dataset.digit ?? '');
    });
  });

  // Live clock
  function updateClock() {
    const el = document.getElementById('clock');
    if (!el) return;
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    el.textContent = h + ':' + m + ':' + s;
  }
  setInterval(updateClock, 1000);
  updateClock();

  // Tap page number: open the remote dialog if the rail isn't visible
  // (rail is shown via CSS from 1100px up, so below that there's
  // nothing to click through to and the dialog is the only entry point)
  document.getElementById('page-number-btn')?.addEventListener('click', function () {
    if (window.innerWidth >= 1100) return;
    (document.getElementById('remote-dialog') as HTMLDialogElement | null)?.showModal();
  });

  // Dialog: close button
  document.getElementById('remote-dialog-close')?.addEventListener('click', function () {
    (document.getElementById('remote-dialog') as HTMLDialogElement | null)?.close();
  });
}
