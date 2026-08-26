# Teletext System — concept capture + PRD triage

| Field | Value |
|---|---|
| **Status** | Planned, not started. No code written, no issues filed. |
| **Created** | 2026-08-26, `/grill-with-docs` session |
| **Repo state at planning** | `8f89096`, `origin/main` == local `main` (issues 01–06 overhaul is deployed) |
| **Supersedes** | `docs/PRD-portfolio-overhaul.md`, deleted 2026-08-26 once its S1–S5 shipped. Its still-live parts survive in `issues/01` (S6 → Phase 3 below, plus the binding N1–N9 negative decisions and the testing/confidentiality posture, inlined verbatim). |
| **Deploy rule** | Nothing pushes to main without Jorne's explicit trigger. Standing hard rule. |

## Context

An external PRD ("Next-Gen Teletext Portfolio System") described a teletext portfolio built with no knowledge of siebrands.com. Jorne liked two things about it: the interaction patterns, and the fact that it **states its concept in writing** — something this site has never done despite three years of decisions that only make sense if you already know the rules.

This plan does two jobs:

1. **Capture the concept** — write down what this site is, the vocabulary it uses, and the three decisions that look wrong without their reasoning.
2. **Triage the PRD** — MoSCoW every feature it proposes against what already exists, and build what survives.

Grilling surfaced one structural fact that changed the exercise: **the PRD's headline component already exists.** `src/components/teletext/RemoteControl.astro` renders a desktop remote rail (≥1100px) and a mobile `<dialog>` keypad. So does 3-digit routing with a live buffer readout, Fastext, real crawlable URLs, dark canvas, and PDF CVs. Roughly half the PRD is already shipped, and both `CLAUDE.md` and session memory describe the mobile flow wrongly (they say "dialog with a number input"; it is ten `<button>`s and no `<input>` exists anywhere on the site).

**The prime rule, set in this session and the reason most rows below decide themselves:**

> **Chrome may be maximalist. Content must get out of the way.**
> The shell — header, footer, page numbers, remote, navigation — is where the conceit lives and can be as deep as it likes. Case-study prose, images and tables are read by someone deciding whether to hire, and must never pay for the conceit.

---

## Verdict on the PRD

**Already built — no work needed**
3-digit routing · buffer readout (`P21_`, green→yellow) · desktop remote rail · mobile keypad sheet · soft-keyboard suppression (structural: no text input exists) · Fastext colour bar · real URLs + sitemap + JSON-LD · dark canvas · Model B infinite scroll · recruiter PDFs

**WON'T — with reasons, for the record**

| Rejected | Why |
|---|---|
| 40ch prose column | Case studies run 1000–2200 words; 40ch = 384px doubles their height and reads like a phone column on a monitor. 80ch was already a deliberate call (widened from 60ch). Violates the prime rule. |
| `#111111` background | Breaks the 8-colour rule. Canvas is pure `#000`. |
| ASCII-strip "Copy Clean Text" | Moot — there are no ASCII borders anywhere to strip. |
| Haptics (`navigator.vibrate`) | iOS Safari does not implement it; silently no-ops for ~half of mobile visitors, undetectable. |
| 7-segment LED readout + activity light | A VCR, not a broadcast page. Needs a second font or SVG (breaks Bedstead-only) and an LED green outside the 8. |
| REVEAL / conceal | Authentic, but nothing on the site has a reason to be hidden. Revisit only if content justifies it. |
| HOLD | There are no subpages to hold. |
| Decade-spaced numbering (210/220/230) | Existing numbers are shared URLs and keyboard shortcuts. Prior decision N8 forbids renumbering. |
| P999 credits/resume page | Both CVs already live on `/contact/` (400). A second destination for the same two PDFs splits the target. |
| Neon 1px image borders | Decoration applied to content. Prime rule. |
| Hash routing (`#210`) | Real URLs already exist and are better for SEO; a second address for the same page invites duplicate-content ambiguity. |

**WILL BUILD** — everything below.

---

## Sequencing

**07 defects → 08 experience matrix → 01 KION case study → 09–15 nav chrome.**

Defects first because two of them are live bugs, not features. The experience matrix jumps ahead of KION because it is smaller and fixes a more basic gap: a recruiter currently cannot see the shape of Jorne's career anywhere on the site without opening a PDF.

---

## Phase 1 — Issue 07: defects and dead code

All four defects plus the dead code.

