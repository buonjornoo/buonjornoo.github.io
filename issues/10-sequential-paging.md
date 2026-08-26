# 10 — Sequential Paging (←/→ keys + swipe)

| Field | Value |
|---|---|
| **Type** | AFK |
| **Blocked by** | 07 (page 210 must have chrome before the walk passes through it) · 17 (drift guard must vouch for the number map before paging trusts it) |
| **Target Modules** | `src/layouts/BaseLayout.astro` inline script (+ reverse URL→number lookup — does not exist today), `src/styles/global.css` if needed |
| **Source** | `docs/PLAN-teletext-system.md` Phase 4 item 10 |
| **Status** | ready-for-agent |

## What to build

Arrow keys walk every entry in `pageRoutes.json` in ascending numeric order, wrapping 400 → 100. One rule, no exceptions; **210 stays in the run** because 07 gives it chrome. Mobile: horizontal swipe on the same sequence.

The walk needs a reverse lookup (current URL → current page number) so the arrows know where they stand. On a page with no number (e.g. `/404`, or any unmapped URL), the arrows no-op gracefully rather than guessing.

## Acceptance criteria

- [ ] `→` from page 209 reaches 210; from 400 wraps to 100; `←` walks the inverse direction
- [ ] Horizontal swipe left/right mirrors the same sequence on mobile viewports
- [ ] Buffer readout behaves consistently with digit-nav conventions while rolling
- [ ] On pages absent from the route map, arrows and swipe do nothing (no navigation, no error)
- [ ] Swipe doesn't fight horizontal scrolling or interfere with vertical scroll gestures
- [ ] `prefers-reduced-motion`: existing global rule collapses the roll animation safely
- [ ] `npm run check` && `npm run build` green; hand-verified via `npm run preview`

## Boundaries

**In:** arrow + swipe navigation only.
**Out:** Fastext hotkeys and the neighbour affordance (11 — reuses this ticket's sequence walk) · changes to digit-nav behaviour · RemoteControl layout · new colours/fonts (N7).

## Global gates

`npm run check` + `npm run build` green · qa-agent pass on preview (keyboard + touch) · designer-agent review · user approves the diff · **user explicitly triggers any push to main.**
