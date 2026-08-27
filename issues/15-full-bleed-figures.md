# 15 — Opt-in Full-Bleed Figures + ADR 0001

| Field | Value |
|---|---|
| **Type** | AFK |
| **Blocked by** | None (can start immediately). |
| **Target Modules** | `.prose-teletext` figure styles (defined inline in `ProjectLayout.astro` / `BlogPostLayout.astro`), 3–4 hand-written `<figure>` blocks in case-study markdown, `docs/adr/0001-80ch-prose-column.md` (create) |
| **Source** | `docs/PLAN-teletext-system.md` Phase 4 item 15 + Documentation section |
| **Linear** | [JOR-59](https://linear.app/jornesiebrands/issue/JOR-59) |
| **Status** | ready-for-agent |

## What to build

All ~31 case-study figures are currently capped at the prose column width. A small set of screen-flow figures earns an escape hatch: opt-in full-bleed via one CSS rule (`margin-inline: calc(50% - 50vw)` pattern) plus a class added to the 3–4 figures that genuinely depict full screens.

**Explicitly NOT full-bleed:** the AR study's 2.3MB cover GIF and its 5.4MB hero GIF — weight, not width, is their problem.

**Write ADR 0001 (`docs/adr/0001-80ch-prose-column.md`) in this ticket:** why 80ch and not teletext's true 40ch — hard to reverse, surprising for a simulator, real trade-off. This ticket is its natural home: it is the one feature that punches holes in the column.

## Acceptance criteria

- [ ] The 3–4 chosen figures render edge-to-edge on wide viewports; all other figures untouched
- [ ] Prose column remains 80ch everywhere — no text goes full-bleed
- [ ] No horizontal page scroll at any viewport width (overflow contained)
- [ ] AR cover/hero GIFs unchanged
- [ ] ADR 0001 exists recording the 80ch decision and its reasoning
- [ ] `npm run check` && `npm run build` green

## Boundaries

**In:** one CSS mechanism + class placement on 3–4 figures, one ADR.
**Out:** image optimisation/dimensions (18's job) · galleries or annotated screenshots (N4) · prose rewrites (N5) · new colours/fonts (N7).

## Global gates

`npm run check` + `npm run build` green · designer-agent review (which figures earn it) · user approves the diff · **user explicitly triggers any push to main.**
