# 17 — Page-Number Drift Guard (build-time assertion)

| Field | Value |
|---|---|
| **Type** | AFK |
| **Blocked by** | None (can start immediately). **Gates 10**: sequential paging walks every number trusting the map — this guard vouches that the map matches the content before paging ships. |
| **Target Modules** | New build-time assertion wired into the build (script or integration — implementer's choice); **`src/content.config.ts` is not touched** |
| **Source** | `docs/PLAN-teletext-system.md` Phase 1 final paragraph |
| **Status** | ready-for-agent |

## What to build

`pageNumber` is hand-written in front matter across the content collections *and* independently maintained in `pageRoutes.json`, with nothing checking they agree. Today that's latent debt; sequential paging (10) turns it into a header that lies. Add a build-time assertion: every document declaring a front-matter `pageNumber` must match its `pageRoutes.json` entry (same number → same URL). Fail the build on mismatch, naming both sides of the disagreement.

Entries that exist only in the JSON (100, 200, 210, 300, 400, and future 101/102) declare no front matter and are correctly out of scope — the check runs over documents that declare a number, not over the JSON.

## Acceptance criteria

- [ ] Desync proof: temporarily change one front-matter `pageNumber` → build FAILS with a message naming the page and both values; revert → green. Evidence captured in the diff description.
- [ ] Current tree passes — all existing front-matter numbers agree with `pageRoutes.json`
- [ ] JSON-only entries produce no false positive
- [ ] Assertion runs on every `npm run build` (not a manual script nobody remembers)
- [ ] `src/content.config.ts` untouched (`git diff --stat` proves it)
- [ ] `npm run check` && `npm run build` green

## Boundaries

**In:** one assertion + build wiring.
**Out:** changing any `pageNumber` value to make it pass (if the current tree disagrees somewhere, surface it — do not silently "fix") · schema changes · `pageRoutes.json` shape changes.

## Global gates

`npm run check` + `npm run build` green · desync proof demonstrated · user approves the diff · **user explicitly triggers any push to main.**
