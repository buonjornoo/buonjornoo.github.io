---
title: "The Day Five Facts Collapsed"
description: "Five numbers my own training system had treated as true turned out to be wrong inside a single day. They failed the same way, and the fix was a rule about what a system is allowed to believe."
pubDate: 2026-08-06
tags: ["ai", "evidence", "cycling", "systems"]
pageNumber: "302"
---

On 16 July 2026 I sat down to plan a training block and got up several hours later having deleted
most of what my system thought it knew about me.

The system is a Claude Code workspace I built to coach my own riding. It holds a long-form memory of
my training, syncs live data from a platform, and reasons about what I should do next. It had been
running for months and giving me sensible answers.

Five of the numbers it was reasoning from were wrong. My functional threshold power. A modelled
estimate of the same thing. My threshold heart rate. A two-year power best. My body weight.

## How a number becomes true

Here is the shape of it, and it was the same shape every time.

A number gets formed once, out of thin data. Somebody writes it down. From that moment it is true,
because it is written down, and nobody goes back to the derivation.

My threshold heart rate was 163. It had been produced by taking the mean of a best-20-minute effort
and a best-30-minute effort from a ride where I was not trying hard. That is not a valid method for
anything. Averaging two quantities that measure different things gives you a number that measures
neither.

The real figure is about 170. Seven beats per minute is not a rounding error. Every training zone I
had was built on it, which means every session I had done inside those zones was aimed slightly at
the wrong thing.

The line in the document next to 163 read: **data-validated, do not fix the platform.**

<div class="w-full overflow-hidden text-teletext-white font-teletext select-none" role="separator" aria-hidden="true">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>

## The label was doing the damage

That note is the part I keep coming back to. It was not a lie. Somebody, and that somebody was me,
had looked at the number, felt confident, and written the confidence down instead of the derivation.
After that the label did all the work. It told every future reader, human or machine, that this one
had been handled and there was nothing to check.

The most confident label in the system marked the worst number in it. I now treat that as a signal
rather than a coincidence. The more emphatically a document asserts something, the earlier it goes
in the queue to be re-derived.

<div class="w-full overflow-hidden text-teletext-white font-teletext select-none" role="separator" aria-hidden="true">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>

## Why five separate fixes would have been the wrong fix

My first instinct was to correct all five and move on. A threshold that was too low, a model output,
an averaging mistake, a sampling mistake, and a weight I had typed in from memory. Five unrelated
bugs, five patches.

Writing them next to each other is what killed that idea. They are not five bugs. They are one
mechanism showing up five times.

I almost never ride to my actual limit. I have a family, a job search, and a sensible aversion to
being wrecked for two days. So no model has ever seen my limit. Every number derived from my rides
is a *lower bound* on what I can do, and every single one of them had been written down as a
measurement.

Correct the five and I would have had five better numbers and the same failure again in September.

<div class="w-full overflow-hidden text-teletext-white font-teletext select-none" role="separator" aria-hidden="true">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>

## The rule

So the fix is not a number. It is a rule about what the system may believe.

Every decision-relevant number now carries one of two marks, at the moment it is written. Either an
instrument produced it, and the instrument and the date are named in plain text. Or it came from
somewhere else, a person, a model, a derivation, a memory, and that somewhere is named along with
why no measurement exists.

Four things make it work, and only one of them is obvious.

**The default is reversed.** An unmarked number is not a fact. It counts as stated until somebody
does the arithmetic again. "It says so in the document" is not a derivation, and neither is
"verified".

**Saying a number is unmeasured is not enough.** *Why* there is no measurement is the whole point.
That is the only thing that lets a later session decide whether the number is good enough for the
decision in front of it.

**Derivations inherit their weakest input.** Real watts divided by a remembered weight gives an
estimated power-to-weight figure, not a real one, no matter how good the watts are. Every such
figure I had from before June 2026 got reclassified as an estimate.

**You retrofit on contact.** I did not rewrite the history, and I never edit a dated log
retrospectively. Corrections get appended. But any number I read and use for a decision gets marked
as I use it.

<div class="w-full overflow-hidden text-teletext-white font-teletext select-none" role="separator" aria-hidden="true">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>

## The part I did not expect

I produced two of the five bad numbers myself. One of them I produced an hour *after* I had named
the pattern and written it down.

I had three rides mentioned to me, evaluated those three, and announced a two-year record. One call
to the endpoint that holds the actual power curve would have shown me the real figure was 35 watts
higher. A best drawn from a handful of samples is not a best. I knew that. I had just written it
down as a thing to watch for.

Naming a failure mode does not inoculate you against it. That is precisely why the fix had to be a
written default rather than an intention to be careful. Intentions do not survive a Thursday.

<div class="w-full overflow-hidden text-teletext-white font-teletext select-none" role="separator" aria-hidden="true">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>

## What generalises

The trigger that caught three of the five was not in the data at all. It was me saying "that can't
be right."

A number that contradicts how the ride felt is evidence, not a feeling. Nothing in the dataset would
have flagged those three, because internally they were perfectly consistent. I was in the ride and
the document was not, and the document had been winning that argument for months.

If you are handing a system a memory and asking it to reason from it, the question worth asking of
every number in there is short enough to fit in a sentence:

*Which instrument produced this, and when?*

If the answer is "an earlier note", you do not have a fact. You have a rumour with a date on it.
