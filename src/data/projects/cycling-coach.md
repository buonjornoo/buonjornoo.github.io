---
title: "Cycling Coach"
description: "Building, iterating on, and learning from my personal AI cycling coach."
subtitle: "An evidence standard for an AI's inputs, written after my own coaching system reasoned confidently from five wrong numbers."
techStack: ["AI Systems", "Product Design", "Claude Code", "Personal Project"]
coverImage: "/img/projects/cyclingCoachCover.png"
slug: "cycling-coach"
order: 5
pageNumber: "207"
---

## Challenge

On 16 July 2026, five documented "facts" in my own AI coaching system collapsed inside a single day:
my functional threshold power, a modelled estimate of it, my threshold heart rate, a two-year power
best, and my body weight. All five were wrong, and all five failed by the same mechanism.

A number gets formed once, out of thin data, and somebody writes it down. From that moment it counts
as true because it is written down, and the derivation behind it goes unchecked. One of the five
carried the note "data-validated, do not fix the platform" beside it. It was seven beats per minute
out.

This is a system I built to plan my own training toward a race. Its outputs are only as good as the
numbers it reasons from, and it had spent months reasoning confidently from five that were wrong.

## The team and my role

Solo, and the system is a Claude Code workspace rather than an app: an always-loaded context file, a
`memory/` directory holding the long-form history, live data synced from a training platform, and
four skills covering the recurring workflows so they do not get improvised differently each session.
I designed all of it and I direct the agents that write the scripts. The design work here is
deciding what the system is allowed to believe.

<figure class="my-[2ch]">
  <img src="/img/cycling-coach/strength-board.png" alt="The published Kraft und Mobility training board" class="w-full" loading="lazy" />
  <figcaption class="text-teletext-green text-teletext-sm mt-[0.5ch]">
    The published Kraft &amp; Mobility board, rendered straight from the memory files. The injury
    constraint sits at the top as a hard rule, not a note.
  </figcaption>
</figure>

## Diagnosing one mechanism, not five bugs

The five failures looked unrelated: a threshold set too low, a model output, an averaging mistake, a
sampling mistake, a typed-in weight. Written down next to each other they share a root. I almost
never ride to my actual limit, so no model has ever seen my limit. Every number derived from my
rides is a *lower bound*, and every one had been recorded as a measurement.

That reframing made a rule possible. Five separate corrections would have produced five corrected
numbers and the same failure again in September.

## The standard

Every decision-relevant number now carries one of two tags at the moment it is written.

`[M: instrument, date]` means **measured**. An instrument produced this number, and the instrument
is named in plain text. `[S: where it came from, and why there is no measurement]` means **stated**:
a human, a model, a derivation, a memory, a hypothesis.

```
Weight 77.5 kg    [M: scale, 16.07.2026]
FTP 225 W         [S: HR-plateau analysis from one ride, no test performed]
Weight 68.0 kg    [S: recollection; last real measurement Nov 2023]
```

Four rules carry the weight.

**The default is reversed.** An untagged number counts as stated, not as fact. A label reading
"verified" or "data-validated" asserts something without deriving it, and so does the sentence "it
says so in the document". Re-do the arithmetic instead.

**A bare stated tag is worthless.** *Why* there is no measurement is the whole point of the tag, and
the only thing that lets a later session decide whether to trust the number.

**Derivations inherit their weakest input.** 244 W measured, divided by 70 kg stated, gives
3.49 W/kg, which is stated. Every power-to-weight figure from before June 2026 is therefore an
estimate, even though the watts behind it are real.

**Retrofit on contact.** Old entries are not rewritten wholesale and dated logs are never edited
retrospectively; a correction is appended. But any number you read and use for a decision gets
tagged as you use it.

> **Key learning: the most confidently labelled number was the most wrong.**
> The worst number in the system was the one carrying "data-validated, do not fix the platform". It
> had been produced by averaging a 20-minute and a 30-minute best from a submaximal ride, which is
> not a valid method, and the confident label was doing the work of stopping anyone from looking. I
> now read the label as the signal: the more emphatically a document asserts a number, the earlier
> it goes in the queue for re-derivation.

> **Key learning: one question does most of the work.**
> *Which instrument produced this number, and when?* If the answer is "an earlier note", it is not a
> fact. That fits in a sentence, which is why it survives contact with a real working session, where
> a taxonomy of evidence grades would not.

## Making it stick

A rule that lives in a document gets followed for a week. This one sits at the top of the
always-loaded context file as a hard constraint, with the vocabulary, the recognition patterns and
all five case studies in a dedicated memory file behind it. It applies to the system's own output,
not only to my inputs.

The recognition patterns turned out to be more useful than the tags. Round numbers sitting in a
measurement field, because scales say 77.8 and people say 78. A mean taken across two quantities
that measure different things. A model with a single input point. A "best" drawn from a handful of
samples rather than from the curve. An explanation that fits too well and was never tested. A value
from a period before the instrument existed.

The pattern that matters most is the athlete's own contradiction. A number that conflicts with how
the ride felt is *evidence*, not a feeling. Three of the five collapses surfaced because I said
"that can't be right", and nothing in the data would have caught them. I was in the ride; the
document was not.

## Outcome

The threshold heart rate moved from 163 to 170 and the training zones with it. The power-to-weight
figures from before June 2026 were reclassified as estimates rather than deleted. The weight history
turned out to contain a gain that had never happened, which was the gap between an estimate and a
measurement, and I had built a physiological explanation on top of it.

I produced two of the five bad numbers myself, and one of them an hour *after* I had named the
pattern. I evaluated three rides that were mentioned to me and called the result a two-year record.
One call to the power-curve endpoint would have shown it was 35 watts low. Naming a failure mode
does not inoculate you against it, which is why the fix had to be a written default rather than an
intention to be careful.

The honest limit of this project is that it has a userbase of one. It could not fail in the market,
because it was never in one. What it can show is the standard itself, which is the same instinct as
the tokenisation in the [teal-ui case](/projects/do24-teal-ui/): both are about making a machine's
inputs trustworthy before asking the machine to be useful.
