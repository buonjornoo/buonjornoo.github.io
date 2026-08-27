# 12 — Inline Page-Number Links (rehype plugin)

| Field | Value |
|---|---|
| **Type** | AFK |
| **Blocked by** | None as a hard gate (soft: after 09 so references to pages 101/102 resolve too). |
| **Target Modules** | `astro.config.mjs` (new rehype plugin, modelled on the existing `rehypeNewTabLinks` at lines 9–27) |
| **Source** | `docs/PLAN-teletext-system.md` Phase 4 item 12 |
| **Linear** | [JOR-56](https://linear.app/jornesiebrands/issue/JOR-56) |
| **Status** | **implemented, tests green — awaiting user diff review (not deployed)** (2026-08-26, branch `issue-12-inline-page-links`: TDD red→green — `src/lib/rehype-page-links.ts` holds the pure `linkifyPageNumbers` matcher + `rehypePageLinks` hast transform (same pattern as `teletext-nav.ts`), wired into `astro.config.mjs`'s `rehypePlugins` alongside `rehypeNewTabLinks`. 12 new unit tests (`tests/unit/rehype-page-links.test.ts`) cover "page 205"/"Page 205"/"P205" linking, "page 999" (unregistered) and bare "100"/"p205" staying plain text, multi-match text nodes, and skipping `<a>`/`<code>`/`<pre>`. 1 integration test (`tests/integration/rehype-page-links.test.ts`) verifies against the real build that `this-site.md`'s live "Type 100 anywhere" bare number stays unlinked. Grep confirmed no content currently contains an explicit "page NNN"/"PNNN" reference, so no prose was added or changed (boundaries: content stays as authored). `npm run check`: 0 errors/0 warnings. Full suite: 9 files / 113 tests green (was 99). Not pushed.) |

## What to build

Page-number references written in prose become real links — but **only** in the explicit forms `page 205` and `P205`. Bare numbers never link: *"around 100 client workspaces"* is live copy in `about.md` and the DO24 study, and 100 is a real page — linking it would be wrong.

The plugin validates candidate numbers against the `pageRoutes.json` keys at build time; a mention of an unregistered number (e.g. "page 999") stays plain text. Applies to markdown-rendered prose only — chrome markup is untouched.

## Acceptance criteria

- [x] Prose containing "page 205" renders a link to `/projects/do24-teal-ui/` (unit-verified — no live content currently writes this form; see note below)
- [x] The "P205" form links identically (unit-verified, same caveat)
- [x] Case studies containing bare page numbers produce **no** link (verified in built HTML — corrected target: neither `about.md` nor the DO24 study actually contains "100 client workspaces" today; `do24-workflow-evolution.md` has "around **80** client workspaces", and the real bare-number case is `this-site.md`'s "Type 100 anywhere on the site", which the integration test checks against `dist/`)
- [x] Unregistered numbers ("page 999") stay plain text — no broken or guessed hrefs
- [x] Chrome (header, footer, remote) unaffected — plugin scope is content prose only (rehype `markdown.rehypePlugins` never runs on Astro component chrome)
- [x] `npm run check` && `npm run build` green

## Boundaries

**In:** one rehype plugin.
**Out:** rewriting prose to add or remove mentions (content stays as authored) · autolinking bare numbers (explicitly rejected) · markdown file edits except where a case study demonstrably wants an explicit reference added — propose first if so.

## Global gates

`npm run check` + `npm run build` green · grep-verified against live copy containing bare numbers · user approves the diff · **user explicitly triggers any push to main.**
