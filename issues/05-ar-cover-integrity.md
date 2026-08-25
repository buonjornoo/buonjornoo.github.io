# 05 — Cover Integrity Fix (AR City Exploration)

| Field | Value |
|---|---|
| **Type** | AFK |
| **Blocked by** | 04 [go-live visibility — the broken card becomes public only once the archive lifts] |
| **Target Modules** | `src/data/projects/ar-city-exploration.md` front-matter `coverImage` only. `ProjectCard.astro` NOT expected to change. |
| **PRD source** | S4 + Open Item O2 |
| **Status** | ready-for-human |

## Vertical slice

One front-matter path → asset resolution on disk → `<img>` in grid/homepage cards → zero-broken-reference build. One visible end state: the un-hidden AR study renders real imagery everywhere its card appears.

## Problem (verified on disk)

Front matter points at `coverImage: "/img/projects/arCityCover.png"` — that file does not exist (`public/img/projects/` contains only the other eight covers). Every card render for AR City Exploration 404s once 04 lifts the archive.

## The decision (O2) — make it visible, don't bury it

`ProjectCard.astro:36-46` renders a plain `<img src>` — animated GIFs work natively, so "ProjectCard can't render a GIF" is NOT a factor. The tradeoff is weight. Verified assets (identical in `public/img/arCityExploration/` and `dist/img/arCityExploration/` — use exactly these filenames):

| Candidate | Size | Assessment |
|---|---|---|
| `raubkunst_cover.gif` | 5,451,566 B (~5.4 MB) | Animated, on-theme — unacceptable as lazy-loading card weight |
| `raubkunst_app-design.webp` | 34,862 B (~34 KB) | Static app-design shot; **recommended default per O2** |

Change: `coverImage: "/img/arCityExploration/raubkunst_app-design.webp"`.

Present this choice with the size numbers in the diff review for explicit user confirmation (O2 requires it). If the user prefers the GIF, that is their call made looking at the numbers.

Explicitly out of scope: `heroImage` (`raubkunst_cover.gif`) on the detail page stays as-is. Flagging it as a future candidate is fine; changing it here is scope creep.

## TDD protocol — no test framework may be invented (PRD §4)

Probes are state-independent (valid before OR after 04 merges):

RED — capture first:

```bash
ls public/img/projects/arCityCover.png        # expect: No such file or directory
grep -n "arCityCover.png" src/data/projects/ar-city-exploration.md   # expect: matches today
npm run build && ls dist/img/arCityExploration/raubkunst_app-design.webp   # expect: exists, ~34 KB
grep -rc "arCityCover.png" dist/projects/index.html dist/index.html # expect: 0 while archived;
                                                    # ≥1 after 04 lifts it until this fix lands
```

GREEN:

1. `src/data/projects/ar-city-exploration.md` references `raubkunst_app-design.webp`; `arCityCover.png` appears nowhere in `dist/`.
2. `grep -c 'href="/projects/ar-city-exploration/"' dist/projects/index.html` → 1 after 04, and the card markup adjacent to that link references the webp.
3. No missing-asset warnings in build output.
4. Visual check: card renders imagery with `teletext-pixelated` treatment, correct in both horizontal (homepage) and vertical (grid) layouts.
5. `npm run check` && `npm run build` green.

## Acceptance criteria

- [x] `coverImage` resolves to an asset that exists on disk AND in `dist/`. (34,862 B both; card img naturalWidth 3210, `crisp-edges` active)
- [ ] **O2 choice presented with size numbers; user confirmed.** ← implemented the issue's recommended default (`raubkunst_app-design.webp` 34 KB over `raubkunst_cover.gif` 5.4 MB). GIF swap is a one-line change if user prefers it — decide at diff review.
- [x] Zero broken-image references for this project anywhere in `dist/`. (arCityCover.png: 0 hits across all dist HTML)
- [x] No other front-matter fields touched. (heroImage GIF stays as-is per boundaries)
- Note: AR has no homepage card under 04's locked curation (five curated slugs), so the horizontal-layout check is vacuous — grid is its only card surface.

## Boundaries

**In:** one front-matter line.
**Out:** `heroImage` optimization · `ProjectLayout`/`ProjectCard` code changes (PRD permits a layout touch only if GIF handling demanded it — verified it doesn't) · image pipeline/galleries (N4) · creating or downloading any new asset (use what exists on disk).

## Scheduling

File-independent of every other issue; the only edge is go-live ordering behind 04. Safe to implement early and hold unmerged if the scheduler prefers.
