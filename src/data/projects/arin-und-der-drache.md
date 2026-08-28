---
title: "Arin und der Drache"
description: "Letting my six-year-old be the CEO of an agent team that builds his dream game."
subtitle: "The rule that made it work: the agent that diagnoses must not be the agent that repairs."
tags:
  [
    "AI Agents",
    "Product Management",
    "Design Systems",
    "Prototyping",
    "Personal Project",
  ]
coverImage: "/img/projects/arinCover.png"
slug: "arin-und-der-drache"
order: 10
pageNumber: "209"
---

<p>
  <a href="/game/arin-und-der-drache/" target="_blank" rel="noopener noreferrer">Play Arin und der Drache</a>
  — opens in a new tab, keyboard controls, desktop only.
</p>

## Challenge

Spending a rainy day inside with my six yearold son. He told me he wanted to play a computer game. He never played, he just heard from friends that this is a thing. I asked him what kind of game and he described something that sounded like a platformer. I thought: “What if we could quickly build this?”

There were no hard constraints to this except my token limits. Of course it should be something a six yearold can understand, use, and have fun with. I wanted him to understand what is happening and see that his opinions change the outcome. I chose to set up three simple agents, I set up a quick interview with my son and we were able to start playing in the afternoon of March 6 2026.

<figure class="my-[2ch]">
  <img src="/img/arin-und-der-drache/start-screen.png" alt="The Arin und der Drache start screen, showing the two playable characters and the keyboard controls" width="1280" height="800" class="w-full" loading="lazy" />
  <figcaption class="text-teletext-grey text-teletext-sm mt-[0.5ch]">
    The start screen. Two playable characters, controls in German, and a title my son spelled
    himself. The character cards and the goal line were his calls, not mine.
  </figcaption>
</figure>

<div class="w-full overflow-hidden text-teletext-white font-teletext select-none" role="separator" aria-hidden="true">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>

## The team and my role

Three agents, and the two of us as the CEOs.

**The Product Manager** takes a feature idea from the CEOs, asks questions when it is unclear, and
writes a spec with a user story, acceptance criteria, technical requirements and an explicit
must-have / nice-to-have split. Its most crucial instruction: keep the specs simple enough for a six-year-old.

**The Developer** implements against a spec or a bug report. It reads the relevant files first,
makes the change, comments in German so the code stays legible to us, and changes nothing beyond
what was asked.

**QA** runs in two modes. In analysis mode it takes a bug, usually a screenshot from whichever CEO
found it, reads the code, locates the cause with line numbers and writes a report with a root cause
and a proposed fix. In verification mode it reads what the developer changed, checks it against the
requirement, and hunts for edge cases.

I designed the three roles and ran the loop. My co-CEO had the ideas, tested the output, and decided
when something was good.

<div class="w-full overflow-hidden text-teletext-white font-teletext select-none" role="separator" aria-hidden="true">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>

## The rule that makes the team a team

> **Key learning: the agent that diagnoses must not be the agent that repairs.**
> I found it worked much better when agents only have the rights they need. QA was read-only on the code.
> It was forced to write the diagnosis down as a report, with line numbers, a root cause and a proposed approach,
> before any code moves. A human who is not reading the diff can review that report.

<div class="w-full overflow-hidden text-teletext-white font-teletext select-none" role="separator" aria-hidden="true">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>

## Two loops, deliberately different

A new feature runs CEO idea, PM spec, developer, QA, CEO approval. A bug runs CEO report, QA
analysis, developer fix, QA verification, CEO confirms. The bug loop puts QA _first_, before any
code is touched, which is the same separation rule applied at the level of the process rather than
the role.

<div class="w-full overflow-hidden text-teletext-white font-teletext select-none" role="separator" aria-hidden="true">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>

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

<div class="w-full overflow-hidden text-teletext-white font-teletext select-none" role="separator" aria-hidden="true">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>

## Templates to communicate with a six-year-old

