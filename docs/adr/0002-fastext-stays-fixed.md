# 0002 — Fastext Destinations Stay Fixed; Sequential Paging Gets Its Own Affordance

- Status: Accepted
- Date: 2026-08-27
- Deciders: Jorne Siebrands (site owner, design system owner)
- Related: Linear JOR-55 ("11 — Fastext Hotkeys + Contextual Arrows + ADR 0002"); JOR-54 ("10 — Sequential Paging"); `DESIGNSYSTEM.md`

## Context

Real Ceefax hardware carries two independent navigation mechanisms that never overlap: four physically colored Fastext keys, each hard-wired to a fixed magazine page regardless of what's currently on screen, and a separate page-turn control that steps sequentially through whatever pages exist. This site already mirrors the first with the Fastext footer (red/green/yellow/cyan → Home/Projects/Blog/Contact, unconditionally, on every page) and, as of issue 10, the second with ArrowLeft/ArrowRight and swipe gestures walking `pageRoutes.json` in ascending numeric order with wraparound.

Issue 11 adds keyboard mnemonics (`r`/`g`/`y`/`c`) for the four Fastext destinations and a small visual affordance surfacing the sequential-paging neighbours (e.g. `◀ 203 · 205 ▶`) above the footer. Before wiring either, one question had to be settled: should the Fastext destinations themselves become contextual — e.g. "Home" swapping for "back to parent project" depending on where you are — now that the site has a working notion of page-to-page adjacency?

## Decision

No. The four Fastext colour slots (and their `r`/`g`/`y`/`c` keyboard mnemonics) stay fixed to Home/Projects/Blog/Contact on every single page, with no exceptions. Contextual navigation — "what's near me right now" — is expressed exclusively through the new neighbour affordance, a distinct UI element that sits above the Fastext bar rather than replacing or relabeling it.

## Consequences

**Positive**

- "Contact is one keystroke away" — a property this site is explicitly built around — remains true unconditionally. If Fastext became contextual, that guarantee would depend on which page you happened to be on, defeating the whole point of a fixed quick-nav layer.
- Two clearly separated mental models, matching the two mechanisms that inspired them: fixed destinations (the four colours, always meaning the same thing) and sequential walking (the arrows/swipe/neighbour affordance, always meaning "the next/previous thing in the list"). Users never have to guess which behaviour a given control has today.
- The remote rail's mnemonic reconciliation (H/P/B/C → R/G/Y/C, matching the new keyboard hotkeys) reinforces rather than complicates this: the colour slots got a clearer label, not a different job.

**Negative / risk**

- No "smart" shortcut back to a natural parent (e.g. from a project page straight to `/projects/`) beyond what the fixed Green key already provides. Accepted: that's exactly what Green already does, and a second, sometimes-different meaning for the same physical key is the failure mode this ADR exists to avoid.
- The neighbour affordance is new visual surface area a returning user has to notice; unlike the Fastext bar it doesn't have decades of broadcast-TV convention behind it. Mitigated by placing it directly adjacent to the footer it complements, using the same chrome-not-content colour treatment (static white, yellow only on hover/focus) as the rest of the header/footer chrome.

## Alternatives considered

1. **Make Fastext contextual** (e.g. destinations reflow based on current page). Rejected — breaks the one-keystroke-to-Contact guarantee and the fixed mental model Fastext is supposed to provide; also has no analogue on real Ceefax hardware, which this site otherwise deliberately simulates.
2. **Repurpose the existing four colour keys for sequential paging instead of adding a new affordance** (e.g. Green becomes "next" contextually). Rejected for the same reason as (1), plus it would silently break Green's fixed meaning depending on page state — the exact ambiguity a physical remote's colour keys are supposed to eliminate.
3. **Leave Fastext mnemonics unreconciled (keep H/P/B/C on the rail while hotkeys are r/g/y/c)**. Rejected per `@designer`: real Fastext keys are colour-coded, not word-coded: R‑on‑red/G‑on‑green/Y‑on‑yellow/C‑on‑cyan is legible from the colour alone and matches the hotkeys directly, where H/P/B/C required already knowing the destination word.
