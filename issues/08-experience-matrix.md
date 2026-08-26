# 08 — Experience Matrix (page 102, `/experience/`)

| Field | Value |
|---|---|
| **Type** | AFK |
| **Blocked by** | None as a hard gate (sequence after 07 merges per plan priority — two of its defects are live bugs). Shares the `pageRoutes.json` lock with 09 — never run 08/09 concurrently. |
| **Target Modules** | `src/data/experience.json` (create), `src/pages/experience.astro` (create), `src/data/pageRoutes.json` (+`"102": "/experience/"`) |
| **Source** | `docs/PLAN-teletext-system.md` Phase 2 (first half). Data verified against `public/cv/jorne-siebrands-cv-en.pdf`. |
| **Status** | **reworked — F1–F9 fixed, all automated + designer gates green, awaiting user diff approval** (2026-08-26, follow-up session: all nine review findings addressed TDD-first — each fix landed red→green at an agreed seam; suite now 84 passed across 6 files (was 60), `npm run check` 0 errors / 0 warnings, `npm run build` clean, 17 pages. Rendered `dist/experience/index.html` read back and diff-checked line by line against `pdftotext` output of `public/cv/jorne-siebrands-cv-en.pdf` — every education and skills string now traces to a CV line. Designer-agent gate run and PASSED 2026-08-26. The `.gitignore` hunk is out of this ticket's diff (commit `1e88c3b`). Ticket work remains **uncommitted and not pushed**. See "Rework" below.) |

## What to build

A recruiter can see the shape of Jorne's career on-site without opening a PDF. Model it on the one fully data-driven page that exists: `contact.json` → `contact.astro`. New `experience.json` → new `/experience/` page, wrapped in `PageLayout` (80ch) with `DoubleHeight as="h1"` and `Separator`, exactly like `contact.astro:14`.

**Employment — one row per employer, dual title inline, year granularity.** The CV splits digital office 24 and Bikemap into dated rows for ATS parsers; the site has no ATS to appease, and a promotion arc reads stronger than two short jobs:

| Employer | Role | Years |
|---|---|---|
| digital office 24 | Product Designer → Product Manager | 2024–2026 |
| Bikemap | Product Designer → Product Manager | 2021–2023 |
| KION Group \| Digital Campus | UX Designer | Nov 2019 – Jun 2021 |
| Cheil Germany \| Samsung | UX Designer | 2018–2019 |

This closes open item **Q16**: Cheil and KION become properly named on-site (currently only in the homepage highlights strip).

**Plus:** education (MA with distinction, Leadership in the Creative Industries, Darmstadt, 2018 — thesis *"Story-Driven City Exploration in Expanded Realities"*, which **is page 203** — link it; BA Sound and Music Production, 2017) · personal projects rendered as **page-number references (207, 206)** pointing at the real case studies rather than repeating descriptions · skills block (design & execution, AI, requirements & process, workshops, tools, languages) rendered as a Ceefax label-and-value list.

## Acceptance criteria

- [x] `"102"` registered; typing `102` navigates to `/experience/`; direct URL works; nav payload contains `"102"` — *re-ticked: keyboard nav now asserted end to end against the real route map (`tests/unit/teletext-nav.dom.test.ts`), mutation-checked by deleting `"102"` from `pageRoutes.json` (test went red, then restored)*
- [x] Four employer rows match the CV, promotion arcs merged, KION dated November 2019 – June 2021
- [x] Cheil and KION named on the page (Q16 closed)
- [x] Thesis line links to page 203's URL; projects render as page-number refs to 206/207
- [x] Skills block present as label-and-value list
- [x] Additions only — no existing number moves (N8)
- [x] `npm run check` && `npm run build` green

## Boundaries

**In:** one new JSON, one new page, one `pageRoutes.json` line.
**Out:** homepage/about copy changes · CV PDFs (N6, user-owned) · schema changes · new colours/fonts (N7).

## Global gates

`npm run check` + `npm run build` green · content diff-checked against the CV data above · designer-agent review · user approves the diff · **user explicitly triggers any push to main.**

**Gate status after rework (2026-08-26):** `npm run check` + `npm run build` green ✅ · content diff-checked against the CV ✅ **re-run and passing** (F1–F3 fixed; rendered output verified line by line against the PDF) · designer-agent review ✅ **PASS** (run 2026-08-26 with Jorne's explicit permission, `@designer` on Sonnet, scoped read-only to page 102: no blocking violations; palette confined to the 8-colour set, chrome parity with `contact.astro` confirmed structurally and in the rendered HTML, colour semantics and 80ch measure hold, prime rule respected. Two non-blocking notes, both no-action: the settled `white/80`, and the `dl`/`dt`/`dd` swap for skills recorded as intentional variation) · user approves the diff — **not reached** · push to main — not reached.

## Review findings — 2026-08-26 (`/code-review issue 08`, two-axis vs `HEAD` = `77aeace`)

Diff reviewed: the uncommitted working tree implementing this ticket — `src/data/experience.json`, `src/pages/experience.astro`, `tests/integration/experience-page.test.ts` (all new/untracked), `src/data/pageRoutes.json`, `.gitignore`, and this file. No commits since the fixed point.

Both axes found the ticket's completion claims overstated: every AC box was ticked and Status read "implemented", but the CV diff-check and designer-agent global gates had not actually been discharged. **This section is the work order; it is kept verbatim as the record. All nine findings were fixed in the follow-up session — see "Rework" at the end of this file.**

### Fix in this ticket

Ordered by severity. Spec axis first (F1–F5), then standards (F6–F9).

- **F1 — BA school is fabricated (reopens the "content diff-checked against the CV" global gate).** `src/data/experience.json:41` reads `"school": "SAE Hamburg"`. The CV (`public/cv/jorne-siebrands-cv-en.pdf`, extracted via `pdftotext`) places *Bachelor of Arts – Sound and Music Production* at **Darmstadt University of Applied Sciences** — the same school as the MA. This is invented biographical data on a recruiter-facing page. Correct it to the CV value. Done when the rendered education block matches the PDF verbatim and a test asserts the school string.
- **F2 — Skills values are largely invented rather than CV-derived (same gate).** Spec asks for "skills block (design & execution, AI, requirements & process, workshops, tools, languages)". The six *labels* are right; four of the six *values* are not:
  - Tools (`experience.json:69`) adds **Vercel, Astro, Tailwind CSS** (absent from the CV) and drops Linear, VS Code, Claude Code with MCPs, FigJam.
  - AI (`:57`) lists **ChatGPT, custom GPTs, "AI prototyping"** — none appear in the CV.
  - Requirements & process (`:61`) lists **Scrum, Kanban, roadmapping, backlog ownership** — none in the CV, which says requirements analysis/prioritization, process analysis and modeling, specifications.
  - Design & execution (`:53`) substitutes **"usability testing"** for the CV's accessibility (WCAG/BITV), information architecture, interaction design, prototyping in code.
  Replace all six values with the CV's own wording. Done when each value is traceable to a CV line.
- **F3 — MA school name uses the German form.** `experience.json:36` renders `"Hochschule Darmstadt"`; the EN CV says *Darmstadt University of Applied Sciences*. Site voice is English (issue 07 F3 settled this for the game page). Align.
- **F4 — CV download block is out of scope.** `src/pages/experience.astro:93-97` adds a "Full details in the CV: Download PDF" block. Boundaries: "**Out:** … CV PDFs (N6, user-owned)", and What-to-build's whole premise is "without opening a PDF". Remove it, or get an explicit user decision to keep it — and if kept, move the copy into `experience.json` per F6.
- **F5 — `.gitignore` edit belongs to another ticket.** Boundaries: "**In:** one new JSON, one new page, one `pageRoutes.json` line." The hunk adds `docs/temp-images/` (raw case-study image source — issue 01/18 territory) and `.playwright-mcp/`, a path that does not exist in the repo. Split into a separate chore commit. *(Standards axis flagged the same hunk as Divergent Change: two unrelated concerns in one edit inside an unrelated ticket.)*
- **F6 — User-facing copy hardcoded in the template, against the pattern the spec names.** CLAUDE.md: "**Content**: All content lives in `src/data/`", and the spec says "Model it on the one fully data-driven page that exists: `contact.json` → `contact.astro`" — which externalises even its footer sentence. `experience.astro` hardcodes the section headings (`Employment`, `Personal projects`, `Education`, `Skills`) and the connective copy (`— full case study on`, `Thesis:`, `— now page`, `Full details in the CV:`, `Download PDF`). Move to `experience.json`.
- **F7 — Hardcoded page number in markup.** `experience.astro:71-72` emits a bare literal `203` next to `{edu.thesis.url}`. CLAUDE.md makes `pageRoutes.json` the number→URL map; this is exactly the unvalidated hand-written duplication CLAUDE.md flags and issue **17** (drift guard) exists to catch. Derive the number from the route map, or at minimum source it from `experience.json` alongside the URL.
- **F8 — `CONTEXT.md` glossary left stale.** Its **Page number** entry still enumerates `100, 200, 201–210, 300, 400`; this ticket adds 102. `docs/agents/domain.md`: "use the term as defined in `CONTEXT.md`… a gap is a signal". Issue 07 set the precedent of maintaining it in-ticket. Add 102.
- **F9 — Two global gates unmet while every AC box was ticked.**
  - *Designer-agent review* was skipped (the Status line admitted it and substituted self-attestation). A self-check does not discharge a documented gate — run it, or record an explicit user waiver.
  - *Content diff-checked against the CV* is contradicted by F1–F3. Re-run it after those land.
  - AC 1's "typing `102` navigates" is asserted only at the payload level (`tests/integration/experience-page.test.ts:70`); there is no keyboard-nav assertion. Either add one (issue 07's `tests/unit/teletext-nav.dom.test.ts` harness is the model) or reword the AC to claim only what is tested. Box un-ticked pending this.

### Recorded — judgement calls, no action required

Baseline smells the standards axis raised; none is a documented-standard breach. Fix opportunistically or leave.

- **Duplicated Code / Primitive Obsession — `experience.json`:** `{ "name": "Cycling Coach", "number": "207", "url": "/projects/cycling-coach/" }` restates the `pageRoutes.json` pair in a second, unvalidated place. One `number` plus a lookup would hold the map once. Overlaps F7 and issue 17's drift guard — likely resolves there.
- **Duplicated Code — `tests/integration/experience-page.test.ts`:** `readFileSync(join(dist, 'experience', 'index.html'), 'utf-8')` repeats across five `describe` blocks; `rowFor`, `blockContaining`, `refFor` are three near-identical "find the element containing X" helpers.
- **Mysterious Name — same file:** `const dt = html.match(...)` inside `valueFor` holds a `dt`+`dd` pair, not a `dt`; `blockContaining` returns an `<li>`.

### Verified clean — do not re-litigate

- Employer rows, merged promotion arcs, KION dates, thesis link (`/projects/ar-city-exploration/` = 203) and the 206/207 page-number refs all check out against the CV and `pageRoutes.json`.
- AC 2's "November 2019 – June 2021" vs the page's `Nov 2019 – Jun 2021`: the abbreviation matches this ticket's own table. Cosmetic, no change.
- `intro` field in `experience.json` is unspecified but justified by `contact.json` parity.
- `text-teletext-white/80` (off-palette on render) and `experience.json` bypassing `src/content.config.ts`: both suppressed under existing `contact.astro`/`contact.json` precedent.

## Rework — 2026-08-26 (follow-up session, TDD red→green per finding)

Every fix was driven by a test written first and observed failing. New coverage: +24 assertions (60 → 84 across 6 files).

| # | Resolution | Test that locks it |
|---|---|---|
| **F1** | BA school `SAE Hamburg` → `Darmstadt University of Applied Sciences` (the CV's value; both degrees are from the same school). | `experience-page.test.ts` — "names the BA school exactly as the EN CV does (F1)" + a check that no unlisted school appears anywhere on the page. |
| **F2** | All six skills values replaced with the CV's own wording, transcribed verbatim from the PDF's Skills block. Labels unchanged (review confirmed them correct). Invented entries gone: Vercel, Astro, Tailwind CSS, ChatGPT, custom GPTs, Scrum, Kanban, roadmapping, backlog ownership, usability testing, design sprints. | Six `toBe` assertions against CV literals, plus "claims no skill the CV does not list" scanning the rendered `<dl>`. |
| **F3** | MA school `Hochschule Darmstadt` → `Darmstadt University of Applied Sciences` (EN site voice, per issue 07 F3). | "names the MA school exactly as the EN CV does (F3)". |
| **F4** | CV download block removed, with its trailing separator — the page's premise is the career readable without a PDF, and CV PDFs are out of scope (N6). Page 400 keeps the downloads. | "offers no CV download" — asserts no `/cv/` and no `Download PDF` on the page. |
| **F5** | `.gitignore` split out into its own chore commit `1e88c3b`, keeping only `docs/temp-images/`. The `.playwright-mcp/` entry was dropped — no such path exists in the repo. **Confirmed by the user 2026-08-26: dropping it is correct, no action.** Nothing writes to that path today, and it is out of `public/`/`src/`, so neither the Pages build nor the site is affected; if the Playwright MCP is ever run in this cwd, add the entry then. | n/a (working-tree hygiene). |
| **F6** | Section headings and connective copy moved into `experience.json` under `headings` and `copy`. The template now holds structure and classes only. `title`/`description`/the `<h1>` stay inline, matching `contact.astro` — the precedent the spec names. | "renders its section headings from experience.json, in page order" + seven source-level assertions that the template hardcodes none of that copy. |
| **F7** | `experience.json` now references other pages **by number only**; `experience.astro` resolves URLs through `pageRoutes.json` via `urlFor()`, which throws at build time on an unmapped number. This also resolves the recorded Primitive Obsession smell — the `number`+`url` pair in `personalProjects` is gone. | Three tests: no page-number literal in the template beyond its own; no route URL restated in `experience.json`; every rendered "page NNN" reference resolves to the map's URL for NNN. |
| **F8** | `CONTEXT.md` glossary **Page number** entry now reads `100=Home, 102=Experience, 200=Projects, …`. | `concept-docs.test.ts` — "keeps the page-number entry current with the route map". |
| **F9** | Keyboard nav asserted end to end: typing `1-0-2` through the real `keydown` seam against the real `pageRoutes.json` navigates to `/experience/`. Mutation-checked (removing `"102"` turned it red; restored). CV diff-check re-run and passing. Designer-agent gate **discharged 2026-08-26: PASS**, no blocking violations — see gate status above. | `tests/unit/teletext-nav.dom.test.ts` — "navigates to /experience/ when 1-0-2 is typed". |

## Re-review — 2026-08-26 (`/code-review on issue 08 fixes`, two-axis vs `HEAD` = `1e88c3b`)

Second pass, auditing the Rework table's claims against the files rather than its prose. Suite independently re-run: **84 passed / 6 files**, `npm run build` clean, 17 pages.

**Standards axis — 0 hard violations.** F6/F7/F8 land correctly; every surviving deviation is covered by existing `contact.astro`/`contact.json` precedent. Five judgement calls recorded, none blocking: the `white/80` surface grew from one footer line to a whole `<dl>`'s values (designer gate passed it explicitly); `urlFor()` lives in the page rather than a shared module while `RemoteControl.astro` still hand-pairs href+number (**17**'s territory); `pageLinkLabel`/`thesisRefLead` encode the word "page" twice; two template-source assertions are over-broad (`:222`'s `/\b\d{3}\b/` would fail on any future three-digit literal such as `mt-[100px]`); `readFileSync` repetition grew 5 → 8 describe blocks.

**Spec axis — 8 of 9 findings verified genuinely fixed**, against `pdftotext` of the CV, not the ticket's own claims. F1/F3 schools match the PDF for both degrees; F2's six skills values are byte-for-byte the CV's Skills block with every invented entry gone and every dropped one restored; F4's CV block is absent; F5 is out of the diff; F6's template holds only title/description/`<h1>`; F7 resolves 203/206/207 correctly through the map and throws on unmapped numbers; F8's glossary entry carries 102; F9(a)'s keyboard nav runs through a real keydown seam. **No scope creep** — boundaries hold exactly.

**Open items resolved by the user, 2026-08-26:**

- **F9(c) — designer-agent gate: CONFIRMED by the user.** The review could only see the ticket attesting itself; the user confirmed the gate was genuinely run. Gate discharged.
- **F5 — `.playwright-mcp/` drop: CONFIRMED correct**, no action (see F5 row above).
- **F8's guard is weaker than its name** — the test titled "keeps the page-number entry current with the route map" only asserts `toContain('102')` and never reads `pageRoutes.json`. Severity low (it guards doc prose, and a literal one-to-one check would be wrong against the line's `201–210` range notation), but the title is a false coverage claim. **Filed as [issue 19](19-glossary-drift-guard-honesty.md); not fixed in this ticket.**

**Deferred by the user:** page 102 has no inbound link — it is reachable only by typing the number. The user's decision is to ship this ticket first and address discoverability immediately after (issue **09**, the 101 directory page, is the natural home).

Remaining gate: **user approves the diff** → then push, on the user's explicit trigger only.

**Left deliberately alone:** the two recorded test-hygiene smells (repeated `readFileSync` across `describe` blocks; the `dt`/`blockContaining` naming). They are judgement calls, not standards breaches, and refactoring tests sits outside the red→green loop.
