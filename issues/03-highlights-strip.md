# 03 — At-a-Glance Highlights Strip

| Field | Value |
|---|---|
| **Type** | AFK |
| **Blocked by** | 02 [file-lock: `src/pages/index.astro`] |
| **Target Modules** | `src/pages/index.astro` — one new `<section>` between the hero `Separator` and the About section |
| **Source** | Shipped. Was PRD §S2; `docs/PRD-portfolio-overhaul.md` deleted 2026-08-26. Binding constraints N1–N9 now live in `issues/01`. |
| **Status** | **deployed/live** (portfolio overhaul, `8792f68`, confirmed ancestor of origin/main) |

## Vertical slice

Server-rendered Astro markup → static render of `/` → DOM-order + responsive verification. No React island (zero interactivity; React stays reserved for stateful components only). One visible end state: positioning (02) followed immediately by scale evidence within one screen of scroll.

## Locked copy — byte-for-byte

Source of truth is session memory (`portfolio-overhaul-2026-08.md`, "Homepage highlights strip LOCKED"), which wins over the PRD's §S2 paraphrase: **labels carry commas** ("ONE PERSON, MANY HATS"). Verified identical to memory:

1. **ONE PERSON, MANY HATS** — owned product direction and design mentoring at digital office 24 and Bikemap; did QA and support too, wherever the product needed hands
2. **CONSUMER SCALE** — Bikemap's rider base grew from 5.1M to 8.6M between mid-2021 and late 2023, while I was making product calls to improve premium conversion and engagement with features like the Bike Computer
3. **B2B PLATFORM** — decoupled two frustrated user groups: one linear invoice workflow became parallel, independent tasks; the rigid two-column wizard became a flexible three-column workspace
4. **SYSTEMS ×2** — token-based design systems at digital office 24, Bikemap, multi-brand systems for KION and Cheil — machine-readable tokens meant prototyping with real production components, closing the design–dev gap
5. **SOLO BUILDER, AGENT TEAMS** — set up and directed the agents behind a live pingpong table map, an AI cycling coach, and a platformer by order of my six-year-old

The 5.1M→8.6M figures are publicly sourced (siliconcanals.com June 2021; thespokesmen.com Sept 2023). Do NOT "update" them to the current 11.8M figure.

## Rendering rules

- Bold yellow labels (`text-teletext-yellow font-bold`, matching h2/h3 convention), white detail text (`text-teletext-white`). Existing tokens only — no new colors (N7), no new fonts.
- Plain semantic markup (list or definition-style), consistent with sibling sections (`<section class="my-[2ch]">`).
- Mobile-legible at 360px: labels and details wrap cleanly inside the 80ch container, no horizontal scroll.
- No z-index/position games — sticky header/footer untouched.

## TDD protocol — no test framework may be invented (static site, no unit-test infra)

RED — capture first:

```bash
npm run build
grep -c "CONSUMER SCALE" dist/index.html   # expect: 0
grep -c "SOLO BUILDER" dist/index.html     # expect: 0
```

GREEN:

1. All five labels present in `dist/index.html`, each diff-checked byte-for-byte against this file (watch `×` in SYSTEMS ×2 and the en-dash in design–dev gap).
2. Strip sits between hero separator and About `<h2>` in DOM order.
3. Designer-agent review PASS: 8-color compliance, Bedstead, teletext voice, no DoubleHeight misuse.
4. Visual check at 360px: legible, clean wraps, no horizontal overflow.
5. Sticky header/footer still behave (scroll test).
6. `npm run check` && `npm run build` green.

## Acceptance criteria

- [x] RED evidence captured before implementing. (CONSUMER SCALE=0, SOLO BUILDER=0)
- [x] Five locked lines verbatim; bold-yellow labels / white details. (byte-exact cmp ×5; ×/em-dash/en-dash verified as UTF-8)
- [x] Above About, below hero; responsive at 360px; stickiness intact. (DOM offsets: hero 4186 → strip 5136 → About h2 7051; Playwright at 360px: scrollWidth==clientWidth, header top:0 after scroll, Fastext nav pinned to bottom)
- [x] No React island; no new colors/fonts. (plain `<ul>` markup; computed colors rgb(255,255,0)/rgb(255,255,255))

## Boundaries

**In:** one new `<section>` in `index.astro`.
**Out:** any testimonial UI for DO24 or others (N1 — build nothing visibly incomplete) · About/How-I-Work/testimonial sections · `curatedSlugs` (04's job — keep diffs single-purpose) · motion/scanline changes (N9).

## Scheduling

Second consumer of `index.astro`. Merge after 02, before 04 starts.
