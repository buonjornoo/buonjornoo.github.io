# 12 — Inline Page-Number Links (rehype plugin)

| Field | Value |
|---|---|
| **Type** | AFK |
| **Blocked by** | None as a hard gate (soft: after 09 so references to pages 101/102 resolve too). |
| **Target Modules** | `astro.config.mjs` (new rehype plugin, modelled on the existing `rehypeNewTabLinks` at lines 9–27) |
| **Source** | `docs/PLAN-teletext-system.md` Phase 4 item 12 |
| **Status** | ready-for-agent |

## What to build

Page-number references written in prose become real links — but **only** in the explicit forms `page 205` and `P205`. Bare numbers never link: *"around 100 client workspaces"* is live copy in `about.md` and the DO24 study, and 100 is a real page — linking it would be wrong.

The plugin validates candidate numbers against the `pageRoutes.json` keys at build time; a mention of an unregistered number (e.g. "page 999") stays plain text. Applies to markdown-rendered prose only — chrome markup is untouched.

## Acceptance criteria

- [ ] Prose containing "page 205" renders a link to `/projects/do24-teal-ui/`
- [ ] The "P205" form links identically
- [ ] Case studies containing "around 100 client workspaces" produce **no** link around the 100 (verified in built HTML)
- [ ] Unregistered numbers ("page 999") stay plain text — no broken or guessed hrefs
- [ ] Chrome (header, footer, remote) unaffected — plugin scope is content prose only
- [ ] `npm run check` && `npm run build` green

## Boundaries

**In:** one rehype plugin.
**Out:** rewriting prose to add or remove mentions (content stays as authored) · autolinking bare numbers (explicitly rejected) · markdown file edits except where a case study demonstrably wants an explicit reference added — propose first if so.

## Global gates

`npm run check` + `npm run build` green · grep-verified against live copy containing bare numbers · user approves the diff · **user explicitly triggers any push to main.**
