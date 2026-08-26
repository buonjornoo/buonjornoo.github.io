# 02 — Hero Names Both Titles (Positioning Surface)

| Field | Value |
|---|---|
| **Type** | AFK |
| **Blocked by** | None. Holds the `index.astro` file-lock first in the 02→03→04 chain — do not start 03 until this merges. |
| **Target Modules** | `src/pages/index.astro` (hero paragraph, lines 34–37). `src/data/pages/about.md` `description` field ONLY if the meta check below fails. |
| **Source** | Shipped. Was PRD §S1; `docs/PRD-portfolio-overhaul.md` deleted 2026-08-26. Binding constraints N1–N9 now live in `issues/01`. |
| **Status** | ready-for-human |

## Vertical slice

Front-matter-free copy change → static render of `/` → SEO head tags → verification against rendered HTML. One visible end state: the positioning door names both titles on first paint.

## Locked copy — HERO v2 (Q20a), byte-for-byte

> Senior Product Designer & Product Manager. I find the structural problem nobody has named, design the answer, and follow through past release. I work with AI in both directions: designing it into products, and building with it hands-on.

Punctuation deliberate: ampersand, three sentence breaks, colon. No rewording, no smart-quote substitution. Supersedes hero v1 in memory (`portfolio-overhaul-2026-08.md` line 14 — "I find what's worth building…" stays on LinkedIn only, per Q20a).

Unchanged: avatar, `Jorne` DoubleHeight h1, and the white line "Frankfurt am Main, Germany and remote. Available now." (N2: dated availability stays off the site).

Current hero being replaced (verified): `Senior Product Designer who owns product direction as well as craft. Currently exploring AI and developer tools.` — swap the paragraph text, keep its `text-teletext-cyan` class.

## Meta description — check first, likely NO-OP

Chain: `about.md` front matter `description` → `PageLayout` → `BaseLayout` → `SEOHead.astro` (name="description", og:description, twitter:description). Current value (verified in source and dist):

> Jorne Marc Siebrands — Senior Product Designer and Product Manager in Frankfurt. Design craft plus product-direction authority. Bikemap, digital office 24, KION.

This already names both titles. **Expected outcome: no edit.** Edit only if the built meta diverges from dual-title; any edit shows before/after in the diff.

## TDD protocol — no test framework may be invented (static site, no unit-test infra)

RED — capture first:

```bash
npm run build
grep -c "structural problem nobody has named" dist/index.html   # expect: 0
grep -o 'name="description" content="[^"]*"' dist/index.html    # record current meta
```

GREEN:

1. `grep -c "structural problem nobody has named" dist/index.html` → ≥1, and the full hero paragraph diffs byte-for-byte against the quote above.
2. Meta description names Designer **and** Product Manager in name/og/twitter variants (unchanged value satisfies this).
3. "Available now." line intact in `dist/index.html`.
4. `npm run check` && `npm run build` green.

## Acceptance criteria

- [x] Hero string verbatim in rendered HTML (byte-exact, incl. `&amp;` entity rendering of `&`). (240-byte cmp match)
- [x] RED evidence recorded before implementing. (probe = 0 before edit)
- [x] Meta verified dual-title; changed only if misaligned, change shown in diff. (NO-OP — name/og/twitter all already dual-title)
- [x] No other homepage section altered in this diff.

## Boundaries

**In:** one paragraph in `index.astro`; at most the `about.md` description field.
**Out:** About body, How-I-Work (incl. its KION/Pause/Table mentions — N5), testimonials section (N1), strip (03), `curatedSlugs` (04), CV/LinkedIn surfaces (N6 — user-owned), colors/fonts/layout (N7).

## Scheduling

First consumer of `src/pages/index.astro`. Merge before 03 starts; never run 02/03/04 concurrently. Ideal carrier: one session takes 02→03→04 back-to-back (PRD's own suggestion).
