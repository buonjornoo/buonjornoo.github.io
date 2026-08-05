---
title: "This Site"
description: "A Ceefax simulator built by a seven-agent team with written authority. The page you are reading is the artefact."
subtitle: "Eight colours, one font, three-digit page numbers, and seven agents that can each say no."
techStack: ["AI Agents", "Design Systems", "Astro", "Constraint Design"]
coverImage: "/img/projects/thisSiteCover.png"
url: "https://github.com/buonjornoo/buonjornoo.github.io"
slug: "this-site"
order: 6
pageNumber: "208"
---

## Challenge

Every other case study here is a report about work you cannot inspect. This one is different: the
artefact is the page you are looking at, and the process that produced it is checked into the repo
next to it.

I wanted a personal site that was distinctive without being decorated, and I wanted to find out
whether a team of agents with real authority produces better work than a single agent taking
instructions. Both questions have the same answer, and it is about constraint.

## Constraint as the design

The site is a BBC Ceefax simulator. Not teletext-inspired: the reference is the real thing, and the
rules are enforced rather than evoked.

**Eight colours.** Black, red, green, yellow, blue, magenta, cyan, white, defined as CSS variables
and nothing else permitted. One of them, blue on black, sits at roughly 2.4:1 and fails WCAG AA, so
it is defined and never used for text. That is a decision, not an oversight, and it is the kind of
thing an eight-colour palette forces you to make explicit.

**One font.** Bedstead, a teletext typeface, preloaded, with font smoothing deliberately switched
off so the pixels stay square.

**A 40-column grid and an 80-character content width.** Which is why the prose on this site is
shorter than the prose in my Notion portfolio. The layout punishes padding, and that is useful.

**Three-digit page numbers.** Every page carries one. Type 100 anywhere on the site and you land on
the home page; 200 is projects, 300 is the blog, 400 is contact, and each case study has its own
number in the header. A fastext footer carries the four coloured shortcuts. On mobile, tapping the
page number opens the same input.

None of these were chosen to be difficult. They were chosen because a set of hard limits removes the
decisions that do not matter, and what is left is the ones that do.

## Seven agents, and the authority each one holds

The team lives in `.claude/agents/` as seven Markdown files. Each declares its purpose, the tools it
may use, the model it runs on, and a cap on how many turns it gets.

- **pm** represents me. Nothing ships without its sign-off; it says APPROVED or BLOCKED, and when it
  cannot work out what I would want, its instructions tell it to stop and ask rather than guess.
- **designer** guards the Ceefax system and blocks anything off-palette, off-grid or off-font.
- **qa** tests the build, the accessibility and the rendering, and blocks deploys.
- **frontend** is the primary code writer, **backend** owns the build and the deploy, and
  **content** writes every word on the site.
- **ops** maintains the other six. Its whole job is auditing them for staleness after any structural
  change, because an agent working from a stale file description is worse than no agent.

> **Key learning: the three agents that can veto are the three with no ability to write.**
> pm, designer and qa have read, search and shell access, and no Write or Edit tool at all. That is
> the same rule I set for the QA agent on my son's game: the thing that finds the problem must not
> be the thing that fixes it. An agent that can patch what it just criticised will do both in one
> pass and hand back a change nobody can review. Taking the write tools away makes the finding leave
> the agent as a written report, which is the only form a human can check. The permission
> list is the governance; the prose in the role description is just a reminder of it.

## What I did and did not do

I designed the constraint system, wrote the role definitions and the authority each role holds, and
made the calls the agents escalate. **I did not write the code.** I direct the agents that write it,
which is a smaller claim than it sounds until you notice that every architectural decision still has
to be made by somebody, and the agents escalate rather than decide.

The instructions themselves are short. Each agent gets a paragraph of purpose, a list of what to do,
and a line about what it must not do. The longest file is ops, because it holds the map of
everything the others need to stay accurate about.

> **Key learning: the constraint document has to be readable by the agent that enforces it.**
> The designer agent can block a change because the palette is written down as eight hex values in
> one place, not described as an aesthetic in prose. Every rule I could express as a checkable fact,
> a colour list, a max-width, a font name, gets enforced consistently. Every rule I left as taste
> gets enforced only when I happen to look. That is the same finding as the token architecture in
> the [teal-ui case](/projects/do24-teal-ui/), arrived at from the other direction.

## Outcome

The site is live at siebrands.com, static, built with Astro and deployed from a push to `main`. It
has a fastext footer, a live clock, CRT scanlines that switch off for anyone who asks their system
for reduced motion, and keyboard page navigation that works exactly the way the 1980s original did.

The honest limits are worth naming. This is a personal site, not a product: no users beyond the
people I send it to, no traffic pressure, no revenue at stake. The agent team has never been tested
by anyone except me, so what I can claim is that the separation of powers produced work I trusted
enough to publish, not that it scales to a team of humans who did not write the role definitions.
And the eight-colour palette has a blue in it that I have never been able to use.

The part that travels is smaller and duller than the aesthetic: give the reviewer authority, and
take away its ability to act on what it finds.
