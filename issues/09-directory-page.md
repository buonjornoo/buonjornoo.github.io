# 09 — Directory Component (page 101, `/directory/` + `/404` mount)

| Field | Value |
|---|---|
| **Type** | AFK |
| **Blocked by** | 08 (experience matrix) — so the listing is born complete including page 102. |
| **Target Modules** | New directory component (under `src/components/teletext/`), `src/pages/directory.astro` (create), `src/pages/404.astro` (replace hardcoded list), `src/data/pageRoutes.json` (+`"101": "/directory/"`) |
| **Source** | `docs/PLAN-teletext-system.md` Phase 2 (second half) |
| **Status** | ready-for-agent |

## What to build

One directory component listing every page number with its title, derived from `pageRoutes.json` plus collection titles. Mounted twice: on the new page 101, and on `src/pages/404.astro`, which currently hardcodes only four entries. One component, two mounts.

**Design consideration to settle during implementation:** non-collection routes (100, 200, 300, 400, plus the new 101/102) have no front matter to take a title from. Keep the `pageRoutes.json` shape untouched (flat number→URL strings — BaseLayout serializes it into the nav payload); source titles from the collections plus a small static label map inside the component. Flag the treatment for designer review.

## Acceptance criteria

- [ ] `"101"` registered; typing `101` navigates to `/directory/`
- [ ] `/directory/` and `/404` render identical listings (same component, both mounts)
- [ ] Every listed number resolves — each entry's href equals its `pageRoutes.json` value; no dead entries
- [ ] Listing covers all 18 entries (the existing 16 + 101 + 102)
- [ ] 404 page otherwise unchanged (messaging, styling)
- [ ] `npm run check` && `npm run build` green

## Boundaries

**In:** one component, one new page, the 404 swap, one route line.
**Out:** `pageRoutes.json` shape changes · BaseLayout nav-payload changes · renumbering (N8) · new colours/fonts (N7).

## Global gates

`npm run check` + `npm run build` green · designer-agent review · user approves the diff · **user explicitly triggers any push to main.**
