# CLAUDE.md

This file provides guidance to everyone (including Claude Code (claude.ai/code)) when working in this repository.
This repository contains a website hosted on Github Pages and documents for admin, concept and claude code related. The website is an online portfolio of Jorne, a Senior Product Designer. It showcases his craft, thinking, and skills.

## Output style

Always follow the rules in the `i-have-adhd` skill when talking to me (Jorne, Claude Code user).

## Non-Negotiable Constraints & Rules

- Never commit direct API keys or other tokens.
- Don't ask for API keys or other tokens in chat. Find other ways for me to make them accessible to you.
- **Existing copywriting is locked.** Once Jorne has written or approved prose on the site, only typo/grammar fixes are allowed — no rewording, restructuring, or "tone" rewrites, even to match a Paper/Figma mockup's placeholder text. A mockup is never a copy source. Any wording change beyond typos needs Jorne's explicit sign-off first, called out on its own — never bundled into an unrelated "fix"/"sync" commit. (Incident: commit `d6f4679` silently rewrote `do24-workflow-evolution.md`, inventing quote attributions and deleting an honesty disclaimer, under a commit message describing only a technical fix. See `.claude/agents/content.md` rule 1.)

## Routing Table - What to read when

| When                                                                                        | What to read                                                                                                    |
| ------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Working on the concept of this online portfolio                                             | 'CONCEPT.md'                                                                                                    |
| Domain vocabulary                                                                           | 'CONTEXT.md'                                                                                                    |
| Creating user facing assets, code, frontend, visuals                                        | 'DESIGNSYSTEM.md'                                                                                               |
| Backlog / open work / issue status ("what's next", "check issues", "what do we have to do") | Linear project `siebrandsdotcom` — see `docs/agents/issue-tracker.md`. Query it live; don't answer from memory. |

## Commands

```bash
npm run dev        # Start dev server
npm run build      # Production build (output: dist/)
npm run preview    # Serve built site locally
npm run check      # Astro type check + TypeScript validation
npm test           # Vitest (builds site first; unit + integration suites in tests/)
```

## Architecture

**Stack**: Astro 5 (static site) + Tailwind CSS v4 (no config file — theme defined in `src/styles/global.css` via `@theme`)

**Content**: All content lives in `src/data/` as Markdown or JSON, loaded via Astro content collections defined in `src/content.config.ts`:

- `src/data/blog/*.md` — blog posts (schema: title, pubDate, tags, draft)
- `src/data/projects/*.md` — projects (schema: title, slug, pageNumber, tags, order, featured, archive, heroImage/coverImage plus heroImageWidth/heroImageHeight for CLS protection)
- `src/data/pages/*.md` — standalone pages (e.g. about)
- `src/data/contact.json` — contact info
- `src/data/pageRoutes.json` — maps 3-digit numbers to URLs for keyboard nav

**Routing**: Dynamic routes at `src/pages/blog/[...slug].astro` and `src/pages/projects/[...slug].astro`. Project slugs come from front matter `slug` field; blog slugs come from the file's `id`.

**Layout hierarchy**: `BaseLayout.astro` (HTML shell, Ceefax header/footer, keyboard nav JS) → `PageLayout.astro` (max-width container) → `BlogPostLayout.astro` / `ProjectLayout.astro` (prose styles).

**Teletext page number system**: Each page has a `pageNumber` in its front matter (e.g. 100=Home, 200=Projects, 300=Blog, 400=Contact, 201-203=individual projects). `pageRoutes.json` maps numbers to URLs. `BaseLayout` listens for keyboard input — typing a 3-digit number navigates to the corresponding page. On mobile, tapping the page number opens a dialog with a 10-button keypad — there is no `<input>` anywhere on the site; soft-keyboard suppression is structural.

## Deployment

GitHub Actions (`.github/workflows/deploy.yml`) builds on push to `main` and deploys to GitHub Pages at `siebrands.com`. **Never push to main without explicit user approval.**

GA tracking ID: `G-9T9M59GHTP` (in BaseLayout).

## Agent skills

### Issue tracker

Linear — project `siebrandsdotcom`, team Jorne (JOR). Don't mix with the sibling `table-hunter` project on the same team. Local markdown under `issues/` is kept as historical narrative only, not authoritative. See `docs/agents/issue-tracker.md`.

### Triage labels

Default five-role vocabulary (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: `CONTEXT.md` + `docs/adr/` at repo root (created lazily by `/domain-modeling`). See `docs/agents/domain.md`.