1. **`Cmd`/`Ctrl`/`Alt` + digit is swallowed.** `BaseLayout.astro:169-176` calls `e.preventDefault()` on every `0`–`9` with no modifier guard, so **Cmd+1…9 tab-switching is broken for every desktop visitor**. Add `if (e.metaKey || e.ctrlKey || e.altKey) return;`.
2. **Page 210 is a dead end.** `public/game/arin-und-der-drache/index.html` bypasses `BaseLayout` — no header, no Fastext, zero links back. Hand-add the Ceefax header and Fastext bar as static markup. **Do not add the digit-nav script**: the game binds `up`/`space`/`r`/`escape` through Kaboom (`game.js:534,1235,1244,1437`) and digit capture would navigate a player away mid-level. Chrome only; the keyboard stays the game's.
3. **Unmapped numbers navigate silently to `/404`.** `startRoll` (`BaseLayout.astro:131-166`) does `ROUTES[targetStr] || '/404'` and animates regardless. Change to: if the key is absent, flash the buffer **red**, reset to `currentPage` after ~800ms, and **do not navigate**. `/404` goes back to serving genuinely bad URLs only.
4. **Missing `aria-live`.** The rail and dialog displays are wrapped in `aria-live="polite" aria-atomic="true"` (`RemoteControl.astro:19,46`); the header display at `BaseLayout.astro:52` is not. Add it.

**Dead code:** delete `src/components/teletext/BlinkingText.tsx` (imported by nothing), `src/components/teletext/PageNumber.astro` (imported by nothing — the header number is hand-rolled), and the unused `@utility teletext-scanline` (`global.css:108-116`).

