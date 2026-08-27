# 0003 — Chrome May Be Maximalist; Content Must Get Out of the Way

- Status: Accepted
- Date: 2026-08-27
- Deciders: Jorne Siebrands (site owner, design system owner)
- Related: Linear JOR-57 ("13 — Section Counter + ADR 0003"); `docs/PRD-p204-design-system-revamp.md`; `DESIGNSYSTEM.md`

## Context

This site's header and footer are already busy by design — masthead, live clock, page-number buffer, remote control, Fastext colour bar, and (as of JOR-55) a sequential-paging neighbour affordance. None of that busyness is accidental: `CONTEXT.md` defines "Chrome" as "everything that frames the simulator ... maximalist by design," in deliberate contrast to the 80ch prose column, which stays plain body text throughout every case study.

Issue 13 adds one more piece of chrome: a reading-progress counter (`k/N`) for long-form pages, driven by the page's own `##` section headings. The original spec (`issues/13-section-counter.md`) planned to put this in the clock's slot, temporarily replacing the time with a page-position readout. A later grilling session (2026-08-27, the same one that produced the P204 design-system revamp) revisited that plan and rejected it — this ADR records the resulting rule, not just this one ticket's outcome.

## Decision

The counter lives in a new **page-title slot** in the header (`"Workflow Evolution 5/7"`), never in the clock's slot. The clock is never touched by this feature, on any page, under any condition — not repurposed, not temporarily hidden, not dual-purposed. This is the general rule going forward: **chrome elements each keep exactly one job**, the same discipline ADR 0004 applied to colour. The clock's job is telling the time; a reading-progress indicator is a different job and gets its own slot, full stop, even though both are "just chrome" and even though slotting the counter into the clock would have been the cheaper implementation.

The counter itself only appears on pages long enough to need it — pages rendered through `ProjectLayout` or `BlogPostLayout` — and long-form detection comes from **which layout rendered the page**, not from counting headings as a heuristic. A page either is a case study/post (and gets the slot) or isn't (and the header looks exactly as it does today). This mirrors the same principle at the content boundary: the prime rule beneath both decisions in this ADR is that **chrome may be maximalist; content must get out of the way**. The counter is real information (where am I in this page), so it earns its own dedicated chrome slot instead of borrowing someone else's; the case-study prose itself pays nothing for this feature — no added markup, no visual change, no behavioural dependency on it existing.

## Consequences

**Positive**

- The clock stays trustworthy on every page, unconditionally — a user never has to ask "wait, is that the time or something else?" A slot that sometimes means one thing and sometimes another is the exact failure mode this ADR exists to prevent.
- "Long-form = which layout rendered this page" is a fact checkable at build time from a single, stable signal (which Astro layout component is in use), not a fuzzy heuristic (e.g. "2 or more headings") that could flip a page's chrome behaviour as an unrelated content edit crosses some threshold.
- The counter's colour follows `DESIGNSYSTEM.md`'s already-consolidated header-chrome palette (white, matching the page-number display, h1/h2, and the post-JOR-67 clock) rather than the old yellow clock-slot convention this ticket supersedes — new chrome shouldn't reach for a colour rule from a rejected design.

**Negative / risk**

- This ticket lands before JOR-67 (the header restructure that adds the identity line and date around this same page-title slot). The page-title element built here is deliberately minimal — title text plus counter, nothing else — so JOR-67 can add its two siblings around it without needing to rebuild what already exists. Until JOR-67 ships, the page-title slot only appears on long-form pages; on every other page the header looks exactly as it did before this ticket, which is a narrower rollout than `DESIGNSYSTEM.md`'s header table ultimately describes ("applies to every page"). That gap is JOR-67's to close, not a defect in this ticket.
- No aria-hidden and no aria-live on the counter (see below) means a screen reader that happens to traverse the header will read a number that's only accurate at the moment it's read, not continuously updated like a live region. Accepted: the alternative (aria-live) would announce on every heading crossed while scrolling, which is disruptive spam for a purely decorative wayfinding aid, and real heading navigation (screen readers' own "jump to next heading" affordance) is unaffected either way — this counter never replaces or intercepts that.

## Screen-reader treatment (decided, per this ticket's AC)

Plain readable text: no `aria-hidden`, no `aria-live`. This mirrors the clock's own existing treatment (also plain text, also not wrapped in a live region) rather than either extreme:

- **Not `aria-hidden`** — the reading-progress information is real and available to a screen-reader user who navigates into the header, same as it's visually available to a sighted user glancing at the chrome. Hiding it would be withholding real information for no reason.
- **Not `aria-live`** — announcing on every single heading crossed during a scroll would fire continuously and disruptively, the well-known anti-pattern for scroll-driven live regions. The counter updates silently in the accessibility tree; a screen reader only encounters the current value if it explicitly revisits that part of the DOM, which is the same on-demand model sighted users get by glancing at the header rather than being interrupted by it.

The mobile compact fallback (`k/N` alone, full title dropped) is implemented via CSS `display: none` rather than `visibility: hidden`, so the hidden copy is also excluded from the accessibility tree automatically — no duplicate announcement between the full and compact copies at any viewport width.

## Reduced-motion

No animation exists in this feature — the counter is a plain text update on each `IntersectionObserver` callback, no transition, no easing. It is therefore reduced-motion-safe by construction; no `prefers-reduced-motion` branch was needed (contrast the CRT scanline overlay and the digit-roll animation, both of which do need one).

## CLAUDE.md amendment — not needed

The original spec (`issues/13-section-counter.md`) flagged a required CLAUDE.md amendment because it planned to put the counter in the clock's slot, which CLAUDE.md documented as a locked Ceefax element. That plan was superseded before this ticket was implemented (see Context above): the counter never touches the clock, so the clock-lock rule was never actually broken and there is nothing to amend. This is noted here, rather than silently dropped, so a future reader doesn't wonder why the boundary mentions a CLAUDE.md line that was never touched.

## Alternatives considered

1. **Counter in the clock's slot, as originally specified.** Rejected in the grilling session that produced this ADR — see Decision above. The clock keeping exactly one job, unconditionally, was judged more valuable than the simpler implementation.
2. **Heading-count heuristic for long-form detection** (e.g. "2 or more `##` headings"). Rejected: ties the header's behaviour to content, in an area where the prime rule says content should never have to think about chrome. A copy edit that trims a page from 2 headings to 1 would silently change what the header looks like — a layout-based rule can't do that.
3. **aria-live announcement of the counter.** Rejected — continuous scroll-triggered announcements are a known accessibility anti-pattern; see Screen-reader treatment above.
