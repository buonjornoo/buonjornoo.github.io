---
title: "Ari und der Drache"
description: "A three-agent team (PM, developer, QA) building a platformer my six-year-old invented. One afternoon."
subtitle: "The rule that made it work: the agent that diagnoses must not be the agent that repairs."
techStack: ["AI Agents", "Product Management", "Prototyping", "Personal Project"]
coverImage: "/img/projects/ariCover.png"
slug: "ari-und-der-drache"
order: 7
pageNumber: "209"
---

## Challenge

My son is six. He invented a game, a platformer with a character called Ari, a dragon, and enemies
borrowed from the cartoon he was watching that month. He wanted to play it rather than look at a
drawing of it.

The interesting constraint was social rather than technical. He needed to watch the thing get made,
understand roughly what was happening, and have his opinions change the outcome. So the process had
to be visible and slow enough to narrate, and the people doing the work could not be people, because
I had one afternoon.

I set up three agents with defined roles and ran a real development process in front of him. One
afternoon, 6 March 2026, about 500 lines of Kaboom.js.

<figure class="my-[2ch]">
  <img src="/img/ari-und-der-drache/start-screen.png" alt="The Ari und der Drache start screen, showing the two playable characters and the keyboard controls" class="w-full" loading="lazy" />
  <figcaption class="text-teletext-green text-teletext-sm mt-[0.5ch]">
    The start screen. Two playable characters, controls in German, and a title my son spelled
    himself. The character cards and the goal line were his calls, not mine.
  </figcaption>
</figure>

## The team and my role

Three agents, and the two of us as the CEOs.

**The Product Manager** takes a feature idea from the CEOs, asks questions when it is unclear, and
writes a spec with a user story, acceptance criteria, technical requirements and an explicit
must-have / nice-to-have split. Its instructions include one line I am fond of: keep the specs
simple enough for a six-year-old.

**The Developer** implements against a spec or a bug report. It reads the relevant files first,
makes the change, comments in German so the code stays legible to us, and changes nothing beyond
what was asked.

**QA** runs in two modes. In analysis mode it takes a bug, usually a screenshot from whichever CEO
found it, reads the code, locates the cause with line numbers and writes a report with a root cause
and a proposed fix. In verification mode it reads what the developer changed, checks it against the
requirement, and hunts for edge cases.

I designed the three roles and ran the loop. My co-CEO had the ideas, found the bugs, and decided
when something was good.

## The rule that makes the team a team

> **Key learning: the agent that diagnoses must not be the agent that repairs.**
> QA's brief says it explicitly: find the root cause, do not fix it yourself, that is the
> developer's job. This instruction changed the quality of the output more than any other. An agent
> asked to find and fix a bug in one pass will do both at once, badly, and the fix arrives entangled
> with a diagnosis nobody can check. Splitting them forces QA to write the diagnosis down as a
> report, with line numbers, a root cause and a proposed approach, before any code moves. A human
> who is not reading the diff can review that report, and in this case that human included a
> six-year-old asking why the thing broke.

## Two loops, deliberately different

A new feature runs CEO idea, PM spec, developer, QA, CEO approval. A bug runs CEO report, QA
analysis, developer fix, QA verification, CEO confirms. The bug loop puts QA *first*, before any
code is touched, which is the same separation rule applied at the level of the process rather than
the role.

## An escalation ladder as a cost control

Four levels, written down in advance. Level one: fix it yourself, for small and obvious things.
Level two: one agent, for a mid-complexity bug or a single feature. Level three: the whole team, for
large features, complex bugs and architectural changes. Level four: outside the system entirely,
meaning the Kaboom.js documentation or a human who knows.

> **Key learning: deciding the escalation level before starting is what stops the team becoming
> ceremony.**
> The failure mode of a multi-agent setup is running the full loop for a one-line change, at which
> point the process costs more than the work. Naming the levels up front made "this is a level one,
> I'll just do it" an acceptable outcome rather than an admission that the system was overbuilt.

## Templates, because a six-year-old files bugs

Bug reports and feature requests have templates: description, reproduction steps, expected versus
actual, screenshot, priority. That sounds like process theatre for a project this size. In practice
it is what let a child participate. "What did you expect to happen, and what happened instead" is a
question a six-year-old can answer precisely, and that answer is most of a good bug report.

## What I left out

There is no CEO agent, no CPO agent and no CTO agent, and the omission is as informative as what I
built. Strategic roles work through judgement, taste and accountability, and an agent role-playing
one of them adds an org chart without adding any of the three. The two humans hold those roles here.
The agents do the work that has a definition of done.

The role prompts are also short. Each is a paragraph of purpose, a numbered list of what to do, and
a line about what not to do. The instruction that did the most work in the whole setup is four words
long: *do not fix it.*

## Outcome

The game runs and my son played it, which was the whole deliverable.

The honest scope: one afternoon, roughly 500 lines of JavaScript, no version control, and the full
three-agent loop is documented running end to end exactly once. Everything else on the day was level
one and level two work. It is a demonstration of a way of working rather than a codebase, and
inflating it into anything more would cost more credibility than it could buy.

The separation rule is what travels out of it. "The thing that finds the problem must not be the
thing that fixes it" holds well outside agent teams, for the same reason the evidence standard on
the [cycling project](/projects/cycling-coach/) works: a finding that has to survive being written
down for somebody else is a better finding.

The other thing travels smaller and I did not expect it. Explaining a spec to a six-year-old is the
fastest test of whether the spec is any good.
