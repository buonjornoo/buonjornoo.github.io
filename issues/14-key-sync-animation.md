# 14 — Key-Sync Animation (physical digits depress rail buttons)

| Field | Value |
|---|---|
| **Type** | AFK |
| **Blocked by** | None as a hard gate. Shares the `BaseLayout.astro` file-lock with the 07 → 10 → 11 chain — start only after 11 merges, and never concurrently with 13. |
| **Target Modules** | `src/layouts/BaseLayout.astro` (`pressDigit`, ~lines 108–127), `src/components/teletext/RemoteControl.astro` (button pressed state) |
| **Source** | `docs/PLAN-teletext-system.md` Phase 4 item 14 |
| **Linear** | [JOR-58](https://linear.app/jornesiebrands/issue/JOR-58) |
| **Status** | ready-for-agent |

## What to build

Pressing a physical digit visibly depresses the matching button on the desktop remote rail. One class toggle inside the existing `pressDigit` flow. Cheap, and it is what makes the rail read as a control rather than decoration.

The global reduced-motion rule (`global.css` ~68–73) already collapses transitions safely — verify, don't assume.

## Acceptance criteria

- [ ] Typing digits on the keyboard visibly depresses the matching rail buttons (all three digits of a sequence)
- [ ] Mobile dialog keypad: same sync when open (or explicitly scoped out with a note — rail is desktop-only ≥1100px)
- [ ] `prefers-reduced-motion`: no animation; state still correct
- [ ] No layout shift from the pressed state (transform/colour only)
- [ ] `npm run check` && `npm run build` green

## Boundaries

**In:** one class toggle + its CSS.
**Out:** RemoteControl layout or mnemonic changes (11's job) · buffer readout behaviour · new colours/fonts (N7).

## Global gates

`npm run check` + `npm run build` green · designer-agent review · user approves the diff · **user explicitly triggers any push to main.**
