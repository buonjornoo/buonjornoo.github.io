---
title: "Workflow Evolution"
description: "Breaking up a linear workflow into a parallelized task system unblocking two user groups to do their work."
subtitle: "digital office, 2024 to 2026. How a conversation with an assistant became an architecture decision."
techStack: ["Product Management", "UX Design", "Research", "Fintech", "B2B"]
coverImage: "/img/projects/workflowEvolutionCover.png"
slug: "do24-workflow-evolution"
featured: true
order: 2
pageNumber: "204"
---

## Challenge

Every invoice position going through digital office required somebody to pick an accounting code
from a chart of several hundred, built on the German SK04 standard. The people doing it were
assistants, the app's highest-volume and most active users, and the ones with no accounting
training. On the other side sat the accountants, who reviewed and corrected whatever was submitted
regardless of how carefully it had been done.

<figure class="my-[2ch]">
  <img src="/img/do24-workflow-evolution/legacy-workflow.png" alt="The legacy digital office workflow: one linear four-step wizard" class="w-full" loading="lazy" />
  <figcaption class="text-teletext-green text-teletext-sm mt-[0.5ch]">
    The workflow before the redesign (2026-03 UI): one linear wizard, four steps, every document
    through the same gate.
  </figcaption>
</figure>

The problem reached me in my early days as a designer, in a small team with no product manager. We
had no research programme, but we had constant sessions where I sat next to assistants and watched
them use the product. One told me, roughly, "I wasn't trained for this, and I'm unhappy in my job
because of it." An accountant told me, "I have to repair everything every time. It'd be cleaner if I
just did it from scratch."

Two groups of people were frustrated by the same product, which was asking the wrong person to do
the work.

## The team and my role

I joined for design and left as the only product manager the company had, in a team of around
fifteen. Every epic, spec and product decision went through me, and I kept the design work when the
title changed. Specs lived in Jira epic descriptions rather than formal PRDs, a company philosophy
that traded faster shipping against a heavy reliance on judgement being right.

Scale: around 100 client workspaces, seven document types in the workflow, and a Jira archive of 932
tickets by the time I left in July 2026.

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

<figure class="my-[2ch]">
  <img src="/img/do24-workflow-evolution/speedflow-modal.png" alt="The Speedflow modal, a short path laid over the legacy workflow" class="w-full" loading="lazy" />
  <figcaption class="text-teletext-green text-teletext-sm mt-[0.5ch]">
    Speedflow (2026-03 UI): the short path laid over the legacy workflow. The accounting account
    resolves in the background, so assistants never saw it.
  </figcaption>
</figure>

The scope calls mattered as much as the design. I specified a modal rather than a new page, so
nobody left the context they were in, and selection from a list rather than free text, which removed
a whole class of typo errors. The first version handled invoices only, one document at a time, with
OCR deferred.

> **Key learning: "correct enough" is a real standard when the correction already exists.**
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

## Milestone two: breaking the dependency

Speedflow solved the assistant's pain while leaving the process underneath exactly as it was.
Payment was still blocked by accounting classification, so an assistant wanting to pay an invoice
waited on an accountant with no reason to hurry.

That dependency was invented rather than inevitable, and the redesign removed it. The workflow broke
into independent tasks running in parallel, each status-driven rather than sequentially chained,
with task definitions held in the backend so the frontend renders whatever tasks exist without
knowing what they are. An assistant opens a queue and sees discrete jobs, such as preparing a
payment or classifying a document, each completable on its own.

<figure class="my-[2ch]">
  <img src="/img/do24-workflow-evolution/open-tasks-per-document.png" alt="Open tasks per document across the workflow queue" class="w-full" loading="lazy" />
  <figcaption class="text-teletext-green text-teletext-sm mt-[0.5ch]">
    After the rebuild (2026-07 UI): open tasks per document across the queue. What used to be one
    blocking sequence is parallel work anyone can pick up.
  </figcaption>
</figure>

I ran the spec sessions with the accounting lead and customer success to validate what counted as a
task, led the architecture review, and made the coexistence call that let the new workflow run
alongside the old one instead of replacing it in a single cut. Through the rebuild I kept two
engineers on live user-facing bugs, because a foundational change that degrades the running product
costs more than it delivers.

> **Key learning: small enough tasks gave us three service models we had not designed for.**
> The team had wanted AI in the product for a year and could not find a way in, because no single
> agent could take on the full workflow. Once each task was small and self-contained, a user, an AI
> agent or an operator working on a client's behalf could complete it. Three service models came out
> of one architecture, from a decomposition I had made for user-experience reasons. Putting task
> definitions in the backend rather than the frontend is a governance decision more than a UX one,
> and it is the piece I would defend hardest.

## What I scoped it against

The redesign epic states two targets: a 40% reduction in document processing time and a 90%
reduction in permission-related support tickets. **Both are targets I wrote, not results I
measured.** No measurement was taken while I was there and I have no way to check them now. They are
here to show the practice of scoping a change against explicit numbers.

## Outcome

It shipped, after I left. The task architecture is live: the workflow list shows tasks per document
as independent chips, and the document view carries an accordion where SmartFill, assignment,
payment preparation, payment approval, execution and accounting each hold their own status.
Speedflow's modal is gone, replaced by the pipeline it existed to make possible.

<figure class="my-[2ch]">
  <img src="/img/do24-workflow-evolution/pipeline-shipped.png" alt="The shipped task pipeline: one document as a set of independent tasks" class="w-full" loading="lazy" />
  <figcaption class="text-teletext-green text-teletext-sm mt-[0.5ch]">
    The shipped architecture (2026-07 UI): the same document as a set of independent tasks, each
    with its own status.
  </figcaption>
</figure>

> **Key learning: escalating a strategic misalignment is product work.**
> The redesign served the founder's mission directly, which was to let tax consultancies take on
> more clients as accountants become scarce. A different vision for the company was being pursued in
> parallel, and I kept optimising the thing in front of me on the assumption that a good enough
> product would settle the argument. Execution was strong and adoption was real, and neither saved
> the work's position, because the two directions were never reconciled and I never forced them into
> the open. Starting over, forcing the two clashing product directions between founder and CEO into
> one room would be my first priority.
