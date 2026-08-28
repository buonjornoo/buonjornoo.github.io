---
title: "Workflow Evolution"
description: "Two years from a design insight to a task-based architecture. Started as a designer, ended owning the product."
subtitle: "digital office 24, 2024–2026. Started as the designer, ended owning the product: how a conversation with an assistant became a new task architecture."
tags: ["Product Management", "UX Design", "Research", "Fintech", "B2B"]
context: "digital office is a platform for High Networth Individuals. They use it to keep the overview of their complex financial structures (businesses, real estate, stocks, family). While they keep the overview, their team works on the platform to process documents, do accounting, taxes and consulting."
coverImage: "/img/projects/workflowEvolutionCover.png"
slug: "do24-workflow-evolution"
featured: true
order: 1
pageNumber: "204"
---

## Challenge

Every invoice position going through digital office required somebody to pick an accounting code
from a chart of several hundred, built on the German SK04 standard. The people doing it were
assistants with no accounting training. They also are the app's highest-volume and most active
users.

On the other side sat the accountants, who reviewed and corrected whatever was submitted regardless
of how carefully it had been done.

<figure class="my-[2ch] full-bleed">
  <img src="/img/do24-workflow-evolution/legacy-workflow.png" alt="The legacy digital office workflow: table view with a selected document and the input form" width="1552" height="916" class="w-full" loading="lazy" />
  <figcaption class="text-teletext-grey text-teletext-sm mt-[0.5ch]">
    The legacy workflow showing the table with a selected document and the input form. One linear
    wizard, four steps (with sub-steps), every document through the same gate.
  </figcaption>
</figure>

The problem reached me in my early days as a designer. Back then we were roughly 10 people, no
product manager, and I directly collaborated with the CTO and the founder.

There was no formal research programme, but we had constant sessions where I sat next to assistants
and watched them use the product. I also sat next to accountants, picking up the prepared tasks from
the assistants. I noticed a repeating pattern on what they told me: they each were frustrated by
each other. Assistants couldn't finish their work without doing things they never learned.
Accountants had to repair almost everything the assistants did, getting anxious over missing any
mistakes from them in the process.

> "I wasn't trained for this and I hate doing it."
>
> — Undisclosed Assistant

> "I have to repair everything every time. It'd be cleaner if I just did it from scratch."
>
> — Undisclosed Accountant

Two groups of people were frustrated by the same product. The wrong person was doing the work.

<figure class="my-[2ch]">
  <img src="/img/do24-workflow-evolution/legacy-workflow-document-preview.png" alt="The legacy digital office workflow: a document preview alongside the input form" width="1552" height="916" class="w-full" loading="lazy" />
  <figcaption class="text-teletext-grey text-teletext-sm mt-[0.5ch]">
    The legacy workflow showing a document preview and the input form.
  </figcaption>
</figure>

<div class="w-full overflow-hidden text-teletext-white font-teletext select-none" role="separator" aria-hidden="true">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>

## The team and my role

I joined for design and left as the only product manager the company had, in a team of around
fifteen. Every epic, spec and product decision went through me, and I kept the design work when the
title changed. Specs lived in Jira epic descriptions rather than formal PRDs, a company philosophy
that traded faster shipping against a heavy reliance on judgement being right.

Scale: around 80 client workspaces, seven document types in the workflow, and a Jira archive of 932
tickets by the time I left in July 2026.

<div class="w-full overflow-hidden text-teletext-white font-teletext select-none" role="separator" aria-hidden="true">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>

## Milestone one: the modal that bought the mandate

The obvious first move was a simpler accounting interface, or better training. Both were wrong for
the same reason: accountants were already correcting every submission. Correction was existing work
that nobody had made visible. So the question changed from *how do we help assistants do accounting*
to *what if assistants stopped doing accounting*.

The legacy workflow was architecturally locked and I could not touch it, so I built on top of it.
Speedflow was a focused modal that replaced the full accounting interface for the assistant's part
of the job: confirm the partner from a pre-filtered list, confirm the dates, enter the amount and
the invoice number. The system filled in the rest. Behind it sat custom intermediate accounting
accounts, assigned automatically per document category, so the assistant never met the chart of
accounts at all.

<figure class="my-[2ch] full-bleed">
  <img src="/img/do24-workflow-evolution/speedflow-modal.png" alt="The Speedflow modal, a short path laid over the legacy workflow" width="1552" height="982" class="w-full" loading="lazy" />
  <figcaption class="text-teletext-grey text-teletext-sm mt-[0.5ch]">
    Speedflow (2026-03 UI): the short path laid over the legacy workflow. The accounting account
    resolves in the background, so assistants never saw it.
  </figcaption>
