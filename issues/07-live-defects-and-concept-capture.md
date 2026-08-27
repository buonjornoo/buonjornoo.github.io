# 07 — Four Live Defects + Concept Capture

| Field | Value |
|---|---|
| **Type** | AFK |
| **Blocked by** | None (can start immediately). Holds the `BaseLayout.astro` file-lock first in the 07 → 10 → 11 chain; 13/14 join the lock after 11 merges — never run concurrently. |
| **Target Modules** | `src/layouts/BaseLayout.astro` (keydown handler, `startRoll`, header buffer display), `public/game/arin-und-der-drache/index.html`, `CONCEPT.md` (create), `CONTEXT.md` (create, seed) |
| **Source** | `docs/PLAN-teletext-system.md` Phase 1 items 1–4 + Documentation section |
| **Linear** | [JOR-51](https://linear.app/jornesiebrands/issue/JOR-51) |
| **Status** | **deployed/live** (2026-08-26: user approved the diff and triggered the push; commits `bcc899c`/`8b501da`/`8c70847` on main; GitHub Actions deploy green; 38 vitest tests across 5 files; production smoke test passed all six checks — 555 red-flash reset, 206 roll to Table Hunter, Cmd+digit pass-through, 210 chrome + game boot, <1100px remote dialog). History: F1–F5 fixed 2026-08-26 via TDD red→green with mutation checks — see "Fixes applied". Designer agent errored (API 402 credits, same outage hit the QA subagent at go-live) — chrome parity self-checked: no colour/font/layout deltas |

## What to build

Two live bugs and two accessibility/UX defects, fixed before any feature work. Plus: the site's concept stated in writing for the first time — the artifact the external PRD had and this repo lacked.

**Defect 1 — `Cmd`/`Ctrl`/`Alt` + digit is swallowed.** The keydown handler calls `e.preventDefault()` on every `0`–`9` (`BaseLayout.astro:173`) with no modifier guard, breaking browser tab-switching for every desktop visitor. Add `if (e.metaKey || e.ctrlKey || e.altKey) return;` before digit handling.

**Defect 2 — Page 210 is a dead end.** The game page bypasses `BaseLayout`: no header, no Fastext, zero links back. Hand-add the Ceefax header (SIEBRANDS / page number / clock) and Fastext colour bar as static markup with working links. **Do NOT add the digit-nav script** — the game binds `up`/`space`/`r`/`escape` through Kaboom and digit capture would navigate a player away mid-level. Chrome only; the keyboard stays the game's.

**Defect 3 — Unmapped numbers silently route to `/404`.** `startRoll` does `ROUTES[targetStr] || '/404'` (`BaseLayout.astro:132`) and animates regardless. Change: if the key is absent, flash the buffer **red**, reset to `currentPage` after ~800ms, do not navigate. `/404` goes back to serving genuinely bad URLs only.

**Defect 4 — Missing `aria-live`.** The rail and dialog displays carry `aria-live="polite" aria-atomic="true"` (`RemoteControl.astro:19,46`); the header display does not. Add it, matching the pattern.

**Concept capture.** Create `CONCEPT.md` (repo root): this site is a **Ceefax simulator, not a retro-styled portfolio**; the page-number system is the navigation model; and the prime rule verbatim — *chrome may be maximalist; content must get out of the way.* Seed `CONTEXT.md` with the glossary, one line per term: Fastext, page number, magazine, chrome, content, curated, archived, directory, buffer, roll. (Maintained lazily via `/domain-modeling` afterwards.)

## Acceptance criteria

- [x] With Cmd/Ctrl/Alt held, digits reach the browser (tab switching works); bare digits still navigate as before — unit-tested (`capturesDigit`) + live-verified in browser
- [x] Page 210 renders header + Fastext bar with working links back; arrow/space/r/escape still drive the game; no digit listener exists on that page — integration-tested on dist HTML + live screenshot; game boots untouched
- [x] Typing an unmapped number (e.g. `555`) flashes the buffer red, resets to the current page after ~800ms, leaves the URL unchanged; mapped numbers unaffected — unit-tested (`resolveTarget`) + live-verified (rgb(255,0,0) flash → reset to 206, URL unchanged)
- [x] Header buffer wrapped in `aria-live="polite" aria-atomic="true"`; screen reader announces typed digits — integration-tested on dist HTML (pattern parity with RemoteControl wrappers)
- [x] `CONCEPT.md` and `CONTEXT.md` exist with the content specified above — doc tests assert prime rule + all 10 glossary terms
- [x] `npm run check` && `npm run build` green

**Test suite**: `npm test` (Vitest, added 2026-08-26) — 35 tests across 4 files: `tests/unit/teletext-nav.test.ts` (decision core + var drift-guard), `tests/unit/teletext-nav.dom.test.ts` (happy-dom DOM harness — invalid-flash timing, wired modifier guard, live-region fan-out), `tests/integration/rendered-site.test.ts` (dist HTML), `tests/integration/concept-docs.test.ts` (docs). Live browser smoke test additionally verified navigation, modifier guard, red flash and game chrome via Playwright against `astro preview`.

**Structural note**: BaseLayout's `is:inline define:vars` nav script was converted to a bundled `<script>` importing `src/lib/teletext-nav.ts` (config via `data-routes`/`data-page-number` on `<body>`) — inline scripts can't be imported, so this was the minimum enabling change for the mandated TDD seam. Behaviour ported verbatim otherwise.

## Boundaries

**In:** the four defects, the two root docs.
**Out:** dead code + React removal (16) · drift guard (17) · any RemoteControl change (mnemonic reconciliation is 11's job) · game JS changes · new colours/fonts (N7).

## Global gates

`npm run check` + `npm run build` green · designer-agent review (8 colours, Bedstead, teletext voice) · user approves the diff · **user explicitly triggers any push to main — never push without it.**

## Review findings — 2026-08-26 (`/code-review` vs HEAD, two-axis)

Diff reviewed: uncommitted working tree (BaseLayout.astro, global.css, game index.html, package.json + new src/lib/, tests/, vitest.config.ts, CONCEPT.md, CONTEXT.md). Findings split into fixes for this ticket and items recorded but out of scope here.

### Fix in this ticket

- **F1 — Defect-3 behaviour is untested at DOM level (reopens AC 3's "unit-tested" claim).** Only the pure resolver is unit-tested (`tests/unit/teletext-nav.test.ts:47–70`); the flash-red / ~800ms-reset / no-navigate path lives in `initTeletextNav` (`src/lib/teletext-nav.ts:96–109`) with no harness — `vitest.config.ts` declares no DOM environment. Add a jsdom/happy-dom environment (per-file comment or `environmentMatchGlobs`) and cover: `.invalid` class applied then removed after ~800ms, display text restored to current page, `location` never written. Done when the AC's test claim is true as written.
- **F2 — aria-live placement may not announce (reopens AC 4 pending live verification).** Attributes match RemoteControl verbatim, but there the wrappers are passive containers; here the live span sits inside `<button id="page-number-btn" aria-label="Enter page number">` (`BaseLayout.astro`). A control named via aria-label can swallow inner text changes in some screen readers. Either restructure to match RemoteControl's passive-wrapper pattern or live-verify announcement of typed digits with an actual screen reader and record the result on this ticket. dist-HTML string matching does not settle this.
- **F3 — Game-page aria-labels are German ("zur Startseite", "Schnellnavigation") while all other chrome is English.** Pick one language for UI labels site-wide (site voice is English; designer call if German is intentional) and align.
- **F4 — `var` mixed into new TypeScript** (`var target = typed;`, `var destination: string = url;` in `src/lib/teletext-nav.ts`). The "ported verbatim" excuse expires this pass; normalise to `const`.
- **F5 — Modifier guard asserted at decision level only.** No test that the wired handler skips `preventDefault` under Cmd/Ctrl/Alt (AC 1's "digits reach the browser"). Fold into F1's DOM harness: dispatch a synthetic Cmd+digit keydown and assert `preventDefault` not called / default not suppressed.

### Fixes applied — 2026-08-26 (F1–F5, TDD red→green)

- **F1 — DOM harness added; flash path now covered as claimed.** `happy-dom@20` installed; per-file `// @vitest-environment happy-dom` comment (`environmentMatchGlobs` was removed in Vitest 4). `tests/unit/teletext-nav.dom.test.ts` covers the AC verbatim: `555` → display shows typed digits with `.invalid` set and `.navigating`/`.typing` cleared; still invalid at t+799ms, reset to current page at t+800ms across **every** display surface (header buffer, sr-only live region, remote display); `window.location` stub records **zero** writes. Contrast case: mapped `206` rolls under faked rAF then routes. Mutation-verified: restoring the old `ROUTES || '/404'` hop turns all three tests red.
- **F2 — Restructured to the passive-wrapper option** (live SR verification not possible autonomously). aria-live moved out of `#page-number-btn` into a passive `<span id="page-number-live" class="sr-only" aria-live="polite" aria-atomic="true">` sibling — same shape as RemoteControl's wrappers: a plain live region whose content is only text. Nav script's display fan-out includes it, so announced text tracks the buffer exactly. Dist tests assert no `aria-live` inside the button + polite/atomic on the sibling.
- **F3 — Game-page labels aligned English**, verbatim from BaseLayout: `SIEBRANDS — go to home page`, `Quick navigation`; German strings dist-tested absent. German code comments left as-is (not UI labels).
- **F4 — All `var` normalized in `teletext-nav.ts`** (`const`; `let` only for the two frame-loop reassignments). Source drift-guard test asserts `\bvar\s` never reappears in the module.
- **F5 — Wired-guard covered in F1's harness**: synthetic Cmd/Ctrl/Alt+digit keydowns → `preventDefault` never called, buffer untouched; bare digit → intercepted and buffered. Mutation-verified: removing the guard turns all three red.

Harness notes for future tickets: vitest's fake timers do not fake `requestAnimationFrame` unless listed in `toFake` — the roll's frame callback drives navigation, so F1's suite fakes it explicitly. `initTeletextNav` binds document-level listeners and offers no teardown, so handlers accumulate across tests in one file (each closes over its own DOM snapshot; stale handlers only touch detached nodes) — assertions are node-scoped and semantic, documented in the file header. A teardown return value would fix this cleanly if 11 (Fastext hotkeys) needs it.

### Recorded — no action in this ticket

- React removal + dead-component deletion is plan-Phase-1 language but ticketed to **16** by this ticket's Boundaries; CLAUDE.md stack line staleness resolves when 16 ships.
- Clock logic duplicated (teletext-nav `updateClock` vs game-page IIFE) and Ceefax markup hand-copied into the game page: plan-mandated today ("hand-add … static markup"; `public/` cannot import `src/`). Revisit extraction when issues 10–15 start amplifying it.
- Structural rewrite (inline script → bundled import via `data-routes`/`data-page-number`): disclosed enabling change, port verified verbatim.
- Prose-exact doc tests ("chrome may be maximalist…"): intentional drift guard, keep.
- ADRs 0001–0003 from the plan's Documentation section: scoped out by Boundaries.
