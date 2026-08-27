# 0004 — Ninth Color: Grey (#A0A0A0) for De-emphasized Text

- Status: Accepted
- Date: 2026-08-27
- Deciders: Jorne Siebrands (site owner, design system owner)
- Related: `docs/PRD-p204-design-system-revamp.md` §4.2; Linear JOR-66 ("21 — Design System Consolidation (P204 revamp) + ADR 0004"); `DESIGNSYSTEM.md`

## Context

`DESIGNSYSTEM.md` has stated, since this Ceefax simulator's earliest documentation, "Colors — 8 only, no exceptions." That number isn't arbitrary: Level 1 teletext (the CEEFAX/ORACLE broadcast standard this site simulates) encoded color as 3-bit RGB — 8 possible values, full-on or full-off per channel, no intermediate levels. There has never been a grey on a real teletext screen. "8 colors, no exceptions" was this project's proxy for "if it wasn't possible on 1980s broadcast hardware, it doesn't belong here."

Yellow, in the pre-2026-08-27 system, carried three unrelated jobs at once: it was the color of h2 headings, of `strong`/emphasis text, and of the live clock — none of which have anything to do with each other, and none of which are the thing yellow is actually good at, which is grabbing attention for something that just changed. A page with a yellow h2, yellow bold text mid-paragraph, and a yellow clock ticking in the header all at once has no way to make anything stand out, because everything already looks urgent.

Jorne, in the P204 grilling session (2026-08-27): *"Yellow should have a dedicated consistent function... Yellow is too bright for static content."*

Fixing that meant moving h2, strong, and the clock off yellow. h2 and strong could move to colors already in the palette (white, cyan). The clock could move to white. But the consolidation also surfaced a second, older problem: green had been carrying "list markers," "dates," and "captions" alongside its actual job of signaling success. Every one of those needed a home too, and every remaining color already had a clean, single job. There was no 8-color slot left that didn't mean forcing a second job onto a color that had just been freed of exactly that problem.

## Decision

Add a 9th color, grey, `#A0A0A0`, with exactly one role: de-emphasized text — quote attributions, list markers, dates, captions. Nothing else may use it. This breaks "8 colors only, no exceptions" deliberately, not by drift.

Jorne, on authorizing the break in his own rule: *"I am the designer who defined the design system. I am the one who changed it. The design system changes need to be documented. I authorize this."*

The break is written down here, in an ADR, specifically because it is a break — every other rule in `DESIGNSYSTEM.md` can be enforced by the `@designer` agent as a checkable fact (a fixed hex list; grep for anything else). This is the one line in that file where correct enforcement, going forward, is "grey is allowed, and only for this one role" rather than "no exceptions." A future reader — human or agent — needs to find that carve-out explained here, not just asserted in the color table.

## Consequences

**Positive**

- Yellow now has exactly one job (transient/active-state feedback), which is the fix Jorne actually asked for. If something is yellow, something just changed or needs input — full stop.
- Green also now has exactly one job (success states + fastext Projects), instead of simultaneously meaning "this succeeded" and "this text doesn't matter much" (dates/captions/markers).
- Grey directly replaces a pre-existing, undocumented violation of this file's own "no opacity tricks on text" rule: `text-teletext-white/60` and `/80` are already in ad-hoc use in several places as a way to mute text. Grey gives that instinct a real, first-class, on-palette answer instead of an opacity hack.

**Negative / risk**

- The system is no longer physically traceable to real teletext hardware for this one color — everything else on screen could, in principle, exist on a 1982 CEEFAX broadcast; grey could not. That's a real, accepted cost, not a non-issue.
- Grey is the kind of color that's easy to reach for informally once it exists ("just grey it out a bit"). The next request to mute something that isn't a quote attribution, list marker, date, or caption should be **blocked** by `@designer`, not waved through because the hex already exists in `global.css`. Grey having exactly one documented role is the whole point of this decision; scope creep on that role quietly re-breaks the thing it fixed.
- Jorne, flagged but not fully resolved at time of writing: *"I don't fully know the impact of having grey for all dates. Might look weird."* A visual check of `/projects/` (a grid of dates) and a blog post — the highest-repetition uses of the old green-for-dates role — is a precondition for calling this done, not optional follow-up.

## Amendment (2026-08-27, same day)

- Status: Accepted

During JOR-67's implementation, `@designer` was consulted on two spots that aren't literally dates/captions/markers but function the same way: `experience.astro`'s `<dt>` skill label and `contact.astro`'s field label. Both are short, static category labels sitting beside the value they name — the same key/value job as the already-approved frontmatter-readout's `fr-key`/`fr-value` pattern (`DESIGNSYSTEM.md` §Frontmatter readout). That pattern already specified grey for exactly this purpose — but only on paper: the frontmatter readout itself hasn't shipped (JOR-69 is the ticket that will build it), so `fr-key` is a doc-only precedent, not prior art running in production.

**Why this isn't the scope creep the Consequences section above warned against.** That warning targets a specific failure mode: an informal request to mute *something that isn't already a quote attribution, list marker, date, or caption* — a genuinely new category, judged case-by-case, waved through because the hex already exists. A `dt`/`dd` skill label and a contact field label don't clear that bar. A key naming the value beside it is exactly what `fr-key` already was by specification — grey wasn't being reasoned about role-by-role for `dt`, `dd`, and a form label separately; it was extended to a role this ADR's own author had already scoped and approved in writing, just hadn't shipped anywhere yet. Turning an approved-but-unshipped role into its first two shipped instances is a different act from inventing a new role for grey. The bar this ADR still holds: the next request for something that isn't a caption, marker, date, attribution, or key/value label — a status badge, a nav item, anything genuinely new — is the one `@designer` is committed to blocking.

`@designer` ruled these in scope for grey during implementation. This amendment records that ruling and supersedes the Decision's role list going forward — the original Decision text above is left as written, per standard append-only ADR practice, not rewritten in place:

**Grey's role, as amended**: de-emphasized text — quote attributions, list markers, dates, captions, **and key/value field labels** (a label naming the value beside it: `dt`/`dd` pairs, form-style field labels, the frontmatter-readout's `fr-key`). Nothing else may use it.

This was a verbal ruling made during implementation; the amendment exists so the carve-out is findable in this ADR instead of only asserted in a Linear ticket's implementation notes, per this document's own requirement (see Decision, above: "needs to be explained here, not just asserted").

## Alternatives considered

1. **Move dates/captions/markers to blue instead of a new color.** Blue's documented role is "sparingly, decorative only" — reassigning it to a high-repetition role (every date, every caption, every list bullet) is the exact overloading problem this ADR exists to fix, just relocated. Rejected.
2. **Move dates/captions/markers to white at reduced opacity**, formalizing the `/60`/`/80` pattern already informally in use, instead of adding a 9th color. Rejected: this file already prohibits opacity tricks on text, for a concrete reason — opacity is illegible under some contrast/override modes in a way a flat hex isn't, and corresponds to nothing a real teletext decoder could produce (no alpha channel on broadcast hardware). Giving de-emphasis a real color is more consistent with the rest of this document than special-casing an exception to the opacity rule instead of the color-count rule.
3. **Leave yellow's three jobs as-is and accept the "everything is urgent" problem.** Rejected by Jorne directly — this is the problem the whole revision exists to fix, not a viable alternative.
4. **Do nothing — keep dates/captions/markers on green.** Rejected: green would still be carrying both "success" and "secondary text," the same overloading problem yellow had, just smaller in scale. Consolidating one color and not the other would leave the system half-fixed.
