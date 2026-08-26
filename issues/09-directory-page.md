# 09 — Directory Component (page 101, `/directory/` + `/404` mount)

| Field | Value |
|---|---|
| **Type** | AFK |
| **Blocked by** | 08 (experience matrix) — so the listing is born complete including page 102. |
| **Target Modules** | New directory component (under `src/components/teletext/`), `src/pages/directory.astro` (create), `src/pages/404.astro` (replace hardcoded list), `src/data/pageRoutes.json` (+`"101": "/directory/"`) |
| **Source** | `docs/PLAN-teletext-system.md` Phase 2 (second half) |
| **Status** | implemented, tests green, designer-reviewed — awaiting user diff review (not deployed) |

## What to build

One directory component listing every page number with its title, derived from `pageRoutes.json` plus collection titles. Mounted twice: on the new page 101, and on `src/pages/404.astro`, which currently hardcodes only four entries. One component, two mounts.

**Design consideration to settle during implementation:** non-collection routes (100, 200, 300, 400, plus the new 101/102) have no front matter to take a title from. Keep the `pageRoutes.json` shape untouched (flat number→URL strings — BaseLayout serializes it into the nav payload); source titles from the collections plus a small static label map inside the component. Flag the treatment for designer review.

## Acceptance criteria

- [x] `"101"` registered; typing `101` navigates to `/directory/`
- [x] `/directory/` and `/404` render identical listings (same component, both mounts)
- [x] Every listed number resolves — each entry's href equals its `pageRoutes.json` value; no dead entries
- [x] Listing covers all 18 entries (the existing 16 + 101 + 102)
- [x] 404 page otherwise unchanged (messaging, styling)
- [x] `npm run check` && `npm run build` green

## Boundaries

**In:** one component, one new page, the 404 swap, one route line.
**Out:** `pageRoutes.json` shape changes · BaseLayout nav-payload changes · renumbering (N8) · new colours/fonts (N7).

## Global gates

`npm run check` + `npm run build` green · designer-agent review · user approves the diff · **user explicitly triggers any push to main.**

## Implementation notes

- QA: PASS (18 anchors, byte-identical `#page-directory` blocks on both mounts, all hrefs resolve, 404 copy untouched).
- Designer: initial pass flagged the new listing dropped the old 404 list's dot-leader alignment (a Ceefax contents-page convention). Fixed — rows now use a flex layout with a `border-dotted border-teletext-white` leader between label and number, no new colors.
- 99/99 tests green (`tests/integration/directory-page.test.ts` new; `experience-page.test.ts`'s route-count assertion updated to account for 101 alongside 102).
- **Code review (Standards + Spec, run against `main...HEAD`) — fixed:**
  - Spec: page 100's label had silently shortened from the old 404 list's "Home + About" to "Home" — a content wording change riding along with the structural swap, unflagged for `@content`/designer review despite the spec's note to flag treatment decisions. Restored to "Home + About" in `STATIC_LABELS`; added a regression test locking the string on `/404`.
  - Standards: `listingBlock()` in the test suite was self-flagged brittle (sliced to the "next `</div>`", assuming no nesting). Replaced with a balanced-tag depth scan so it stays correct if the listing's markup grows nested `<div>`s.
  - Standards, left as-is (judgement calls, not hard violations, low severity at current scale): page numbers as strings threaded through three lookup sources (`STATIC_LABELS`/`collectionLabels`/`pageRoutes.json`) — mild Primitive Obsession; the `{ number, url, label }` template-local triple — mild Data Clump; the `??`-chained label fallback — mild Repeated-Switches shape. None warrant restructuring at 7 static entries without a concrete second need.
  - 100/100 tests green, `npm run check` clean, after fixes.
- Committed locally only. Not pushed — awaiting user review and explicit push approval.
