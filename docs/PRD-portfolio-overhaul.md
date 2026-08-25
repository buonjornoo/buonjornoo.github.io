# PRD — siebrands.com Recruiter-Readiness Overhaul

**Status:** Approved direction (grill-me session, 2026-08-25). No implementation started.
**Source of truth for decisions:** `.claude/projects/…/memory/portfolio-overhaul-2026-08.md` (session memory) + this document.
**Hard process rule:** Nothing merges or deploys without the user's explicit approval. All work lands as reviewable diffs.

---

## 1. Problem Statement

siebrands.com performs well in deep reads but fails the 90-second triage that most hiring managers and recruiters actually run:

1. **Strongest evidence is hidden.** Two flagship case studies — Bikemap Route Planner (biggest scale-up scope) and AR City Exploration (thesis, public exhibition) — are flagged `archive: true` and therefore invisible to anyone browsing the Projects grid or homepage. They are reachable only by typed page number or buried cross-link.
2. **The positioning door is implied, never named.** The candidate is a Senior Product Designer *and* Product Manager; the current hero says only the first half. Recruiters slotting candidates into a req cannot see which doors are open.
3. **No skimmer on-ramp on the homepage.** Scale figures exist (millions of riders, five-city live product, adopted token systems) but are scattered mid-case-study. A fast reviewer never reaches them.
4. **Three subtitles are hooks without payoffs.** Every case-study page renders its `subtitle`, but three of them describe the situation without stating what the candidate did or what happened.
5. **Site trails the CV.** The newest application CVs (Aug 2026) already claim Cheil/Volksbanken multi-brand systems work and the pitched-and-established KION group design system; the site carries neither. The robot-to-scanner KION story lives as one line inside "How I Work."

**Destination state:** a first-time visitor — recruiter, hiring manager, or peer designer — gets the positioning, the scale, and the strongest stories within one screen of scrolling, then finds every claim backed by an unhidden, complete case study. One story told identically on site, CV, and LinkedIn.

## 2. Solution Summary

Five-part surface refresh, executed strictly within the existing Ceefax/teletext constraint system (8 colors, Bedstead, no bezel, screen-is-the-viewport):

1. Replace the hero line with the locked dual-title formulation.
2. Add a terse five-line highlights strip directly under the hero.
3. Un-hide both archived case studies and re-sequence grid + homepage curation so the strongest scope story leads.
4. Complete the three payoff-less subtitles with locked wordings.
5. Publish the KION robot-to-scanner story as a new short case study at page 211, including its second act (the group-wide multibrand design system the candidate pitched into existence, now owned group-wide by a colleague who stayed).

Plus one integrity fix exposed by un-hiding: AR City Exploration's cover points at a nonexistent image file.

---

## 3. Out of Scope — Negative Decisions (definition of "done" excludes these)

| # | Decided NOT to build | Reason (locked in session) |
|---|---|---|
| N1 | Any testimonial UI: no slot, no placeholder, no empty section | DO24 quote outreach is user-run; nothing visibly incomplete ships |
| N2 | Availability date on site | Site keeps "Available now"; dated availability lives only in tailored CVs |
| N3 | Cheil / Volksbanken case study | Backlogged pending user locating old assets/presentations |
| N4 | Image galleries, annotated screenshots, Figma composites | Separate effort awaiting unsorted asset paths from user; this PRD does not block on it |
| N5 | Rewriting case-study bodies or reordering narratives | Chronological decision-log structure is the differentiator; only subtitles change |
| N6 | Any CV or LinkedIn edits by the assistant | User-owned surfaces; assistant delivered copy only (headlines EN+DE delivered and accepted) |
| N7 | New colors, fonts, layout paradigms, TV bezel | Ceefax simulator constraints are absolute (8 colors, Bedstead, screen-is-viewport) |
| N8 | Renumbering any existing page numbers | Only addition: 211 |
| N9 | Dark mode, scanline/motion changes | Untouched; existing `prefers-reduced-motion` behavior preserved |

**Done means:** slices S1–S6 below merged and verified, nothing from N1–N9 introduced, user-approved diff, user-triggered deploy.

---

## 4. System Boundaries

### Modules touched (all inside existing codebase; no schema changes required)

