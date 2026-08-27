# P204 Revamp + Design System Consolidation — PRD

**Status:** Approved by Jorne (grilling session, 2026-08-27). Ready for implementation.
**Source:** `/domain-modeling` + `grilling` session against the P204 frame in the Paper desktop app (file `01M0Z4XTDCBRB2ACVAAX0BXZKV`, frame `VR-0`, node name "P204"). Full Q&A trail lives in that conversation; this document is the resolved spec.
**Owner of design-system changes:** `@designer` agent, per `.claude/agents/designer.md` ("Changes to the design system must be approved by me" — approval given below, per item).

## 1. Context

Jorne mocked up a revamped `do24-workflow-evolution.md` (page 204, "Workflow Evolution") in Paper. The frame contained three tangled kinds of change:

1. **Site-wide design-system changes** (color roles, typography, header chrome, blockquote treatment) — apply everywhere, not just this page.
2. **A site-wide structural pattern** (the frontmatter-readout block) — applies to all project pages.
3. **Content specific to this one case study** (new images, expanded diagrams).

The site currently documents its design system in `DESIGNSYSTEM.md` (the single source of truth per `CLAUDE.md`'s routing table) and enforces it via `.claude/agents/designer.md`. Several requirements below directly amend that system, including breaking its own "8 colors only, no exceptions" rule — done deliberately and with an ADR, not by accident.

This PRD also intersects three already-open Linear issues (JOR-57, JOR-59, JOR-62); §7 covers how.

## 2. Goals

- Consolidate the color and typography system so every role has exactly one color, with no color carrying unrelated jobs (yellow was overloaded: heading color, emphasis color, and static chrome color at once).
- Expand the Ceefax header with orientation content (identity, page title, date) without diluting its teletext-broadcast identity.
- Give long-form pages a reading-progress affordance without inventing new chrome.
- Split blockquote styling into two real content types (interview quote vs. callout) using a signal already present in existing markdown — no new authoring syntax.
- Fix a genuinely inaccurate schema field name (`techStack`) at the source, not just in one new display.
- Ship P204's expanded case study (8 images, replacing today's 3) without colliding with two already-open image-related issues.

## 3. Non-goals

- Implementing the blog-hiding idea raised mid-session — parked, tracked nowhere yet, needs its own scoping pass.
- Full-bleed image treatment (JOR-59) and image weight/CLS work (JOR-62) — deliberately sequenced *after* this PRD ships (§7).
- Any change to the Fastext footer, remote control, or keyboard navigation — out of scope, untouched by the mockup.
- Any content rewrite of the case study prose itself — only images and callout/quote styling change; body text is as currently published.

## 4. Requirements

### 4.1 Ceefax header (site-wide)

Applies to **every page**, not just project pages.

| Element | Desktop | Mobile |
|---|---|---|
| Masthead — **"SIEBRANDS"** | unchanged, stays as brand mark (see 4.1.1) | visible |
| Identity line — **"Product Designer · PM"** | new, role only, no name repeated | **hidden** |
| Page-number button (`P204` etc.) | unchanged | visible, unchanged |
| Page title (e.g. "Workflow Evolution") | new, for orientation; carries the reading-progress counter on long-form pages (§4.3) | **hidden**, replaced by a compact `k/N` fallback where a counter applies (§4.3) |
| Date | new | **hidden** |
| Clock | unchanged position, **color changes** (§4.2) | visible, unchanged position |

#### 4.1.1 Masthead identity — decision reversed mid-session

The original mockup replaced "SIEBRANDS" with "Jorne Siebrands." This was reconsidered and **reversed**: `CONCEPT.md` states *"siebrands.com is a Ceefax simulator, not a retro-styled portfolio... the aesthetic is not decoration applied to a normal portfolio — it is the medium itself."* A real teletext masthead carries the broadcaster's name (CEEFAX, ORACLE), not a personal byline. **"SIEBRANDS" stays.** Personal identity lives entirely in the new "Product Designer · PM" line beneath it.

### 4.2 Color system consolidation (site-wide)

Every role now maps to exactly one color. Full replacement table for `DESIGNSYSTEM.md`:

| Color | Hex | Role (new) | Changed from |
|---|---|---|---|
| Black | `#121212` | Background everywhere | **changed** — was `#000000`; see decision below |
| Red | `#FF0000` | Errors, fastext Home (100) | unchanged |
| Green | `#00FF00` | Success states, fastext Projects (200) | **shrunk** — list markers/dates/captions move to Grey |
| Yellow | `#FFFF00` | Transient/active-state feedback only: nav buffer while rolling, hover states, fastext Blog (300) | **shrunk** — no longer used for h2, strong text, or the clock |
| Blue | `#0000FF` | Sparingly, decorative only | unchanged |
| Magenta | `#FF00FF` | Tags/categories/accents (incl. the renamed `tags` chips, §4.5) | unchanged |
| Cyan | `#00FFFF` | Service name, links, subtitles, h3, **strong/emphasis (new)**, interview-quote text + border (new), fastext Contact (400) | **grew** — absorbs strong text and quote styling |
| White | `#FFFFFF` | Body text, borders, static page-number display, **h2 headings (new, double-height)**, **clock (new)** | **grew** — absorbs h2 and clock |
| **Grey** *(new, 9th color)* | **`#A0A0A0`** | De-emphasized text: quote attributions, list markers, dates, captions | **new addition** — breaks the "8 colors only" rule; see ADR 0004 (§6) |

