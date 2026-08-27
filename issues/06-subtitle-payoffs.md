# 06 — Case-Study Payoff Lines (Three Subtitles)

| Field | Value |
|---|---|
| **Type** | AFK |
| **Blocked by** | None — fully independent, ideal first parallel slice |
| **Target Modules** | `subtitle` field only: `src/data/projects/do24-workflow-evolution.md`, `src/data/projects/bikemap-pause-mode.md`, `src/data/projects/table-hunter.md` |
| **Source** | Shipped. Was PRD §S5; `docs/PRD-portfolio-overhaul.md` deleted 2026-08-26. Binding constraints N1–N9 now live in `issues/01`. |
| **Status** | **deployed/live** (portfolio overhaul, `8792f68`; subtitle strings byte-verified against live front matter 2026-08-27, confirmed ancestor of origin/main) |

## Vertical slice

Three front-matter strings → schema validation (optional string) → cyan strapline under each page title → verbatim render check. One visible end state: three hooks gain role/outcome payoffs on their own pages.

## Locked wordings — byte-for-byte, dash-exact

### 1. Workflow Evolution — full replacement

Current (verified): `digital office, 2024 to 2026. How a conversation with an assistant became an architecture decision.`

New (note "digital office **24**", en-dash in 2024–2026, colon before "how"):

> digital office 24, 2024–2026. Started as the designer, ended owning the product: how a conversation with an assistant became a new task architecture.

### 2. Pause Mode — append to existing

Keep the entire current subtitle, append one space plus:

> Shipped in ten weeks as a deliberate tradeoff: recording got pause first, navigation later.

Resulting full value:

> The bike computer had no pause button, and 1.7 million recordings a year never became a route anyone kept. Shipped in ten weeks as a deliberate tradeoff: recording got pause first, navigation later.

### 3. Table Hunter — replace second sentence only

Current second sentence (verified): `Built solo, directed rather than coded.`

New second sentence:

> Built solo with an agent team and my maps experience from Bikemap.

First sentence stays untouched.

Rendering: subtitles are the cyan `<p>` under the DoubleHeight title (`ProjectLayout.astro:29-31`). Cards render the separate `description` field — cards are unaffected; do not touch `description`.

## TDD protocol — no test framework may be invented (static site, no unit-test infra)

RED — capture first (all expectations verified against current front matter):

```bash
npm run build
grep -c "became a new task architecture" dist/projects/do24-workflow-evolution/index.html  # expect: 0
grep -c "recording got pause first" dist/projects/bikemap-pause-mode/index.html            # expect: 0
grep -c "my maps experience from Bikemap" dist/projects/table-hunter/index.html            # expect: 0
grep -c "directed rather than coded" dist/projects/table-hunter/index.html                 # expect: 1 today
```

GREEN:

1. Each new string present byte-for-byte in its rendered page — extract and diff, never eyeball (especially the en-dash in `2024–2026`).
2. Pause Mode retains its original first sentence intact before the appended payoff.
3. Table Hunter's old second sentence is gone.
4. `npm run check` && `npm run build` green.

## Acceptance criteria

- [x] RED evidence captured before implementing. (probes: 0/0/0 new strings, 1 old TH sentence)
- [x] Three subtitles match locked wordings exactly (verbatim diff-check). (byte-exact cmp; en-dash verified as UTF-8 e2 80 93)
- [x] Only `subtitle` fields changed — `description`, bodies, all other front matter untouched (N5). (`this-site.md` hunks in working tree pre-date this change and are not part of it)
- [x] Payoffs render under titles on their pages.

## Boundaries

**In:** three `subtitle` lines across three disjoint files.
**Out:** case-study bodies or narrative ordering (N5) · card `description` fields · homepage copy · subtitle-rendering markup · these files' `order` fields (04's job — different keys, so no conflict even on parallel merge).

## Scheduling

No shared files with any other issue's primary surface. Start immediately, in parallel with everything.