| Module | Change class | Notes |
|---|---|---|
| `src/pages/index.astro` | Modify | Hero text swap; new strip section; `curatedSlugs` array update. Single-file contention point for S1+S2+S3 — coordinate or sequence. |
| `src/data/projects/bikemap-route-planner.md` | Modify | Remove `archive: true`; set `order`; subtitle untouched (already has payoff). |
| `src/data/projects/ar-city-exploration.md` | Modify | Remove `archive: true`; set `order`; fix nonexistent `coverImage` path. |
| `src/data/projects/do24-workflow-evolution.md`, `bikemap-pause-mode.md`, `table-hunter.md` | Modify | Subtitle replacement only (locked wordings, §5-S5). |
| `src/data/projects/do24-teal-ui.md`, `this-site.md`, `cycling-coach.md`, `arin-und-der-drache.md` | Modify | `order` renumbering only. |
| `src/data/projects/<new kion>.md` | Create | Full case study, `pageNumber: "211"`. |
| `src/data/pageRoutes.json` | Modify | Add `"211": "/projects/<kion-slug>/"`. |
| `src/content.config.ts` | **None** | Existing schema already supports every field used (subtitle optional, archive boolean, order number). Do not extend. |
| Layouts/components | **None expected** | Strip uses plain teletext markup in index. If ProjectCard proves unable to render a GIF cover, that is the only permitted layout touch (see S4). |

### Key implementation decisions

- Locked copy strings (hero, five strip lines, three subtitles, headline set) are quoted verbatim in session memory; implementations MUST use them byte-for-byte, including em-dash choices the user made deliberately.
- Strip is server-rendered Astro markup (no React island — no interactivity needed; React stays reserved for interactive components only).
- Grid ordering continues to flow through the existing `order` field sort; homepage curation continues through `curatedSlugs`. No new data structures.
- KION case study obeys the agreed confidentiality posture: company named, zero confidential detail; story stays at problem-type → approach → recommendation level; 2021 work framed honestly as internal exploration with unclear shipping status; second act covers the multibrand system (Linde MH, Still, Dematic et al.) pitched and driven to adoption, owned group-wide post-departure. Brand-name spellings verified before publication (Still GmbH, not "Stiel").

### Testing & verification requirements

This is a static Astro content site with no unit-test infrastructure; do not invent a test framework. Verification gate is:

1. `npm run check` passes (Astro types + TS).
2. `npm run build` succeeds.
3. Behavioral checklist (QA agent):
   - Typing `211` navigates to the KION study (pageRoutes + BaseLayout keyboard nav integration).
   - Route Planner and AR City Exploration appear in Projects grid and are reachable; `(Archive)` label gone from both.
   - Homepage shows exactly the five curated cards in locked sequence, first card in featured treatment.
   - Strip renders legibly at mobile width; header/footer stickiness unaffected.
4. Designer-agent review: 8-color compliance, teletext voice, DoubleHeight/pixelation conventions intact.
5. Content review: all locked strings diff-checked verbatim; no numbers published beyond those already verified in-repo or publicly sourced (Bikemap 5.1M→8.6M sources recorded in memory).

---

## 5. Vertical Slices (tracer bullets — each is end-to-end shippable alone)

> Each slice spans content → build → rendered page → verification. None is a "backend task" or "frontend task"; each produces a visible, checkable end state.

### S1 — Positioning Surface
- **Goal:** Hero names both titles and states the value in the locked formulation; meta description agrees.
- **End state:** `/` renders: *"Senior Product Designer & Product Manager. I find the structural problem nobody has named, design the answer, and follow through past release. I work with AI in both directions: designing it into products, and building with it hands-on."* "Available now" unchanged. Meta description aligned to dual title.
- **Touches:** `index.astro` (+ `about.md` description field if meta pulls from there).
- **Done when:** string verbatim in rendered HTML; check + build green.
- **Depends on:** nothing.

### S2 — At-a-Glance Strip
- **Goal:** Five-line scope strip under hero, above About.
- **End state:** The five user-edited lines (ONE PERSON MANY HATS / CONSUMER SCALE / B2B PLATFORM / SYSTEMS ×2 / SOLO BUILDER AGENT TEAMS — exact text in memory) render teletext-native: bold yellow labels, white detail lines, no new colors, mobile-legible.
- **Touches:** `index.astro`.
- **Done when:** strip visible above About separator, designer-reviewed, responsive at 360px.
- **Depends on:** nothing functionally; **same-file contention with S1 and S3** — merge sequentially or assign to one session.

