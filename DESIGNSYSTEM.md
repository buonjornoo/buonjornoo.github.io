This file documents the design system used on the online portfolio. The design system serves as guidance and rules for everything visual.

Last major revision: 2026-08-27 (P204 design-system consolidation, `docs/PRD-p204-design-system-revamp.md`, approved by Jorne). Any further change to a rule in this file needs the same: explicit sign-off from Jorne, documented as an ADR in `docs/adr/` if it overturns something stated here — see ADR 0004 for the precedent.

## Colors — 9, one documented exception

Real Ceefax/teletext hardware produced exactly 8 colors — 3-bit RGB, full-on or full-off per channel, no intermediate levels, no grey. This system held to "8 colors, no exceptions" until 2026-08-27, when a 9th color (grey) was added by deliberate, approved decision. See `docs/adr/0004-ninth-color-grey.md` for why. Every color below maps to exactly **one** role — no color carries two unrelated jobs. Any future color addition needs its own ADR; this is a standing precedent now, not a one-off.

| Color   | Hex     | Role                                                                                                                       |
| ------- | ------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Black   | #121212 | Background everywhere                                                                                                      |
| Red     | #FF0000 | Errors, fastext Home (100)                                                                                                 |
| Green   | #00FF00 | Success states, fastext Projects (200)                                                                                     |
| Yellow  | #FFFF00 | Transient/active-state feedback only: page-number buffer while navigating, hover states, focus-visible outline, fastext Blog (300) — never used for static content |
| Blue    | #0000FF | Sparingly — decorative only                                                                                                |
| Magenta | #FF00FF | Tags, categories, accents                                                                                                  |
| Cyan    | #00FFFF | Service name, links, subtitles, h3 headings, strong/emphasis text, interview-quote text + border, fastext Contact (400)    |
| White   | #FFFFFF | Body text, borders, static page-number display, h2 headings (double-height), clock                                        |
| Grey    | #A0A0A0 | De-emphasized text: quote attributions, list markers, dates, captions, key/value field labels (e.g. `experience.astro`'s skill `dt`, `contact.astro`'s field label — same job as the frontmatter-readout's `fr-key`) |

Defined as CSS variables in `global.css` (`--color-teletext-black` updates from `#000000` to `#121212`; `--color-teletext-grey: #A0A0A0` is added alongside the other eight — Tailwind v4 exposes both automatically). `--color-teletext-black` is the single source of truth for background black — every component reference goes through it, not a hardcoded hex.

**Exception, by design, not oversight**: the CRT scanline overlay and the remote-control dialog backdrop stay literal `rgba(0, 0, 0, ...)`, not `--color-teletext-black`. They're translucent dimming layers on top of the background, not the background itself — a scanline gap and a modal scrim should read as true black regardless of what the phosphor color underneath is set to.

**No gradients. No box-shadows (except CRT glow). No opacity tricks on text.** The only allowed transparency is the scanline overlay and the `::backdrop` for the mobile dialog. *(As of this revision, five places still violate this via `text-teletext-white/60` or `/80` as an ad-hoc mute — grey is the correct fix wherever that pattern shows up; not retrofitted everywhere yet.)*

h1 page titles move off yellow too, for the same reason as h2: yellow is documented above as "never used for static content," and a page title sitting on screen the whole time is as static as content gets. h1 is now white, double-height — same treatment as h2.

## Typography

- **Font**: Bedstead (WOFF2, regular + bold)
- **Fallback**: "Courier New", "Courier", monospace
- **Anti-aliasing**: OFF (`-webkit-font-smoothing: none`)
- **Sizes**: sm=0.875rem, base=1rem, lg=1.25rem, double=2rem (via `teletext-double-height` utility)
- **Double-height text**: `font-size: 2em; line-height: 1; letter-spacing: 0.05em`. Used for:
  - h1 page titles (via the `DoubleHeight` component) — white (changed from yellow, same reasoning as h2 below)
  - h2 section headings — white (was yellow, 1.25rem, not double-height, before this revision). Applies both to markdown `h2` inside `.prose-teletext` and hand-coded `<h2>` elements outside prose (homepage section headers, `experience.astro` headings)
- h3 headings stay cyan, 1rem, not double-height — unchanged

## Spacing

- Character units (`ch`) for horizontal spacing
- Sections separated by `<Separator>` component (repeated "━" characters)
- Content padding: `2ch` horizontal, `1ch` vertical
- Max content width: `80ch`

## Layout files

- `src/styles/global.css` — theme tokens, base styles, CRT effects, ceefax header/footer CSS
- `src/layouts/BaseLayout.astro` — TV shell (header, footer, scanlines, keyboard script)
- `src/layouts/PageLayout.astro` — content wrapper (80ch centered)
- `src/layouts/ProjectLayout.astro` — project pages with prose styles + frontmatter readout (see below)
- `src/layouts/BlogPostLayout.astro` — blog posts with prose styles (no frontmatter readout — project pages only)
- `src/lib/rehype-blockquote-type.ts` — classifies each markdown blockquote as interview-quote or callout (see Blockquote types, below); same pattern as `src/lib/rehype-page-links.ts`, wired the same way in `astro.config.mjs`

## Component files

- `src/components/teletext/DoubleHeight.astro` — double-height text
- `src/components/teletext/Separator.astro` — horizontal line separator
- `src/components/teletext/ColorBar.astro` — colored bar
- `src/components/teletext/BlockGraphic.astro` — decorative block characters

The frontmatter readout (below) is deliberately **not** a component — it's plain body text inline in `ProjectLayout.astro`.

## Ceefax header (site-wide)

Applies to every page.

