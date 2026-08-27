# 01 — KION Case Study End-to-End Tracer Bullet (page 211)

| Field | Value |
|---|---|
| **Type** | Human-in-the-loop |
| **Blocked by** | [08 — experience matrix](08-experience-matrix.md) — re-sequenced 2026-08-26 so the matrix names KION first, giving this study a home row on `/experience/` to link back to. Phase-A draft gate with Jorne proceeds meanwhile. Issues 02–06 are shipped and deployed (`8792f68`); grid order is settled and `order: 6` is free. |
| **Target Modules** | `src/data/projects/kion-scanner.md` (create — slug tentative until O3 sign-off), `src/data/pageRoutes.json` (+1 line), own front-matter `order: 6` |
| **Source** | Self-contained. `docs/PRD-portfolio-overhaul.md` was deleted 2026-08-26 once its S1–S5 shipped; everything this issue needed from it (§S6, §4, N1–N9) is inlined below. |
| **Linear** | [JOR-45](https://linear.app/jornesiebrands/issue/JOR-45) |
| **Status** | ready-for-human (draft gate) |

> ⚠️ **Date correction (2026-08-26).** This issue says the scanner work was a "2021 internal exploration". `public/cv/jorne-siebrands-cv-en.pdf` places the role at **UX Designer, KION Group | Digital Campus, November 2019 – June 2021**. Re-date the framing before drafting. The CV bullet reads: *"Redesigned the incoming-goods process: my own field research showed a simple OCR scan into SAP could replace a planned robotic pallet-unpacking system at a fraction of the cost."*

## Why this is #1 — layers crossed

The only slice that creates a NEW page through every layer of this site:

```
markdown content file
  → schema validation (src/content.config.ts — read-only, MUST NOT change;
    required fields: title, description, techStack, slug; pageNumber defaults "200")
    → static route generation (src/pages/projects/[...slug].astro getStaticPaths)
      → pageRoutes.json registration
        → BaseLayout keyboard-nav payload (routesJson import → inline script ROUTES)
          → Projects grid filter (!archive) + sort (order asc)
            → ProjectCard render (title, P{pageNumber}, description, techStack, coverImage)
```

Every assumption (slug conventions, pageNumber typing, order ties, schema strictness, nav-payload serialization) is proven here in one small diff. Issues 02–06 reuse these pipes.

## Phase A — Draft and user gate (before ANY file is created)

Write the full case study and present it for approval. Nothing lands on disk until then.

Draft requirements:

- ~400–600 words matching existing structure (`## Challenge` opener, chronological decision-log framing).
- Company named (KION), **zero confidential detail** — problem-type → approach → recommendation → outcome level only. The 2021 design-system act framed honestly as internal exploration with unclear shipping status.
- Second act: group-wide multibrand design system pitched and driven to adoption across KION group brands (Linde MH, Still, Dematic et al.); colleague who stayed owns it group-wide. Verify spellings before proposing (**Still GmbH**, never "Stiel").
- Propose in the SAME review, one conversation: **O3** slug/title (default `kion-scanner`), **O1** order slot (default **6** — see 04's locked table), front-matter `description` (card text) and `subtitle` (cyan strapline), `techStack` proposal `["Product Management", "User Research", "Design Systems"]`, `coverImage` pointing at an asset verified on disk (`ls public/img/…` first; if nothing fits, propose omitting the field — ProjectCard renders fine without it — never invent a path).

**Gate: user approves draft + amendments before Phase B starts.**

## TDD protocol — no test framework may be invented (static site, no unit-test infra); gates are build-output inspection + QA checklist

RED — run first, capture output showing failure:

```bash
npm run build
ls dist/projects/ | grep -i kion      # expect: no output (route doesn't exist)
grep -Fc '\"211\"' dist/index.html    # expect: 0 — NOTE escaped quotes: Astro serializes
                                      # define:vars JSON as \"211\" inside dist HTML (verified)
```

GREEN — implement minimally (approved `.md`, one `pageRoutes.json` line, `order: 6`), then all pass:

1. `dist/projects/kion-scanner/index.html` exists; subtitle renders as cyan `<p>` under the DoubleHeight title.
2. `grep -Fc '\"211\"' dist/index.html` → ≥1 AND `grep -c '/projects/kion-scanner/' dist/index.html` → ≥1 (URL present in the nav payload proves the BaseLayout bridge picked up the route).
3. QA agent, `npm run preview`: typing `211` navigates to the study; direct URL works.
4. `grep -c 'href="/projects/kion-scanner/"' dist/projects/index.html` → 1 (grid card renders title, description, techStack).
5. `npm run check` && `npm run build` green.

Known transient state: merged before 04, `order: 6` ties with `this-site.md`'s current 6. Sort stability makes it harmless and the state is undeployable (no push without user approval). Do NOT renumber other projects here — that is 04's job.

## Acceptance criteria

- [ ] Draft approved by user (incl. slug/title/order/description decisions) BEFORE any file existed.
- [ ] RED output captured before implementing; all GREEN conditions pass after.
- [ ] Study complete at `/projects/kion-scanner/`; typed `211` navigates; grid card renders.
- [ ] No `(Archive)` label (schema default `archive: false` — do not set the flag).
- [ ] Zero confidential specifics; brand spellings verified; 2021 act framed as exploration.
- [ ] `src/content.config.ts` untouched (`git diff --stat` proves it).

## Boundaries

**In:** one new `.md`, one `pageRoutes.json` line, own `order` value.
**Out (violations block merge):** any `content.config.ts` change · editing the KION mention in homepage How-I-Work (N5) · renumbering other projects · Cheil/Volksbanken content (N3) · testimonial UI (N1) · new colors/fonts/bezel (N7) · changing existing page numbers (N8).

## Inherited constraints (inlined from the deleted PRD, verbatim)

**Negative decisions — still binding on all work in this repo:**

| # | Do NOT build | Reason |
|---|---|---|
| N1 | Any testimonial UI: no slot, no placeholder, no empty section | DO24 quote outreach is user-run; nothing visibly incomplete ships |
| N2 | Availability date on site | Site keeps "Available now"; dated availability lives only in tailored CVs |
| N3 | Cheil / Volksbanken case study | Backlogged pending user locating old assets/presentations |
| N4 | Image galleries, annotated screenshots, Figma composites | Separate effort awaiting unsorted asset paths from user |
| N5 | Rewriting case-study bodies or reordering narratives | Chronological decision-log structure is the differentiator |
| N6 | Any CV or LinkedIn edits by the assistant | User-owned surfaces; assistant delivers copy only |
| N7 | New colors, fonts, layout paradigms, TV bezel | Ceefax simulator constraints are absolute (8 colors, Bedstead, screen-is-viewport) |
| N8 | Renumbering any existing page numbers | Existing numbers are shared URLs and keyboard shortcuts |
| N9 | Dark mode, scanline/motion changes | Existing `prefers-reduced-motion` behavior preserved |

**Testing posture (former PRD §4):** this is a static Astro content site with no unit-test infrastructure — **do not invent a test framework.** The gate is `npm run check` + `npm run build` + the behavioral checklist above + designer-agent review + content diff-check of locked strings verbatim.

**Confidentiality posture (former PRD §4):** company named, zero confidential detail; story stays at problem-type → approach → recommendation level; the KION work framed honestly as internal exploration with unclear shipping status; second act covers the multibrand system (Linde MH, **Still GmbH** — never "Stiel" — Dematic et al.) pitched and driven to adoption, owned group-wide post-departure. Verify brand spellings before publication.

**Content-config posture (former PRD §4):** the existing schema already supports every field used (`subtitle` optional, `archive` boolean, `order` number). **Do not extend it.**

## Global gates (every issue)

`npm run check` + `npm run build` green · copy diff-checked verbatim against the approved draft · designer-agent review (8 colors, Bedstead, teletext voice) · user approves the diff · **user explicitly triggers any push to main — never push without it.**
