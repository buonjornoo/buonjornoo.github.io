# 17 — Page-Number Drift Guard (build-time assertion)

| Field | Value |
|---|---|
| **Type** | AFK |
| **Blocked by** | None (can start immediately). **Gates 10**: sequential paging walks every number trusting the map — this guard vouches that the map matches the content before paging ships. |
| **Target Modules** | New build-time assertion wired into the build (script or integration — implementer's choice); **`src/content.config.ts` is not touched** |
| **Source** | `docs/PLAN-teletext-system.md` Phase 1 final paragraph |
| **Linear** | [JOR-61](https://linear.app/jornesiebrands/issue/JOR-61) |
| **Status** | **implemented, tests green — awaiting user diff review (not deployed)** (2026-08-27: TDD red→green. `src/lib/page-number-drift.ts` holds the pure decision core (`parseFrontmatterString`, `expectedUrlFor`, `findPageNumberDrift`) mirroring each collection's real `getStaticPaths` URL — `/blog/<id>/`, `/projects/<frontmatter slug>/`, and a hand-mapped `pages` collection (`about` → `/`, since it has no dynamic route). Wired into `astro.config.mjs` as a `page-number-drift-guard` integration on the `astro:build:start` hook — runs on every `astro build` (`npm run build` and vitest's `npx astro build` global-setup alike), not a manual script. 14 new unit tests (`tests/unit/page-number-drift.test.ts`), including one that walks the real `src/data/**` tree and asserts zero drift. Desync proof: temporarily changed `table-hunter.md`'s `pageNumber` from `"206"` to `"207"` (cycling-coach's number) — `npm run build` failed, exit code 1, message named both sides: `projects/table-hunter.md: declares pageNumber "207" (→ /projects/table-hunter/), but pageRoutes.json["207"] is "/projects/cycling-coach/"`; reverted, `git diff` clean, build green again. `npm run check`: 0 errors/0 warnings. Full suite: 10 files / 127 tests green (was 9/113). `src/content.config.ts` untouched (`git diff --stat` confirmed empty). Not committed, not pushed.) |

## What to build

`pageNumber` is hand-written in front matter across the content collections *and* independently maintained in `pageRoutes.json`, with nothing checking they agree. Today that's latent debt; sequential paging (10) turns it into a header that lies. Add a build-time assertion: every document declaring a front-matter `pageNumber` must match its `pageRoutes.json` entry (same number → same URL). Fail the build on mismatch, naming both sides of the disagreement.

Entries that exist only in the JSON (100, 200, 210, 300, 400, and future 101/102) declare no front matter and are correctly out of scope — the check runs over documents that declare a number, not over the JSON.

## Acceptance criteria

- [x] Desync proof: temporarily change one front-matter `pageNumber` → build FAILS with a message naming the page and both values; revert → green. Evidence captured in the diff description.
- [x] Current tree passes — all existing front-matter numbers agree with `pageRoutes.json`
- [x] JSON-only entries produce no false positive
- [x] Assertion runs on every `npm run build` (not a manual script nobody remembers)
- [x] `src/content.config.ts` untouched (`git diff --stat` proves it)
- [x] `npm run check` && `npm run build` green

## Boundaries

**In:** one assertion + build wiring.
**Out:** changing any `pageNumber` value to make it pass (if the current tree disagrees somewhere, surface it — do not silently "fix") · schema changes · `pageRoutes.json` shape changes.

## Global gates

`npm run check` + `npm run build` green · desync proof demonstrated · user approves the diff · **user explicitly triggers any push to main.**