| Element | Desktop | Mobile |
|---|---|---|
| Masthead "SIEBRANDS" | unchanged — the broadcaster mark, not a personal byline (locked, see below) | visible |
| Identity line "Product Designer · PM" | new — role only, no name repeated | hidden |
| Page-number button (`P204` etc.) | unchanged, white | visible, unchanged |
| Page title (e.g. "Workflow Evolution") | new — orientation; carries the `k/N` reading-progress counter on long-form pages once JOR-57 ships | hidden — replaced by a compact `k/N` fallback where a counter applies |
| Date | new | hidden |
| Clock | unchanged position, now white (was yellow) | visible, unchanged |

**Masthead — locked.** A mockup briefly swapped "SIEBRANDS" for the personal name. Reversed. `CONCEPT.md`: *"siebrands.com is a Ceefax simulator, not a retro-styled portfolio... the aesthetic is not decoration applied to a normal portfolio — it is the medium itself."* Real teletext mastheads carry the broadcaster's name (CEEFAX, ORACLE), not a byline. "SIEBRANDS" stays; personal identity lives entirely in the identity line beneath it.

Mobile hides, all in one place: identity line, page title, date. Mobile keeps: masthead, page-number button, clock, and — where a page has a section counter — the compact `k/N` fallback.

## Ceefax UI rules

- Sticky header: "SIEBRANDS" (cyan) + identity line (desktop-only) + page title + date (desktop-only) + page number (white) + clock (white — changed from yellow)
- Sticky Fastext footer: Red=Home 100, Green=Projects 200, Yellow=Blog 300, Cyan=Contact 400 — unchanged
- No traditional nav bar, no TV bezel — the screen IS the viewport
- CRT scanline overlay (suppressed with `prefers-reduced-motion`)
- Content max-width: 80ch

## Frontmatter readout (project pages only)

New content block, project pages only (not blog). Renders directly under the h1, styled as plain body text — a literal key:value readout that looks like the page's own frontmatter, not a data-viz component:

```
title: "Workflow Evolution"
subtitle: "digital office 24, 2024–2026. Started as the designer, ended..."
tags: ["Product Management", "UX Design", "Research", "Fintech", "B2B"]
pageNumber: "204"
context: "digital office is a platform for High Networth Individuals..."
```

- `title`, `subtitle`, `tags`, `pageNumber` — always shown, sourced from real frontmatter.
- `context` — optional (new field on the `projects` schema); the line is omitted entirely when not authored, never shown empty.
- Keys must match real schema field names exactly — this is the whole point of the pattern (it has to actually be your frontmatter, not a look-alike).
- **Replaces** the current standalone rendered-subtitle paragraph in `ProjectLayout.astro` — subtitle moves into the readout, it doesn't get a second, separate rendering.

Spec:

```css
.frontmatter-readout {
  font-family: var(--font-teletext);
  font-size: 1rem;
  white-space: pre-wrap;
  margin-top: 1ch;
  margin-bottom: 2ch;
}
.frontmatter-readout .fr-key { color: var(--color-teletext-grey); }
.frontmatter-readout .fr-value { color: var(--color-teletext-white); }
```

Each line renders as `<span class="fr-key">key:</span> <span class="fr-value">"value"</span>` — key in grey, value in white, one per line, quoted/bracketed exactly as shown above. Don't reuse the magenta tag-chip styling here — the point is that it reads as raw frontmatter text, not the rendered `ProjectCard` UI.

## Prose styles (`.prose-teletext`)

- h2 = white, double-height (was yellow, 1.25rem)
- h3 = cyan, unchanged
- strong/emphasis = cyan (changed from yellow)
- links = cyan → yellow on hover (unchanged — hover is a transient state, yellow's job)
- code = green on dark bg (unchanged)
- list markers (`li::marker`) = grey (changed from green)
- figcaption = grey (changed from green)
- dates (blog pub/updated date) = grey (changed from green) — accepted deliberately without a pre-ship visual check ("let's just use grey and see how it turns out"); if it reads poorly at high repetition on `/projects/` or a blog post once live, that's a follow-up fix, not a blocker

### Blockquote types

Two visual treatments, replacing the single yellow-border/cyan-text style:

| Type | Class | Visual | Detection |
|---|---|---|---|
| Interview quote | `.bq-interview` | 2px cyan left border, cyan quote text, grey attribution line | Blockquote's last line starts with an em dash (`—`) |
| Callout (e.g. "Key learning:") | `.bq-callout` | No border, plain white text | Everything else |

```css
.prose-teletext :global(blockquote.bq-interview) {
  border-left: 2px solid var(--color-teletext-cyan);
  padding-left: 2ch;
  color: var(--color-teletext-cyan);
  margin-bottom: 1em;
}
.prose-teletext :global(blockquote.bq-interview > p:last-child) {
  color: var(--color-teletext-grey);
  font-size: 0.875rem;
  margin-top: 0.5em;
}
.prose-teletext :global(blockquote.bq-callout) {
  border: none;
  padding-left: 0;
  color: var(--color-teletext-white);
  margin-bottom: 1em;
}
```

No new markdown authoring syntax — every interview quote already ends `— Attribution`; no callout does. The class is assigned by `src/lib/rehype-blockquote-type.ts`, inspecting each `blockquote` node's last child.

As authored today, every markdown blockquote on the site is a callout — none of the current project files have an em-dash attribution. The only content matching the interview-quote pattern is the three hand-coded testimonial `<figure>` blocks on the homepage (`src/pages/index.astro`), which are plain Astro/HTML and never touch the rehype pipeline — those need a manual restyle to this same spec, tracked separately (not fixed by writing the plugin alone).
