# 18 — Image Weight & Dimensions (CLS protection)

| Field | Value |
|---|---|
| **Type** | AFK |
| **Blocked by** | 15 (full-bleed figures) — both tickets edit the same hand-written `<figure>` markup across the same case studies; land 15 first, then this touches those lines once. |
| **Target Modules** | `public/img/` route-planner assets, markdown `<figure>`/`<img>` blocks across `src/data/projects/*.md`, possibly `ProjectLayout.astro` figure defaults |
| **Source** | Flagged-but-unscoped concern raised in `docs/PLAN-teletext-system.md` Phase 4 item 15; filed as its own ticket 2026-08-26 |
| **Linear** | [JOR-62](https://linear.app/jornesiebrands/issue/JOR-62) |
| **Status** | ready-for-agent |

## What to build

Three route-planner assets exceed 1.2MB each and have spaces in their filenames; site-wide, no markdown image carries `width`/`height`, so there is zero CLS protection anywhere.

1. Compress the oversized assets to sane weights (target guidance: hero-class images well under 500KB unless visually justified; propose per-file before/after in the diff).
2. Rename to space-free slugs and update every referencing markdown path.
3. Add explicit `width`/`height` to all markdown images so the browser reserves space — CLS protection site-wide.

## Acceptance criteria

- [ ] No asset referenced by any case study exceeds the agreed weight; before/after sizes shown in the diff
- [ ] No image URL contains spaces; zero broken references (build + preview crawl clean)
- [ ] Every markdown image carries `width`/`height`; layout stable while images load
- [ ] Visual output pixel-comparable (no visible quality regression at display size)
- [ ] `npm run check` && `npm run build` green

## Boundaries

**In:** compression, renames, dimension attributes.
**Out:** swapping image content · galleries/annotated screenshots (N4) · full-bleed decisions (15) · introducing an image pipeline/CDN (separate effort if ever wanted) · AR GIFs beyond what compression safely allows without losing motion quality.

## Global gates

`npm run check` + `npm run build` green · qa pass on affected studies (loading, layout stability) · designer sign-off on compressed quality · user approves the diff · **user explicitly triggers any push to main.**
