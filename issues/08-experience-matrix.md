# 08 — Experience Matrix (page 102, `/experience/`)

| Field | Value |
|---|---|
| **Type** | AFK |
| **Blocked by** | None as a hard gate (sequence after 07 merges per plan priority — two of its defects are live bugs). Shares the `pageRoutes.json` lock with 09 — never run 08/09 concurrently. |
| **Target Modules** | `src/data/experience.json` (create), `src/pages/experience.astro` (create), `src/data/pageRoutes.json` (+`"102": "/experience/"`) |
| **Source** | `docs/PLAN-teletext-system.md` Phase 2 (first half). Data verified against `public/cv/jorne-siebrands-cv-en.pdf`. |
| **Status** | ready-for-agent |

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

- [ ] `"102"` registered; typing `102` navigates to `/experience/`; direct URL works; nav payload contains `"102"`
- [ ] Four employer rows match the CV, promotion arcs merged, KION dated November 2019 – June 2021
- [ ] Cheil and KION named on the page (Q16 closed)
- [ ] Thesis line links to page 203's URL; projects render as page-number refs to 206/207
- [ ] Skills block present as label-and-value list
- [ ] Additions only — no existing number moves (N8)
- [ ] `npm run check` && `npm run build` green

## Boundaries

**In:** one new JSON, one new page, one `pageRoutes.json` line.
**Out:** homepage/about copy changes · CV PDFs (N6, user-owned) · schema changes · new colours/fonts (N7).

## Global gates

`npm run check` + `npm run build` green · content diff-checked against the CV data above · designer-agent review · user approves the diff · **user explicitly triggers any push to main.**
