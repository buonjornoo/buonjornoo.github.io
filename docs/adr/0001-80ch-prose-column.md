# 0001 — 80ch Prose Column, With an Opt-In Full-Bleed Escape Hatch

- Status: Accepted
- Date: 2026-08-28
- Deciders: Jorne Siebrands (site owner, design system owner)
- Related: `DESIGNSYSTEM.md` §Spacing/§Ceefax UI rules; Linear JOR-59 ("15 — Opt-in Full-Bleed Figures + ADR 0001"); `CONTEXT.md` (content measure)

## Context

Real Level 1 teletext ran a 40-character line. This site's prose column is `80ch` — already double the true broadcast measure, chosen when the layout was widened from an earlier `60ch` attempt "for the Ceefax feel," per the project's own key-decisions history. That earlier widening was never written down as a deliberate trade-off; it just happened. This ADR is the first time the choice gets argued in writing, and it happens now because issue 15 is the first feature that needs to punch a hole in the column rather than simply live inside it.

`CONTEXT.md` states the column's job plainly: "the prose and media a page delivers... must get out of the way (prime rule)." A fixed 80ch measure serves that job well for body text — the whole reason typographic measures exist is that a line much wider than ~80 characters is harder to track eye-to-line-start on the re-wrap, which fights the same "get out of the way" goal a Ceefax simulator is built around. But ~31 hand-written `<figure>` blocks across the case-study markdown are capped at that same 80ch box today, and a handful of them are genuine full application screenshots — UI dense enough that shrinking it to fit inside 80 characters' worth of pixels loses legibility the caption can't recover. Those figures are the one kind of content this site currently has that a fixed text measure actively fights, not serves.

## Decision

Keep `80ch` as the site-wide prose measure — not the true `40ch` teletext line, and not restored to `60ch`. 80ch remains the trade-off already implicit in the project's history, now written down instead of assumed: real teletext's 40ch is authentic but unreadable at modern viewing distances and font sizes for anything but the shortest lines; 80ch keeps the simulator's monospace, character-grid identity while staying inside the range typography treats as a readable line length.

Add one, opt-in escape hatch: a `full-bleed` class, applicable to any `<figure>` inside `.prose-teletext`, that breaks that one figure out to the full viewport width via `width: 100vw; margin-inline: calc(50% - 50vw)`. Everything else — every paragraph, list, blockquote, and the ~27 remaining figures — stays inside 80ch untouched. The class is applied by hand, figure by figure, in the source markdown; nothing is full-bleed by default or by figure type.

This is deliberately the one feature allowed to punch holes in the column. The column's whole purpose is "content gets out of the way, at a readable measure" — a full-bleed figure is claiming a specific figure needs to be the thing the reader looks at, wider than the column would allow, which is a genuine exception to the rule rather than a violation of it. Scoping it to hand-picked figures, not a figure type or a project, keeps that exception rare and deliberate instead of becoming a second default layout.

## Consequences

**Positive**

- The trade-off behind 80ch (not 40ch, not 60ch) is now argued and findable, instead of living only in an unlinked history note.
- The four figures on the Workflow Evolution page that are genuine full-screen UI captures (`legacy-workflow.png`, `speedflow-modal.png`, `open-tasks-per-document.png`, `pipeline-shipped.png`) render at a size where the interface is actually legible, without changing the column any other content sits in.
- The mechanism is one small, reusable CSS rule (`figure.full-bleed`) rather than a bespoke override per figure — new full-bleed figures in future case studies are a one-class addition, not a new pattern.

**Negative / risk**

- Full-bleed is a judgment call made by hand per figure, with no automated check on which figures "genuinely depict full screens." A future author could over-apply it out of habit rather than need, eroding the column's authority the way an unscoped exception would. The count is deliberately small (3-4, checked in `tests/integration/full-bleed-figures.test.ts`) precisely so drift toward "most figures are full-bleed now" is visible rather than silent.
- `width: 100vw` measures the viewport including any vertical scrollbar in some browsers, which can force a few pixels of horizontal overflow on pages with a full-bleed figure. Verified in the browser at common breakpoints before shipping; if it resurfaces on a browser/OS combination not tested here, the fix is a `overflow-x: hidden` on `html`, not reverting the mechanism.
- The AR City Exploration study's cover/hero GIFs are explicitly excluded here — their problem is file weight, not column width (issue 18) — so this ADR does not resolve every "this figure feels cramped" complaint on the site, only the ones a wider measure actually fixes.

## Alternatives considered

1. **Restore the 60ch column instead of 80ch.** Rejected — 60ch was already tried and widened away from "for the Ceefax feel," per the project's existing history; reverting loses ground on a decision already made, without addressing the actual problem (specific screenshots needing more width than any fixed text column will comfortably give them).
2. **Drop to the historically-authentic 40ch.** Rejected — true to the hardware, unreadable in practice at normal body-text sizes on a modern screen; the project's own history already moved away from this once.
3. **Make all figures full-bleed by default, scope down with an opt-out class instead of opt-in.** Rejected — inverts the exception. Most figures are illustrative screenshots and diagrams that read fine at 80ch; defaulting to full-bleed would make the column the exception on every case-study page instead of the rule, which is the opposite of what "content gets out of the way, at a readable measure" is asking for.
4. **A per-project or per-figure-type rule (e.g., "all screenshots in Workflow Evolution are full-bleed").** Rejected — ties the decision to metadata (which project, what kind of image) instead of the actual question, which is "does this specific figure need the width." A figure-by-figure class keeps the judgment call explicit and auditable per figure, not inherited from a category.
