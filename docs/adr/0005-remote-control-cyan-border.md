# 0005 — Remote Control Border: Yellow → Cyan

- Status: Accepted
- Date: 2026-08-28
- Deciders: Jorne Siebrands (site owner, design system owner)
- Related: Linear JOR-75 ("Homepage/About split + design-system sync (Paper mockup review)"); `DESIGNSYSTEM.md`; `docs/adr/0004-ninth-color-grey.md` (precedent for overturning a stated rule via ADR)

## Context

`DESIGNSYSTEM.md`'s color table states yellow's role as: "Transient/active-state feedback only: page-number buffer while navigating, hover states, focus-visible outline, fastext Blog (300) — never used for static content." That rule was written during the 2026-08-27 P204 consolidation specifically to give yellow exactly one job: something just changed, or needs input.

The Ceefax remote control (`src/components/teletext/RemoteControl.astro`, both the desktop rail and the mobile/mid-width dialog) has always rendered with a 2px yellow border, in `src/styles/global.css`. The remote is not transient — it's permanent chrome, present on every page, at every scroll position, whether or not the visitor is actively navigating. It was never called out as an exception when the yellow rule was written, but it already violated that rule the moment the rule existed: a fixed-position control that's always on screen is exactly the "static content" yellow is documented as never covering.

Surfaced during a Paper mockup review (frames p100, p101, p103) of an unrelated homepage/About split, then confirmed and decided directly with Jorne rather than left as a drive-by fix bundled into that ticket's diff without a paper trail.

## Decision

Change the remote control's border color from yellow to cyan, in both the desktop rail and mobile dialog variants (one shared stylesheet, both change identically — the two variants already matched 1:1 before this change and continue to). Cyan already carries "links, subtitles, h3 headings, interview-quote border" — a fixed, present-at-all-times, all-page chrome element fits that same register (permanent structure, not a state signal) better than yellow's transient-feedback role.

This corrects a previously-stated rule rather than filling a documented gap, so it's recorded here as an ADR, per this repo's own standard (`docs/adr/0004-ninth-color-grey.md` is the precedent: any change that overturns something `DESIGNSYSTEM.md` already states needs sign-off plus a written ADR, not just a diff).

## Consequences

**Positive**

- Yellow's role description in `DESIGNSYSTEM.md` now actually holds for every yellow element on the site — no more silent exception for the one persistently-visible use.
- The remote control's border now groups with the other pieces of the Ceefax chrome (masthead, links, quote borders) that use cyan as "structural, always there," instead of standing out as if it needed attention.

**Negative / risk**

- Cyan's role list keeps growing (service name, links, subtitles, h3, interview-quote border + text, fastext Contact, now remote-control border) — the same kind of accretion `docs/adr/0004-ninth-color-grey.md` fixed for yellow and green. Not fixed here; flagged so a future consolidation pass knows to look at cyan next if it starts feeling overloaded.
- Anyone who visually associates "yellow border = the remote" from the pre-2026-08-28 site will see it repainted. Low risk: the remote's shape, position, and keypad are unchanged — only the border hue moves.

## Alternatives considered

1. **Leave it yellow, add remote-control-while-idle as a named exception to the yellow rule.** Rejected: it would mean yellow's role description says "never used for static content" while a permanent, always-visible element uses it — the exact kind of contradiction `DESIGNSYSTEM.md` is supposed to prevent, and harder to enforce than just moving the color.
2. **Move it to white** (matches the fixed page-number display, borders elsewhere). Rejected: white is the default/neutral border color used everywhere already (`ProjectCard`, non-featured `PostCard`); the remote is a distinct, always-on-screen interactive control and benefits from a color that reads as "structural but distinct," which cyan already provides.
3. **Move it to magenta** (also a border color, on featured cards). Rejected: magenta's role is "tags, categories, accents, featured-state" — a signal for singling something out among peers. The remote isn't competing with other elements for attention; cyan's "chrome/structure" framing fits better.
