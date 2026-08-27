# 13 — Section Counter + ADR 0003

| Field | Value |
|---|---|
| **Type** | AFK |
| **Blocked by** | None as a hard gate. Shares the `BaseLayout.astro` file-lock with the 07 → 10 → 11 chain — start only after 11 merges, and never concurrently with 14. |
| **Target Modules** | Header slot logic (`BaseLayout.astro`), scroll observer script, `docs/adr/0003-chrome-content-split.md` (create), `CLAUDE.md` (one amended line) |
| **Source** | `docs/PLAN-teletext-system.md` Phase 4 item 13 + Documentation section |
| **Linear** | [JOR-57](https://linear.app/jornesiebrands/issue/JOR-57) |
| **Status** | ready-for-agent |

## What to build

Long-form pages show reading progress as `3/8` in the header — driven by the case study's `##` headings via `IntersectionObserver`, counting both directions. Closer to teletext's subpage indicator than a percentage, and more useful on a 2200-word decision log. It occupies the yellow clock slot **on long-form pages only**; index pages keep the clock. Long-form detection comes from the layout used (Project/Blog layouts), not a heuristic.

⚠️ **This amends a documented rule**: CLAUDE.md locks the yellow clock as a Ceefax element. Record the amendment in the ADR and adjust the CLAUDE.md line in the same diff.

**Write ADR 0003 (`docs/adr/0003-chrome-content-split.md`) in this ticket:** the prime rule — *chrome may be maximalist; content must get out of the way* — and what it has already decided (including this counter swap).

## Acceptance criteria

- [ ] On the Arin case study (~2179 words, N `##` sections), header shows `k/N`, updating correctly scrolling down AND up
- [ ] Index pages (`/`, `/projects/`, `/blog/`, `/contact/`) keep the clock untouched
- [ ] Counter lives in the yellow slot, teletext styling, 8-colour palette
- [ ] Reduced-motion safe (no animation dependence)
- [ ] Screen-reader treatment decided with qa (announce politely, or aria-hidden like the clock — pick one, document it)
- [ ] ADR 0003 exists; CLAUDE.md amendment included in the same diff
- [ ] `npm run check` && `npm run build` green

## Boundaries

**In:** section counter on long-form layouts, one ADR, one CLAUDE.md line.
**Out:** replacing the clock site-wide · percentage indicators · content-side changes (prime rule: content pays nothing for this) · new colours/fonts (N7).

## Global gates

`npm run check` + `npm run build` green · designer-agent review (yellow slot treatment) · qa pass on scroll behaviour · user approves the diff · **user explicitly triggers any push to main.**