Bug reports and feature requests have templates: description, reproduction steps, expected versus
actual, screenshot, priority. That sounds like process theatre for a project this size. In practice
it is what let a child participate. "What did you expect to happen, and what happened instead" is a
question a six-year-old can answer.

<div class="w-full overflow-hidden text-teletext-white font-teletext select-none" role="separator" aria-hidden="true">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>

## What I left out

There is no CEO agent, no CPO agent and no CTO agent, and the omission is as informative as what I
built. Strategic roles work through judgement, taste and accountability, and an agent role-playing
one of them adds an org chart without adding any of the three. The two humans hold those roles here.
The agents do the work that has a definition of done.

The role prompts are also short. Each is a paragraph of purpose, a numbered list of what to do, and
a line about what not to do. The instruction that did the most work in the whole setup is four words
long: _do not fix it._

<div class="w-full overflow-hidden text-teletext-white font-teletext select-none" role="separator" aria-hidden="true">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>

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

<div class="w-full overflow-hidden text-teletext-white font-teletext select-none" role="separator" aria-hidden="true">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>

## Five months later

The game from March worked. Run, jump, land on an enemy to beat it, collect stars, reach the flag:
all of it functioned. It also looked like debug output. Every character, tile and hazard was one
flat rectangle on a dead navy background. One afternoon had room for logic. It had none left for how
any of it looked.

Five months on I came back to it and set a new brief: four Studio Ghibli reference images, a meadow
under snow peaks, a turquoise tulip field, a gouache house under blossom trees at dusk, a lantern-lit
bathhouse alley. No two of them share a time of day. Turn what they have in common into rules
precise enough that a later session, possibly with no memory of the pictures, could extend the game
and still land in the same world.

<div class="grid grid-cols-1 md:grid-cols-2 gap-[2ch]">
  <figure class="my-[2ch]">
    <img src="/img/arin-und-der-drache/start-screen.png" alt="The character-select screen in March, both characters drawn as flat coloured rectangles on a navy background" width="1280" height="800" class="w-full" loading="lazy" />
    <figcaption class="text-teletext-grey text-teletext-sm mt-[0.5ch]">
      Before. March: the character-select screen the game opened with, one flat rectangle per
      character.
    </figcaption>
  </figure>
  <figure class="my-[2ch]">
    <img src="/img/arin-und-der-drache/auswahl.png" alt="The same character-select screen repainted with mountains, parchment-style panels and a new title treatment" width="1200" height="683" class="w-full" loading="lazy" />
    <figcaption class="text-teletext-grey text-teletext-sm mt-[0.5ch]">
      After. The mountains, the parchment panels and the title are new. The choice between Arin,
      faster, and the dragon, which jumps higher, is not.
    </figcaption>
  </figure>
</div>

<div class="w-full overflow-hidden text-teletext-white font-teletext select-none" role="separator" aria-hidden="true">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>

## A styleguide instead of a memory

Five rules don't answer what colour grass is. A styleguide does, but only if a later phase can read
it instead of trusting a description of pictures it never saw. Two files went in before any game
code changed. `STYLEGUIDE.md` holds the five rules, a named colour palette in place of raw hex
values, and a checklist a phase can run against its own work before calling something finished.
`style.js` turns the palette and sixteen shared drawing functions into code, so every phase after the
first draws mountains, glow and idle breathing the same way instead of reinventing them.

> **Key learning: the point of writing a styleguide to disk isn't outliving the calendar.**
> It's outliving the next context window. Each phase starts with no memory of the last one. The file
> is what carries the direction forward, not the model.

<div class="w-full overflow-hidden text-teletext-white font-teletext select-none" role="separator" aria-hidden="true">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>

## The level only a six-year-old could approve

The build ran in five phases inside one continuous session: a straight recolour first, then a
parallax sky with drifting cloud layers, then the level itself. A dense maze got rebuilt into an
open, rolling landscape with jump gaps sized against the game's actual jump-height and speed
constants instead of eyeballed. That third phase is the one change nothing in the session could
fully check on its own. A level either feels fun to a six-year-old or it doesn't. We played the new
layout together before the next phase touched anything else.