**Then remove React entirely:** with `BlinkingText.tsx` gone, `@astrojs/react`, `react` and `react-dom` have zero consumers. Drop the integration from `astro.config.mjs`, uninstall the three packages, and correct the stack description in `CLAUDE.md`. None of phases 2–4 need React — every nav feature belongs in the existing vanilla inline script. (`this-site.md`'s `techStack` never claimed React, so no case study becomes wrong.)

**Also in this phase — the page-number drift guard.** `pageNumber` is hand-written in front matter for 12 documents *and* independently in `pageRoutes.json` for 16 entries, with nothing checking they agree; page 210 exists only in the JSON. Sequential paging (phase 4) turns latent drift into a header that lies. Add a build-time assertion that every front-matter `pageNumber` matches its `pageRoutes.json` entry and fail the build on mismatch. **`src/content.config.ts` is not touched.**

---

## Phase 2 — Issue 08: experience matrix (page 102) + Issue 09: index (page 101)

Both are additions only; no existing number moves.

### Page 102 — `/experience/`

Model it on the one fully data-driven page that already exists: `src/data/contact.json` → `src/pages/contact.astro`. New `src/data/experience.json` → new `src/pages/experience.astro`, wrapped in `PageLayout` (80ch) with `DoubleHeight as="h1"` and `Separator`, exactly like `contact.astro:14`.

**Employment — one row per employer, dual title inline, year granularity.** The CV splits both digital office 24 *and* Bikemap into two dated rows for ATS parsers; the site has no ATS to appease, and a promotion arc reads stronger to a human than two shorter jobs. Source data verified against `public/cv/jorne-siebrands-cv-en.pdf`:

| Employer | Role | Years |
|---|---|---|
| digital office 24 | Product Designer → Product Manager | 2024–2026 |
| Bikemap | Product Designer → Product Manager | 2021–2023 |
| KION Group \| Digital Campus | UX Designer | 2019–2021 |
| Cheil Germany \| Samsung | UX Designer | 2018–2019 |

This finally puts **Cheil and KION on the site properly** — they are currently named *only* in the homepage highlights strip, which was open item Q16 from the previous session. Q16 closes here.

**Plus education and personal projects and a skills block:**
- MA with distinction, Leadership in the Creative Industries, Darmstadt, 2018 — thesis *"Story-Driven City Exploration in Expanded Realities"*, which **is page 203**. Link it. BA Sound and Music Production, 2017.
- Cycling Coach and Table-Hunter — render as page-number references (207, 206) rather than repeating their descriptions, so the rows point at the real case studies.
- Skills: design & execution, AI, requirements & process, workshops, tools, languages. Recruiters keyword-scan this and it exists nowhere on the site today. Renders as a Ceefax label-and-value list.

### Page 101 — `/directory/`

One directory component listing all page numbers with titles, derived from `pageRoutes.json` plus collection titles. **Mount it twice**: on the new page 101, and on `src/pages/404.astro`, which currently hardcodes only four entries (`404.astro:24-31`). One component, two mounts.

Register `"101"` and `"102"` in `src/data/pageRoutes.json`.

---

## Phase 3 — Issue 01: KION case study (page 211)

The existing brief at `issues/01-kion-case-study-tracer.md` stands, **with one correction before drafting**: it frames the scanner story as a *2021 internal exploration*, but the CV places the role at **November 2019 – June 2021** (KION Group | Digital Campus). The CV bullet is *"Redesigned the incoming-goods process: my own field research showed a simple OCR scan into SAP could replace a planned robotic pallet-unpacking system at a fraction of the cost."* Re-date the framing before writing. Phase-A draft gate with Jorne still applies — nothing lands on disk until the draft is approved.

By this phase the experience matrix already names KION, so the case study has a home to link back to.

---

## Phase 4 — Issues 10–15: navigation chrome

All in the existing vanilla inline script in `BaseLayout.astro:89-210` and `global.css`. No new framework, no islands.

**10 — Sequential paging (←/→ + swipe).** Walk every `pageRoutes.json` key ascending, wrapping 400 → 100. One rule, no exceptions; 210 stays in the run because phase 1 gives it chrome. Needs a reverse URL→number lookup, which does not exist today. Mobile: horizontal swipe on the same sequence.

**11 — Fastext hotkeys, fixed destinations.** Bind `r`/`g`/`y`/`c` to the four existing footer links. **The four destinations stay fixed** (Home/Projects/Blog/Contact on all pages) — making them contextual would mean Contact stops being one keystroke away from wherever a hiring manager is standing, which is not a price worth paying mid-search. The contextual layer lives on the arrows instead: a small `◀ 203 · 205 ▶` affordance above the Fastext bar. Note the rail's current letter mnemonics are H/P/B/C (`RemoteControl.astro:10-15`) and will need reconciling with r/g/y/c.

**12 — Inline page-number links.** Only `page 205` / `P205` link; bare numbers never do. This is not theoretical: *"around 100 client workspaces"* is live in `about.md` and `do24-workflow-evolution.md`, and 100 is a real page. Build as a rehype plugin validated against `pageRoutes.json` keys, modelled directly on the existing `rehypeNewTabLinks` plugin in `astro.config.mjs:9-27`.

**13 — Section counter.** `3/8` in the header, driven by the case study's `##` headings via `IntersectionObserver`. Closer to teletext's subpage indicator than a percentage, and more useful on a 2200-word decision log. It occupies the yellow clock slot on long-form pages only; index pages keep the clock. **This amends a documented rule** (`CLAUDE.md` locks the yellow clock as a Ceefax element) and must be written down as such.

**14 — Key-sync animation.** Pressing a physical digit visibly depresses the matching rail button. One class toggle inside the existing `pressDigit` (`BaseLayout.astro:108-127`). Cheap, and it is what makes the rail read as a control rather than decoration. The global reduced-motion rule (`global.css:68-73`) already collapses it safely.

**15 — Opt-in full-bleed figures.** All 31 case-study figures are currently capped at 768px. Images are hand-written `<figure>` HTML in markdown, so this is one CSS rule (`margin-inline: calc(50% - 50vw)`) plus a class added to the 3–4 screen flows that earn it. **Not** the AR study's 2.3MB cover GIF or its 5.4MB hero GIF. Related but separate concern worth raising: three route-planner assets exceed 1.2MB and have spaces in their filenames, and no markdown image carries `width`/`height`, so there is zero CLS protection site-wide.

---

## Documentation (written alongside, not after)

- **`CONCEPT.md`** (repo root) — what this site *is*: a Ceefax simulator, not a retro-styled portfolio; the page-number system as the navigation model; and the prime rule above. This is the artifact the external PRD had and this repo lacked.
- **`CONTEXT.md`** (repo root) — glossary only, no implementation detail: *Fastext, page number, magazine, chrome, content, curated, archived, directory, buffer, roll*. Created lazily as terms settle.
- **`docs/adr/0001-80ch-prose-column.md`** — why 80ch and not teletext's true 40. Hard to reverse, surprising for a simulator, real trade-off.
- **`docs/adr/0002-fastext-stays-fixed.md`** — why the four colour slots do not go contextual while the arrows do.
- **`docs/adr/0003-chrome-content-split.md`** — the prime rule, and what it has already decided.
- **`issues/07`–`15`** — one file per slice above, following the existing `issues/01`–`06` format.

**Corrections to make while documenting:** `CLAUDE.md` and session memory both describe the mobile page-number flow as a "dialog with a number input" (it is a 10-button keypad, no `<input>` exists); memory records the portfolio overhaul as "local working tree only, NOT deployed" when `origin/main` and local `main` are both at `8f89096`; and memory dates KION as "~2021" against the CV's Nov 2019 – Jun 2021.

---

## Verification

Per phase, before anything is shown for approval:

- `npm run check` && `npm run build` green.
- The new page-number assertion fails the build when front matter and `pageRoutes.json` disagree — prove it by temporarily desyncing one, then reverting.
- `npm run preview`, then by hand:
  - **Phase 1**: `Cmd+1` switches browser tabs (currently does not). Page 210 shows chrome, links back, and arrow/space still drive the game. Typing `555` flashes red and does not navigate. Screen reader announces the header buffer.
  - **Phase 2**: `101` and `102` route correctly; `/directory/` and `/404` render identical listings; every number in the directory resolves.
  - **Phase 4**: `→` from 209 reaches 210 and from 400 wraps to 100; `r`/`g`/`y`/`c` hit the four Fastext targets; a case study containing "around 100 client workspaces" produces **no** link while "page 205" does; the section counter tracks `##` headings on the 2179-word Arin study.
- `designer` agent review against the 8 colours, Bedstead, and the teletext voice.
- `qa` agent pass.
- Jorne approves the diff. **Jorne explicitly triggers any push to main.**