### S3 — Curation & Sequence
- **Goal:** Nothing strong is hidden; strongest story leads.
- **End state:** Both archives lifted; grid order = Workflow Evolution, Route Planner, Pause Mode, Table Hunter, teal-ui, AR City Exploration, This Site, Cycling Coach, Arin; homepage curated = Workflow Evolution (featured), Route Planner, Table Hunter, Pause Mode, teal-ui.
- **Touches:** two project `.md` front matters (archive/order), four `order` renumbers, `curatedSlugs` in `index.astro`.
- **Done when:** grid and homepage match locked sequences exactly; both ex-archive pages render without `(Archive)` label.
- **Depends on:** nothing functionally; **same-file contention with S1/S2**; **soft-blocks S4 and S6 going live** (broken cover / missing grid slot become visible only once archives lift).

### S4 — Cover Integrity (AR City Exploration)
- **Goal:** Un-hidden AR study doesn't ship a broken image.
- **End state:** `coverImage` resolves to an asset that exists on disk. Candidate: reuse existing `public/img/arCityExploration/*` (static webp preferred over 5.2MB GIF for card performance unless ProjectCard already handles GIFs acceptably — verify, then choose; decision shown to user in diff review).
- **Touches:** `ar-city-exploration.md` (possibly `ProjectCard.astro` only if GIF handling requires it).
- **Done when:** card + page render correct imagery; no 404s in build output.
- **Depends on:** **S3** (visible only after unarchive); otherwise independent file change.

### S5 — Case-Study Payoff Lines
- **Goal:** Three hooks gain role/outcome payoffs.
- **End state (verbatim, locked):**
  - Workflow Evolution: *"digital office 24, 2024–2026. Started as the designer, ended owning the product: how a conversation with an assistant became a new task architecture."*
  - Pause Mode appends: *"Shipped in ten weeks as a deliberate tradeoff: recording got pause first, navigation later."*
  - Table Hunter second sentence: *"Built solo with an agent team and my maps experience from Bikemap."*
- **Touches:** three `.md` files' `subtitle` fields.
- **Done when:** rendered under titles on respective pages, verbatim.
- **Depends on:** nothing. Ideal first parallel slice.

### S6 — KION Case Study (page 211)
- **Goal:** Robot-to-scanner judgment story + design-system leadership act, published as its own page.
- **End state:** New case study (~400–600 words, matching existing structure: Challenge → approach → recommendation → outcome framing), company named, no confidential specifics, second act covering the multibrand design-system pitch/adoption arc. Reachable via typed `211`, listed in Projects grid, slug registered in `pageRoutes.json`.
- **Touches:** new `.md`, `pageRoutes.json`, grid `order` insertion.
- **Done when:** QA checklist item 3 passes; content reviewed by user before merge (draft-first slice: draft shown for approval prior to wiring).
- **Depends on:** **S3** (order renumbering must be settled to insert cleanly — see Open Item O1).

---

## 6. Dependency Graph (for DAG construction)

```
S1 ─┐
S2 ─┼─ (same-file contention on index.astro — serialize or single-owner)
S3 ─┘
        S3 ──▶ S4 (go-live visibility)
        S3 ──▶ S6 (grid insertion point)
S5 ── (fully independent — parallelize freely)
```

- **Parallelization guidance:** S5 starts immediately anywhere. S1→S2→S3 form one serialized chain on `index.astro` (trivial diffs; one session can carry all three). S4 is mechanical once S3 merges. S6 is content-heavy — start drafting (user-review step) in parallel with everything, wire routes/grid only after S3 lands.
- **External-input slices excluded from this PRD's done-state** (blocked on user, tracked in memory): visual galleries (awaiting asset paths), Cheil/Volksbanken story (awaiting old presentations), DO24 testimonial (awaiting quote — build nothing meanwhile).

## 7. Open Items (decide during execution — do not assume silently)

| # | Item | Recommended default |
|---|---|---|
| O1 | KION study's grid `order` slot (grid sequence was locked before S6 existed) | Insert after teal-ui → teal-ui 5, KION 6, AR 7, This Site 8, Cycling Coach 9, Arin 10 |
| O2 | AR cover choice: static webp vs existing GIF | Static `raubkunst_app-design.webp` for card weight; confirm in diff review |
| O3 | KION slug + title wording | e.g. `kion-scanner` / title shown to user in draft review |