**Rationale for yellow's shrink (Jorne, verbatim):** *"Yellow should have a dedicated consistent function... Yellow is too bright for static content."* Yellow is now reserved exclusively for transient/attention states — nothing that sits static on screen uses it anymore. This is consistent with the existing, pre-established "Buffer" behavior in `CONTEXT.md` (green while typing → **yellow while navigating** → red flash on invalid) — yellow's new role is just that pattern generalized.

**h1 addendum (surfaced during `@designer`'s pass on JOR-66, not in the original grilling session):** the consolidation above only explicitly addressed h2, but every page's h1 (via `DoubleHeight`) was still static yellow — the same violation of "never used for static content" that h2 was fixed for. **Resolved:** h1 moves to white too, same treatment as h2. Jorne: *"White please."*

**Decided:** `#121212` is the new black token value, replacing `#000000`, applied consistently everywhere the background color is used site-wide. Jorne, on confirming: *"121212 is the new value for the black token. should be used consistently. good catch."* This was flagged mid-session (Paper's own token file already used it consistently, unremarked) rather than silently carried over — now resolved as an explicit requirement, not a leftover mockup default.

**Risk accepted, no pre-ship gate (Jorne, verbatim):** raised as a concern mid-session (*"I don't fully know the impact of having grey for all dates. Might look weird"*), then resolved directly rather than blocked on a check: *"Lets just use grey and see how it turns out."* Ship it; if `/projects/` or a blog post reads poorly in grey at high repetition once live, that's a follow-up fix, not a blocker on this PRD.

### 4.3 Section counter (JOR-57 collision — already resolved)

The reading-progress counter (`k/N`) rides **inside the page-title slot**, not the clock slot — e.g. "Workflow Evolution 5/7." The clock is untouched by this feature. On mobile, where the title is hidden, show a compact `5/7` fallback instead of the full title+counter. **JOR-57 has already been updated in Linear** to match this (see §7).

### 4.4 Blockquote split (site-wide)

Two visually distinct treatments, replacing the current single blockquote style (yellow border + cyan text):

| Type | Visual | Detection |
|---|---|---|
| **Interview quote** | Cyan left border (2px), cyan quote text, grey (`#A0A0A0`) attribution line | Blockquote's last line starts with an em dash (`—`) |
| **Callout** (e.g. "Key learning:") | No border, plain white text | Everything else |

No new markdown authoring syntax needed — every interview quote in the current content already ends with `— Attribution`, and no callout does. Implement as a rehype plugin (same pattern as the existing `src/lib/rehype-page-links.ts`, wired in `astro.config.mjs`) that inspects each `blockquote` node's last child and assigns a class accordingly. Update `.prose-teletext` styles in `ProjectLayout.astro` and `BlogPostLayout.astro` to consume the two classes.

### 4.5 Frontmatter-readout pattern (project pages only, not blog)

A new content block renders directly under the H1 on every project page, styled as plain body text (not a special component) — a literal key:value readout that looks like the page's own frontmatter:

```
title: "Workflow Evolution"
subtitle: "digital office 24, 2024–2026. Started as the designer, ended..."
tags: ["Product Management", "UX Design", "Research", "Fintech", "B2B"]
pageNumber: "204"
context: "digital office is a platform for High Networth Individuals..."
```

- `title`, `subtitle`, `tags`, `pageNumber` — **always shown**, sourced directly from real frontmatter.
- `context` — **optional**, a new schema field (see below); omitted from the block entirely when not authored. Jorne: *"context is optional since I don't have time to write it for all cases today."*
- The displayed keys **must match real schema field names exactly** — the entire point is that it looks like genuine frontmatter, not flavor text. This is why `techStack` is being renamed (§4.6): the mockup displayed `tags:`, which was actually more accurate than the real field name.
- Scope: **project pages only**. Not applied to blog posts — blog's frontmatter (`title`, `pubDate`, `tags`, `draft`) doesn't fit the "case study" register this pattern is going for.

**Schema change required:** add `context: z.string().optional()` to the `projects` collection in `src/content.config.ts`.

### 4.6 Schema rename: `techStack` → `tags`

Checked all 9 project files — `techStack` has never actually held technologies consistently; it already mixes real tech (React, Figma, Cloudflare, Unity3D), disciplines (Product Management, UX Design), and domain tags (Fintech, B2B, Personal Project). Jorne: *"that's what I originally wanted."*

Rename everywhere:
- `src/content.config.ts` — schema field `techStack` → `tags`
- All 9 files in `src/data/projects/*.md` — frontmatter key `techStack:` → `tags:`
- `src/components/projects/ProjectCard.astro` and `ProjectGrid.astro` — prop name and usage
- The frontmatter-readout block (§4.5) — displays `tags:`, now accurate

### 4.7 P204 content: image replacement

The Paper mockup's 8 images (verified as real uploaded PNGs on Paper's asset host, not placeholders) replace the current 3 in `do24-workflow-evolution.md`. Jorne: *"I improved the images. the ones from paper should replace existing ones."* One duplicate/wrong caption bug found during review (two different images sharing an identical caption) — **already fixed by Jorne in the Paper app.**

Sequencing: this PRD ships first; JOR-59 (full-bleed figures) and JOR-62 (image weight/CLS) get rescoped against the new 8-image set afterward — not touched by this work (§7).

## 5. Mobile summary (all hides, one place)

Hidden on mobile: identity line ("Product Designer · PM"), page title, date. Shown on mobile: "SIEBRANDS" masthead, page-number button, clock, and — where a page has a section counter — a compact `k/N` fallback in place of the hidden title.

## 6. Documentation deliverables

This is the `@designer` agent's task (§8) — its charter requires design-system changes to be approved by Jorne, which this PRD constitutes:

1. **`DESIGNSYSTEM.md`** — full rewrite of the color table (§4.2), typography section (h2, strong), prose-styles line (blockquote split, §4.4), header rules (§4.1), and a new section documenting the frontmatter-readout pattern (§4.5).
2. **`docs/adr/0004-ninth-color-grey.md`** *(new — 0001–0003 are reserved by JOR-59/55/57 respectively and not yet written)* — why grey breaks the documented "8 colors only, no exceptions" rule. Jorne, on authorizing this: *"I am the designer who defined the design system. I am the one who changed it. The design system changes need to be documented. I authorize this."*
3. **`CONTEXT.md`** — add terms for the two new named patterns that need shared vocabulary: the frontmatter-readout block, and the quote/callout blockquote distinction.
4. **Consistency audit** — every current file/line using the old yellow-h2, yellow-strong, or green-caption/date/list-marker rules, so implementation doesn't miss a spot.

## 7. Linear coordination

| Issue | Status | Action |
|---|---|---|
| **JOR-57** (13 — Section Counter) | Open | **Already updated** — description and acceptance criteria amended to match §4.3 (title-slot, not clock-slot). |
| **JOR-59** (15 — Opt-in Full-Bleed Figures) | Open | **Not touched yet.** Explicitly targets this file's figures. Rescope after this PRD ships and the 8-image set is live — building against 3 images about to become 8 would be rework. |
| **JOR-62** (18 — Image Weight/CLS) | Open, blocked by JOR-59 | **Not touched yet.** Same reasoning — rescope after the new image set lands. |

## 8. Designer agent task

Per `.claude/agents/designer.md`, the designer's authority is to **BLOCK / approve / specify exact CSS values** — it does not implement. Its task against this PRD:

1. Read this PRD in full.
2. Read current `DESIGNSYSTEM.md`, `CONTEXT.md`, `ProjectLayout.astro`, `BlogPostLayout.astro`, `BaseLayout.astro`, `global.css`.
3. Grep the codebase for every existing usage that the color/typography consolidation (§4.2) touches — every `text-teletext-yellow` on headings/strong, every `text-teletext-green` on captions/dates/list markers — and produce a complete file+line inventory.
4. Produce the exact replacement text for `DESIGNSYSTEM.md` (§6.1).
5. Produce the exact content for `docs/adr/0004-ninth-color-grey.md` (§6.2).
6. Surface a recommendation on the `#000000` vs `#121212` background flag (§4.2) — do not silently resolve it.
7. Return findings in the agent's standard output format (Visual Review / Findings / Specs), extended with the inventory from step 3.

Implementation of the inventory from step 3 (actually changing component files) is `@frontend` work, tracked separately once this documentation lands.

## 9. Acceptance criteria

- [ ] `DESIGNSYSTEM.md` reflects the full table in §4.2, the header rules in §4.1, the blockquote split in §4.4, and the frontmatter-readout pattern in §4.5.
- [ ] `docs/adr/0004-ninth-color-grey.md` exists and explains the trade-off.
- [ ] `CONTEXT.md` has entries for the frontmatter-readout pattern and the quote/callout distinction.
- [x] `#121212` confirmed as the new black token value (replacing `#000000`), applied consistently.
- [x] Grey-for-dates: risk acknowledged, shipped without a pre-check ("let's just use grey and see how it turns out").
- [x] h1 resolved: white, same as h2 (was yellow).
- [ ] `techStack` no longer exists anywhere in the codebase; `tags` is used consistently in schema, content, and components.
- [ ] `context` is a valid optional field in the projects schema.
- [ ] JOR-57 confirmed up to date (done — see §7).
- [ ] `npm run check` && `npm run build` green after implementation.