</figure>

The scope calls mattered as much as the design. I specified a modal rather than a new page, so
nobody left the context they were in, and selection from a list rather than free text, which removed
a whole class of typo errors. The first version handled invoices only, one document at a time, with
OCR deferred.

> Key learning: "correct enough" is a real standard when the correction already exists.
> The intermediate accounts were not accounting-perfect and I knew it when I specified them. The
> default booking account became both the most-used selection in the system and the most-corrected
> one on the accountants' review page, which reads like a failure until you look at what it
> replaced. Accountants were correcting the assistants' work anyway, case by case; now they did it
> in bulk, on entries arriving in a predictable shape. The tradeoff was explicit, the cost landed on
> the group best equipped to absorb it, and it bought the time to fix the architecture underneath.

Speedflow became the most-used feature in the app. I know that indirectly rather than from
analytics, which we did not have: the new clearing accounts turned up everywhere, and our in-house
tax advisors told me their job had got simpler, because instead of running through each invoice they
could look straight at the clearing accounts.

<div class="w-full overflow-hidden text-teletext-white font-teletext select-none" role="separator" aria-hidden="true">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>

## Milestone two: breaking the dependency

Speedflow solved the assistant's pain while leaving the process underneath exactly as it was.
Payment was still blocked by accounting classification, so an assistant wanting to pay an invoice
waited on an accountant with no reason to hurry.

<figure class="my-[2ch]">
  <img src="/img/do24-workflow-evolution/legacy-flow-map.png" alt="Map of the legacy flow: a strict linear path with payment via the app as optional" width="2048" height="506" class="w-full" loading="lazy" />
  <figcaption class="text-teletext-grey text-teletext-sm mt-[0.5ch]">
    Map of the legacy flow: strict linear path. Payment via the app as optional.
  </figcaption>
</figure>

That dependency was invented rather than inevitable, and the redesign removed it. The workflow broke
into independent tasks running in parallel, each status-driven rather than sequentially chained,
with task definitions held in the backend so the frontend renders whatever tasks exist without
knowing what they are. An assistant opens a queue and sees discrete jobs, such as preparing a
payment or classifying a document, each completable on its own.

<figure class="my-[2ch]">
  <img src="/img/do24-workflow-evolution/task-architecture-map.png" alt="Map of the initial task architecture: independent, self-contained tasks" width="2048" height="495" class="w-full" loading="lazy" />
  <figcaption class="text-teletext-grey text-teletext-sm mt-[0.5ch]">
    Map of our initial task architecture: every task is self-contained and can be done
    independently as long as some preconditions are met.
  </figcaption>
</figure>

I ran the spec sessions with the accounting lead and customer success to validate what counted as a
task, led the architecture review, and made the coexistence call that let the new workflow run
alongside the old one instead of replacing it in a single cut. Through the rebuild I kept two
engineers on live user-facing bugs, because a foundational change that degrades the running product
costs more than it delivers.

<figure class="my-[2ch]">
  <img src="/img/do24-workflow-evolution/task-definition-map.png" alt="Task definition map: initial definitions for individual tasks" width="2048" height="918" class="w-full" loading="lazy" />
  <figcaption class="text-teletext-grey text-teletext-sm mt-[0.5ch]">
    Task definition map: initial definitions for individual tasks. Defined collaboratively with
    experts, stakeholders, and users.
  </figcaption>
</figure>

> Key learning: small enough tasks gave us three service models we had not designed for.
> The team had wanted AI in the product for a year and could not find a way in, because no single
> agent could take on the full workflow. Once each task was small and self-contained, a user, an AI
> agent or an operator working on a client's behalf could complete it. Three service models came out
> of one architecture, from a decomposition I had made for user-experience reasons. Putting task
> definitions in the backend rather than the frontend is a governance decision more than a UX one,
> and it is the piece I would defend hardest.

<figure class="my-[2ch] full-bleed">
  <img src="/img/do24-workflow-evolution/open-tasks-per-document.png" alt="Open tasks per document across the workflow queue" width="2820" height="2270" class="w-full" loading="lazy" />
  <figcaption class="text-teletext-grey text-teletext-sm mt-[0.5ch]">
    After the rebuild (2026-07 UI): open tasks per document across the queue. What used to be one
    blocking sequence is parallel work anyone can pick up.
  </figcaption>
</figure>

