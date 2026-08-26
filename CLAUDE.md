# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server
npm run build      # Production build (output: dist/)
npm run preview    # Serve built site locally
npm run check      # Astro type check + TypeScript validation
npm test           # Vitest (builds site first; unit + integration suites in tests/)
```

## Architecture

**Stack**: Astro 5 (static site) + React 19 (interactive components only) + Tailwind CSS v4 (no config file — theme defined in `src/styles/global.css` via `@theme`)

**Content**: All content lives in `src/data/` as Markdown or JSON, loaded via Astro content collections defined in `src/content.config.ts`:
- `src/data/blog/*.md` — blog posts (schema: title, pubDate, tags, draft)
- `src/data/projects/*.md` — projects (schema: title, slug, pageNumber, techStack, order, featured, archive)
- `src/data/pages/*.md` — standalone pages (e.g. about)
- `src/data/contact.json` — contact info
- `src/data/pageRoutes.json` — maps 3-digit numbers to URLs for keyboard nav

**Routing**: Dynamic routes at `src/pages/blog/[...slug].astro` and `src/pages/projects/[...slug].astro`. Project slugs come from front matter `slug` field; blog slugs come from the file's `id`.

**Layout hierarchy**: `BaseLayout.astro` (HTML shell, Ceefax header/footer, keyboard nav JS) → `PageLayout.astro` (max-width container) → `BlogPostLayout.astro` / `ProjectLayout.astro` (prose styles).

**Teletext page number system**: Each page has a `pageNumber` in its front matter (e.g. 100=Home, 200=Projects, 300=Blog, 400=Contact, 201-203=individual projects). `pageRoutes.json` maps numbers to URLs. `BaseLayout` listens for keyboard input — typing a 3-digit number navigates to the corresponding page. On mobile, tapping the page number opens a dialog.

**React components**: Used only for interactive elements that need client-side state (e.g. `BlinkingText.tsx`). All other components are `.astro`.

## Design System

**8 colors only** — no exceptions. Defined as CSS variables in `global.css`:
`#000` (black), `#F00` (red), `#0F0` (green), `#FF0` (yellow), `#00F` (blue), `#F0F` (magenta), `#0FF` (cyan), `#FFF` (white).

**Font**: Bedstead (WOFF2 in `public/fonts/`), preloaded in BaseLayout, fallback to Courier. Font smoothing is explicitly disabled for pixel-perfect rendering.

**Ceefax UI rules**:
- Sticky header: "SIEBRANDS" (cyan) + page number (white) + clock (yellow)
- Sticky Fastext footer: Red=Home 100, Green=Projects 200, Yellow=Blog 300, Cyan=Contact 400
- No traditional nav bar, no TV bezel — the screen IS the viewport
- CRT scanline overlay (suppressed with `prefers-reduced-motion`)
- Content max-width: 80ch

**Prose styles** (`.prose-teletext`): h2=yellow, h3=cyan, links=cyan→yellow on hover, code=green on dark bg, blockquotes=yellow left border + cyan text. Defined inline in `ProjectLayout.astro` and `BlogPostLayout.astro`.

## Deployment

GitHub Actions (`.github/workflows/deploy.yml`) builds on push to `main` and deploys to GitHub Pages at `siebrands.com`. **Never push to main without explicit user approval.**

GA tracking ID: `G-9T9M59GHTP` (in BaseLayout).

## Agent skills

### Issue tracker

Local markdown under `issues/` (one file per ticket, dependency-numbered). See `docs/agents/issue-tracker.md`.

### Triage labels

Default five-role vocabulary (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: `CONTEXT.md` + `docs/adr/` at repo root (created lazily by `/domain-modeling`). See `docs/agents/domain.md`.
