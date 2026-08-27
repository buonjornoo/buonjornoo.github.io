# 10 — Sequential Paging (←/→ keys + swipe)

| Field | Value |
|---|---|
| **Type** | AFK |
| **Blocked by** | 07 (page 210 must have chrome before the walk passes through it) · 17 (drift guard must vouch for the number map before paging trusts it) |
| **Target Modules** | `src/layouts/BaseLayout.astro` inline script (+ reverse URL→number lookup — does not exist today), `src/styles/global.css` if needed |
| **Source** | `docs/PLAN-teletext-system.md` Phase 4 item 10 |
| **Linear** | [JOR-54](https://linear.app/jornesiebrands/issue/JOR-54) |
| **Status** | **shipped, deployed to main** (`22fb947`, 2026-08-27) — reviewed via `/code-review` (Standards: 0 hard violations; Spec: swipe-vs-horizontal-scroll conflict on `overflow-x: auto` code blocks and two under-asserted ACs noted, not blocking, user approved push as-is). (2026-08-27: TDD red→green. Decision core in `src/lib/teletext-nav.ts` gained three pure functions: `pageNumberForUrl` (reverse URL→number lookup — deliberately independent of the `currentPage` prop, which defaults to `'100'` for unmapped pages like `/404` and must not be trusted), `neighbourPageNumber` (ascending walk over `pageRoutes.json` with 400↔100 wraparound), `classifySwipe` (threshold-gated horizontal/vertical gesture classification, 50px minimum + horizontal-dominant check so scrolling is never mistaken for paging). `initTeletextNav` wires ArrowLeft/ArrowRight (modifier-guarded like digit capture — Cmd/Ctrl/Alt+arrow passes through untouched) and passive touchstart/touchend listeners to a shared `navigateNeighbour` helper that reuses `startRoll`, so the buffer rolls identically to digit-nav and the existing `prefers-reduced-motion` short-circuit in `startRoll` applies for free. 23 new tests (13 pure-function in `teletext-nav.test.ts`, 10 DOM-wired in `teletext-nav.dom.test.ts` covering real keyboard/touch events against the real route table, the 209→210/400→100 cases, the unmapped-page no-op, and the modifier guard) — suite now 150/150 across 10 files (was 127). `npm run check`: 0 errors/0 warnings. `npm run build` clean, drift guard passes. Hand-verified in a real Chrome instance via `npm run preview`: dispatched real `KeyboardEvent`/`TouchEvent`s in-page (the extension's synthetic OS-level key/touch dispatch didn't reach the tab in this sandbox — a background-tab `requestAnimationFrame` throttling artifact unrelated to the feature, confirmed by forcing `prefers-reduced-motion` to bypass the rAF path) — confirmed ArrowRight 209→/game/arin-und-der-drache/, ArrowRight 400→/, unmapped-page arrows/swipe no-op with `defaultPrevented: false`, vertical drag does not navigate, horizontal swipe-left navigates like ArrowRight. Note: page 210 (`public/game/arin-und-der-drache/index.html`) is a static file outside BaseLayout with no teletext-nav wiring at all (no digit-nav either) — pre-existing from issue 07, out of this ticket's `BaseLayout.astro`-scoped target modules; 210 is reachable via the walk (confirmed) but doesn't itself originate arrow/swipe navigation. Not committed, not pushed.) |

## What to build

Arrow keys walk every entry in `pageRoutes.json` in ascending numeric order, wrapping 400 → 100. One rule, no exceptions; **210 stays in the run** because 07 gives it chrome. Mobile: horizontal swipe on the same sequence.

The walk needs a reverse lookup (current URL → current page number) so the arrows know where they stand. On a page with no number (e.g. `/404`, or any unmapped URL), the arrows no-op gracefully rather than guessing.

## Acceptance criteria

- [x] `→` from page 209 reaches 210; from 400 wraps to 100; `←` walks the inverse direction
- [x] Horizontal swipe left/right mirrors the same sequence on mobile viewports
- [x] Buffer readout behaves consistently with digit-nav conventions while rolling
- [x] On pages absent from the route map, arrows and swipe do nothing (no navigation, no error)
- [x] Swipe doesn't fight horizontal scrolling or interfere with vertical scroll gestures
- [x] `prefers-reduced-motion`: existing global rule collapses the roll animation safely
- [x] `npm run check` && `npm run build` green; hand-verified via `npm run preview`

## Boundaries

**In:** arrow + swipe navigation only.
**Out:** Fastext hotkeys and the neighbour affordance (11 — reuses this ticket's sequence walk) · changes to digit-nav behaviour · RemoteControl layout · new colours/fonts (N7).

## Global gates

`npm run check` + `npm run build` green · qa-agent pass on preview (keyboard + touch) · designer-agent review · user approves the diff · **user explicitly triggers any push to main.**