<div class="w-full overflow-hidden text-teletext-white font-teletext select-none" role="separator" aria-hidden="true">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>

## Where AI fit into the process

AI played a role in a few different places, not in order of importance. Developers used Copilot,
Claude Code and Codex during implementation. My designer used Claude and Figma Make for copywriting
passes and ideation.

My own use was in prototyping and completing flows: we started ideating at a meta level with
post-its on a wall, also sketching one happy path on the wall. I then translated it to a rough
wireframe to see how it would actually work on screen. From there I moved into Claude Code and Figma
Make to get closer to high fidelity against our real design system. Figma Make was disappointing at
holding onto that system; Claude Code came much closer, because the tokens were already in place
from the teal-ui work. Google Stitch, used through its API alongside Claude Code, was useful for
exploring flows and surfacing directions that hadn't occurred to me yet. As we committed more to a
direction, Claude Code overtook Figma for design work outright. My vision for the workflow was to
get Figma out of the loop to bring make prototype to PR much faster.

<div class="w-full overflow-hidden text-teletext-white font-teletext select-none" role="separator" aria-hidden="true">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>

## What I scoped it against

I aimed at a 40% reduction in document processing time, a significant reduction in time-on-task and
a 90% reduction in Workflow-related support tickets.

I formulated these goals early, expecting that we would have set up our analytics platform until
then. We didn't, so there are no measured numbers and you will have to trust me now.

While our userbase grew and by that also our support ticket count, I noticed a massive reduction in
support tickets about the Workflow. To be fair, there were bug reports in the beginning, but those
reports came mostly from dedicated internal testing.

The document processing time reduction was stated too vaguely and not really relevant anymore:
users didn't care about the overall time from upload to finished document. They did their separate
task and moved on to the next one. This means it now is okay for a document to stay at below 100%
completion for months because nobody is blocked by it. If I would start over, I would measure
time-on-task for each individual task and work from that baseline.

<div class="w-full overflow-hidden text-teletext-white font-teletext select-none" role="separator" aria-hidden="true">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>

## Outcome

The redesigned Workflow shipped in my last months at digital office. Everything is live and the team
continues to iterate on it.

The document list is an adaptable table with powerful filtering capabilities. It also allows users
to only display the tasks they have to do, removing cognitive load.

The task panel on the right focuses on the task at hand. Other tasks and finished jobs are minimized
until users intervene. We also shipped "SmartFill," which utilizes a dedicated agent to get OCR data
from the document and pre-fill basic fields like date, correspondent, line items, and banking
information.

Payment, payment preparation, accounting are all individual tasks that get and write data to the
same document source. This means users who complete any of those tasks independently will add
necessary data for other tasks at the same time: if an accountant happens to do the accounting on a
given document before anyone else did their tasks, the others will greatly benefit from it because
most of the information is already filled.

<figure class="my-[2ch] full-bleed">
  <img src="/img/do24-workflow-evolution/pipeline-shipped.png" alt="The shipped task pipeline: one document as a set of independent tasks" width="2820" height="2270" class="w-full" loading="lazy" />
  <figcaption class="text-teletext-grey text-teletext-sm mt-[0.5ch]">
    The shipped architecture (2026-07 UI): the same document as a set of independent tasks, each
    with its own status.
  </figcaption>
</figure>

> Key learning: escalating a strategic misalignment is priority 0 product work.

The execution was strong and users adapted the new workflow already before we rolled it out
everywhere.

While this initiative unblocked development possibilities and improved velocity, it drew most of our
resources during final implementation. During that time, I needed to deprioritize some efforts that
the CEO pushed for. While the team and the founder were fully aligned on the vision and the angle of
how we pursue it, the CEO changed to a different angle in parallel. Both were right to bring urgency
to their priorities and I made the decision to pursue the one with the biggest validated impact
(product stability, tech debt, resolving validated user pain for the most active user base). The
reality is that whatever I would have done, it would be wrong for at least one of them.

I quickly realised that I failed to address the strategic misalignment on day 1 and when I could
start over, I would make it my first priority to force the two clashing product directions between
founder and CEO into one room.

<div class="w-full overflow-hidden text-teletext-white font-teletext select-none" role="separator" aria-hidden="true">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>

<div class="font-teletext font-teletext-regular tracking-teletext-normal text-center flex justify-center flex-wrap text-teletext-white text-teletext-double/teletext-base">EOF</div>

<div class="w-full overflow-hidden text-teletext-white font-teletext select-none" role="separator" aria-hidden="true">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
