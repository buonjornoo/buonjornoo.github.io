# 04 — Curation & Sequence (Unhide the Strongest Stories)

| Field | Value |
|---|---|
| **Type** | AFK |
| **Blocked by** | 03 [file-lock: `src/pages/index.astro`] |
| **Blocks** | 05 [go-live visibility] · provides settled insertion point for 01 Phase B |
| **Target Modules** | front matter only (`archive`/`order`): `bikemap-route-planner.md`, `ar-city-exploration.md`, `do24-workflow-evolution.md`, `do24-teal-ui.md`, `this-site.md`, `cycling-coach.md`, `arin-und-der-drache.md` (+ no-op confirms in `bikemap-pause-mode.md`, `table-hunter.md`) · `src/pages/index.astro` lines 12–17 (`curatedSlugs`) |
| **PRD source** | S3 (+ O1 slot reservation) |
| **Status** | ready-for-human |

## Vertical slice

Front-matter flags → collection filter/sort → rendered grid + homepage curation → regression check on keyboard nav. One visible end state: nothing strong is hidden; strongest scope story leads both surfaces.

## Exact target state (locked Q18 + O1)

### Grid sequence (`order` asc; archived filtered out of `/projects/`)

| # | Project | File | Current → Target |
|---|---|---|---|
| 1 | Workflow Evolution | `do24-workflow-evolution.md` | 2 → **1** |
| 2 | Route Planner ⬅ unarchive | `bikemap-route-planner.md` | 90+archive → **2**, flag removed |
| 3 | Pause Mode | `bikemap-pause-mode.md` | 3 → 3 *(no change)* |
| 4 | Table Hunter | `table-hunter.md` | 4 → 4 *(no change)* |
| 5 | teal-ui | `do24-teal-ui.md` | 1 → **5** |
| 6 | KION *(slot reserved — issue 01 fills it)* | — | — |
| 7 | AR City Exploration ⬅ unarchive | `ar-city-exploration.md` | 91+archive → **7**, flag removed |
| 8 | This Site | `this-site.md` | 6 → **8** |
| 9 | Cycling Coach | `cycling-coach.md` | 5 → **9** |
| 10 | Arin und der Drache | `arin-und-der-drache.md` | 7 → **10** |

Slot 6 stays empty until 01 merges — do not fill it with anything else. All current values verified against disk.

Note for agents: three projects carry vestigial front-matter `featured: true` (workflow-evolution, pause-mode, teal-ui). Nothing reads that field — homepage featured treatment is computed from array position at `src/pages/index.astro:63` (`featured={i === 0}` into ProjectCard; there is no `index.tsx`). Leave those flags alone.

### Homepage curation (`curatedSlugs`, `src/pages/index.astro:12-17`; currently FOUR entries, table-hunter first)

```js
const curatedSlugs = [
  'do24-workflow-evolution',   // FEATURED treatment = position 0
  'bikemap-route-planner',
  'table-hunter',
  'bikemap-pause-mode',
  'do24-teal-ui',
];
```

Exactly five cards, Workflow Evolution first with magenta FEATURED tag.

## Why sequencing matters

This slice makes both ex-archive studies publicly visible — which is why 05 (AR's broken cover) is gated behind this merge and should follow immediately. Keep 04+05 as one reviewable unit if convenient.

## TDD protocol — no test framework may be invented (PRD §4)

RED — capture first (all verified against current build):

```bash
npm run build
grep -o 'href="/projects/[a-z0-9-]*/"' dist/index.html
# expect today, in order: table-hunter, do24-workflow-evolution, do24-teal-ui, bikemap-pause-mode
grep -o 'href="/projects/[a-z0-9-]*/"' dist/projects/index.html
# expect: no bikemap-route-planner, no ar-city-exploration (archived)
grep -c "(Archive)" dist/projects/ar-city-exploration/index.html   # expect: 1 today
```

(Project cards are the only `/projects/…` hrefs on these pages — the grep IS the sequence assertion.)

GREEN:

1. Grid extraction shows nine entries (ten once 01 merges) in exactly the locked order.
2. Homepage extraction shows exactly the five locked slugs in order; first card carries FEATURED.
3. `(Archive)` absent from both ex-archive pages (`ProjectLayout.astro:44-46` renders it only when `archive: true`).
4. Regression: routes 201 → Route Planner and 203 → AR Exploration still resolve (QA agent keyboard test on `npm run preview`); direct URLs render fully.
5. `npm run check` && `npm run build` green.

## Acceptance criteria

- [x] Both `archive: true` flags removed; only `order` values otherwise touched.
- [x] Grid + homepage sequences match locked targets exactly (extraction diff). (grid = 9 entries locked order, slot 6 empty; homepage = 5 slugs, FEATURED once on position 0)
- [x] `(Archive)` gone from both pages; both present in grid and reachable. (keyboard 201/203 navigate; direct URLs render fully)
- [x] RED evidence captured before implementing; check + build green.

## Boundaries

**In:** nine front-matter edits (two flag removals, seven `order` values — three no-ops), one array replacement in `index.astro`.
**Out:** subtitles (06) · covers (05) · KION content creation (01) · case-study bodies (N5) · page-number changes (N8 — 201/203 stay put) · homepage sections other than `curatedSlugs` · vestigial `featured` flags.

## Scheduling

Last consumer of `index.astro` (02 → 03 → 04). Start only after 03 merges. Independent of 01: if 01 merges first, the `order: 6` tie is transient and harmless (stable sort, undeployable without user approval); preferred merge order is 04 then 01 Phase B.
