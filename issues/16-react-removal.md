# 16 — Dead Code Removal + Drop React Entirely

| Field | Value |
|---|---|
| **Type** | AFK |
| **Blocked by** | None as a hard gate (zero file overlap with 07). Sequenced after 07 merges so defect QA runs on the un-refactored tree. |
| **Target Modules** | Delete `src/components/teletext/BlinkingText.tsx` + `src/components/teletext/PageNumber.astro`; remove unused `@utility teletext-scanline` (`src/styles/global.css` ~108–116); `astro.config.mjs` (drop react integration); `package.json` (uninstall `@astrojs/react`, `react`, `react-dom`); `CLAUDE.md` (stack description) |
| **Source** | `docs/PLAN-teletext-system.md` Phase 1 "dead code" + React removal paragraphs |
| **Linear** | [JOR-60](https://linear.app/jornesiebrands/issue/JOR-60) |
| **Status** | ready-for-agent |

## What to build

The repo carries React for exactly one consumer that nothing imports. With `BlinkingText.tsx` deleted, `@astrojs/react`, `react` and `react-dom` have zero consumers: drop the integration from `astro.config.mjs`, uninstall the three packages, and correct the stack description in `CLAUDE.md`. Also delete `PageNumber.astro` (imported by nothing — the header number is hand-rolled) and the unused `@utility teletext-scanline`.

None of the remaining planned work needs React — every nav feature belongs in the existing vanilla inline script. (`this-site.md`'s `techStack` never claimed React, so no case study becomes wrong.)

## Acceptance criteria

- [ ] `BlinkingText.tsx`, `PageNumber.astro` deleted; no dangling imports anywhere
- [ ] `astro.config.mjs` integrations = `[sitemap()]` only; `react()` gone
- [ ] The three React packages removed from `package.json`; lockfile updated
- [ ] CRT scanline overlay still renders (the deleted `@utility` was unused — prove the overlay is a separate mechanism)
- [ ] `CLAUDE.md` stack description corrected (Astro + Tailwind, no React); also fix its mobile-flow wording while there ("dialog with a number input" → 10-button keypad, no `<input>` exists)
- [ ] `npm run check` && `npm run build` green — the build itself proves no hidden consumer

## Boundaries

**In:** deletions, dependency removal, two CLAUDE.md corrections.
**Out:** any behaviour change · drift guard (17) · touching `content.config.ts` · rewriting components that ARE used.

## Global gates

`npm run check` + `npm run build` green · visual spot-check that scanlines/overlay are unaffected · user approves the diff · **user explicitly triggers any push to main.**