The last two phases redrew both characters with rounded shapes, idle breathing and a directional
glance, then rebuilt every remaining screen, start, victory, defeat, on the same sky-and-parallax
system as the game itself.

<figure class="my-[2ch]">
  <img src="/img/arin-und-der-drache/gameplay.png" alt="Mid-level gameplay with painted mountains, terrain and a glowing-eyed enemy" width="1200" height="683" class="w-full" loading="lazy" />
  <figcaption class="text-teletext-grey text-teletext-sm mt-[0.5ch]">
    Mid-level. The enemy's eyes are the only new detail with a bug hiding inside them.
  </figcaption>
</figure>

<div class="w-full overflow-hidden text-teletext-white font-teletext select-none" role="separator" aria-hidden="true">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>

## The bug that needed a player, not a script

Two phases after the visual work wrapped, actually playing it turned up two things that looked
unrelated. The whole world jittered slightly, and landing on an enemy to beat it felt like a coin
flip instead of a skill.

They shared one cause. The character phase had wired a breathing, squash-and-stretch animation
straight onto the player's scale, including a constant idle pulse while just standing still. The
game engine computes its actual collision shape from an object's full transform: position, angle
and scale together. The player's hitbox had been quietly resizing every frame, even at rest, and
finding that meant reading the engine's own source rather than guessing from the symptoms.

> **Key learning: two symptoms that look unrelated are worth checking against one shared cause
> before you go fix two separate things.**

The fix split the player into an invisible hitbox that stays permanently unscaled for physics, and a
separate drawing pass that applies the squash and stretch to pixels only. A camera-smoothing pass
went in as a second line of defence. Verified against the engine's own per-frame update loop, not by
eye: zero pixels of frame-to-frame drift across ninety frames at rest, down from a jump of almost
two pixels before the fix. Five repeated top-hits on an enemy, five clean kills. Five repeated
side-hits, five clean hits taken.

<figure class="my-[2ch]">
  <img src="/img/arin-und-der-drache/gewonnen.png" alt="The victory screen with falling petals over a painted background" width="1200" height="683" class="w-full" loading="lazy" />
  <figcaption class="text-teletext-grey text-teletext-sm mt-[0.5ch]">
    The victory screen. Petals now, coloured rectangles before.
  </figcaption>
</figure>

<div class="w-full overflow-hidden text-teletext-white font-teletext select-none" role="separator" aria-hidden="true">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>

## What ran differently this time

March ran on three role-played agents with a diagnose/repair split built into the roles on purpose:
QA finds the cause, the developer fixes it, never the same one doing both. This pass ran on one
continuous session instead, with a different rule doing roughly the same job: plan on one model,
build on another. One model read all four reference images and the existing code, checked the game
engine's API against its real source rather than trusting memory, and wrote the styleguide and the
five-phase plan for approval before a line of game code changed. The other built all five phases,
then investigated the bug two phases later by reading the engine's minified source directly instead
of patching around the symptom.

My part stayed the same shape as March, one level down. I chose the four reference images and called
what they had in common the direction. I approved the plan before any code moved. I played the new
level layout with my son before the next phase started, and I'm the one who played the finished
build and reported a jitter and an unfair-feeling fight in the same message. Those turned out to be
one bug, not two. No line of the visual system or the fix is mine. Which four pictures said this and
not that, and which of two symptoms were worth chasing as one cause: both of those were.

<div class="w-full overflow-hidden text-teletext-white font-teletext select-none" role="separator" aria-hidden="true">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>

## Outcome, five months on

The game runs, looks like somewhere rather than nowhere, and the bug that made combat feel random is
gone, checked against ninety frames of measurement rather than a few rounds of "seems fine now." The
honest scope: this pass wasn't the three-agent structure the March write-up describes, and it wasn't
"weeks apart" either. Styleguide to fix ran inside a single sitting. What carried over from March
wasn't the org chart. It was the habit underneath it: put the thing that has to survive between
sessions into a file, and check it against the source before you believe it.
