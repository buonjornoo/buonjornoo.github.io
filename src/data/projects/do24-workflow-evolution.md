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

The “Workflow” (literal name of the feature) is the central feature of the digital office web application. Users upload documents, assign them to their operating units (can be a person, a business, or a real estate object), enter information from the document (most documents are invoices), and assign an accounting code (SK04) from a chart of several hundred.

<figure class="my-[2ch]">
  <img src="/img/do24-workflow-evolution/legacy-workflow.png" alt="The legacy digital office workflow: one linear four-step wizard" class="w-full" loading="lazy" />
  <figcaption class="text-teletext-green text-teletext-sm mt-[0.5ch]">
    The workflow before the redesign (2026-03 UI): one linear wizard, four steps, every document
    through the same gate.
  </figcaption>
</figure>

The users doing it were assistants, the app’s highest-volume and most active users. Assistants are not trained in accounting. On the other side of the assistants and the “Workflow” sat the accountants, who reviewed and corrected whatever was submitted. For this they have a dedicated and optimized view (“Booking Review”). The feature itself is not in scope of this study but the insight is: Regardless of how carefully the assistants did the accounting code assignments (some of them even got extra training and onboarding for it), the accountants always had to review and correct every single position.

Talking to them, I saw that both of the user groups were frustrated because assistants had to do something they weren’t trained to do. The accountants had to correct everything, which was more effort than just doing the task themselves in the first place. We had no formal research programme but as a designer (and later product manager) I gathered users I got to know and had constant sessions with them where I sat next to assistants and accountants watching them use the product. One told me, roughly, "I wasn't trained for this, and I'm unhappy in my job because of it." An accountant told me, "I have to repair everything every time. It'd be cleaner if I just did it from scratch."

Talking to another user group, the HNWI end customers, I found they were frustrated because they could not pay on time when assistants were blocked from entering account codes. Another architectural restriction was in play: only documents with finished accounting were allowed to move to the payment page. The frustrating part for them was that they already hired assistants and accountants but instead of making them collaborate, the product caused unnecessary frustration and blockers leading to overdue payment charges in the worst case.

Everything because the product was asking the wrong person to do the work.

Addressing this was a tough challenge. The legacy “Workflow” was built around a rigid linear process with arbitrary backend rules, states, and dependencies. Those were defined in the early days before I joined. The decisions might have been sensible and good back then, but they didn’t hold anymore. One specific example: The backend did not allow for an invoice position (e.g. “4h Consulting”) to have an empty accounting code field. Lifting these kinds of restrictions would be complicated, according to our backend team, and likely cause other unwanted effects downstream. The backend team considered rebuilding to get rid of years of tech debt and be more flexible, stable, and scalable for future changes. It was something that had to be done anyways, but it was not something we could do right now. Given the sentiment and amount of negative user feedback, I had to find a solution that would ease the pain asap, giving us runway to build a better architecture.

## The team and my role

In the two-year span of this initiative, I moved from doing only design to also owning the product direction as the sole product manager of the company. I worked together with another designer, multiple frontend and backend engineers. Everything we worked on was collaborative but in the end I owned every epic, spec and product decision. The company philosophy was to trade a heavy reliance on formal processes for faster shipping. No traditional PRDs. Epics, stories, tasks, design specs. We would rather collaborate live (during coding and design) than wait for a perfectly specced ticket to be assigned.

Scale: around 100 client workspaces, seven document types in the workflow, and a Jira archive of 932
tickets by the time I left in July 2026.

## Milestone one: the “Speedflow” modal - *what if assistants stopped doing accounting*

The obvious first ideas were to make account selection easier to understand, add supporting text, make the UI simpler, make better training, provide training videos (like the old WISO Steuer Videos). I found that they were all framed around keeping the status quo. The product would still ask the wrong person to do the job. I pushed towards eliminating the need for assistants to pick accounts in the first place.

Since the legacy “Workflow” was architecturally locked for the moment, we had to find other ways to eliminate this step. The backend needed a value in the accounting code field no matter what, so I asked: *What if the system enters the code automatically?* Initial answers centered around the sentiment that this would be a hard thing to get right. So I reframed: *What if we could have a “correct enough” option, so payments, dashboard numbers, and other things down the line still work?* That got our accounting experts thinking. The solution was to introduce custom clearing accounts for each operating unit type, document type, and direction (incoming or outgoing).

This gave me a way to build an optional focused modal which could live alongside the legacy Workflow but would replace its full accounting path. Assistants would only confirm a partner (who sent/received that document), confirm dates, amounts, and invoice numbers (one thing I could not get rid of even though I tried hard). Assistants would never have to see the accounting chart again. Everything else would be assigned automatically and accountants could do the rest later.


<figure class="my-[2ch]">
  <img src="/img/do24-workflow-evolution/speedflow-modal.png" alt="The Speedflow modal, a short path laid over the legacy workflow" class="w-full" loading="lazy" />
  <figcaption class="text-teletext-green text-teletext-sm mt-[0.5ch]">
    Speedflow (2026-03 UI): the short path laid over the legacy workflow. The accounting account
    resolves in the background, so assistants never saw it.
  </figcaption>
</figure>

The modal was a sensible way of dealing with tech debt in the frontend as well. Changing the existing view would be very challenging for the frontend team because the legacy frontend had many dependencies which were leading to unexpected behaviors across the app every time we made a change. Rebuilding this would only make sense along with the new backend (otherwise we would have to rebuild twice), so we built a modal on top of the legacy view. Users did not have to leave the context they were in.

OCR was doing most of the heavy lifting for the users as well: not only did we reduce the necessary inputs and selections, but most of them could be pre-filled and pre-selected using OCR. Assistants would only need to verify and correct.

> **Key learning: Reframing stakeholders and experts into a “what if” mentality opened new possibilities**
> Stakeholders, accountants, backend kept circulating around the fact that it was architecturally not possible to proceed without accounting codes. So when confronted with “This can’t be empty”, I responded with “What if we fill it?”. When told “We can’t possibly automatically find the right/correct/optimal account for each invoice position”, I responded with “What if we had something that is correct enough?” Which got the team thinking about what correct enough means, and resulted in the idea of the clearing accounts. Accountants had to correct everything anyways. If everything is parked in those clearing accounts, they would be able to find and process them easier. And it would give them a “done” state as well: They are done when the clearing accounts show a zero balance.


Speedflow became the most-used feature in the app. Although we had no real analytics system set up, we knew it because the clearing accounts turned up everywhere we looked. The assistants told me that they much preferred using this over the legacy feature. Accountants told me that their part was easier because they knew where to look and they knew when they were done.

## Milestone two: parallelized tasks

The Speedflow superficially solved the assistant’s pain. The process underneath stayed as it was. Payment was blocked by accounting classification, and other invented dependencies kept giving us headaches as well. We wanted to break up the linear flow into tasks that could run independently. Instead of one task, waiting for another task to be finished, we decided to base readiness on individual field status. For example: The legacy Workflow blocked payment because the accounting was not done. Only when this was done, the document status would change to „Ready for Payment”. But what information do we actually need in order to make a payment in reality? Bank information and an amount. That’s it. So in our new architecture we allowed payments when there was a name, IBAN, and an amount. The system does not care in which task the users would enter/select that information (during upload, early processing, accounting, or in the payment task itself). Making the payment would lock the total amount of the document in the system. Other tasks would just get the data and adapt their state accordingly. Everything was more flexible and users did not block each other anymore. Accounting could happen before payment, after payment, or even in parallel.

Our users also got a new view that included a document table with filtering options. The table would adapt to whatever item was selected. On selection, the view would adapt into a three-column view: Table, Document Preview, Tasks. Filtering by task would show all documents that have that task unfinished. Finishing a task would remove it from the filtered list and open the next available item. Users could filter by task and plow through their tasks until the list is empty. Before the change, I saw workspaces with hundreds of unfinished documents because something was missing (e.g. a contract with recurring costs). Users had limited filtering capabilities. Everything was cluttered and they never knew when they were done. Now they could filter by month and task and work on emptying the list they see.

<figure class="my-[2ch]">
  <img src="/img/do24-workflow-evolution/open-tasks-per-document.png" alt="Open tasks per document across the workflow queue" class="w-full" loading="lazy" />
  <figcaption class="text-teletext-green text-teletext-sm mt-[0.5ch]">
    After the rebuild (2026-07 UI): open tasks per document across the queue. What used to be one
    blocking sequence is parallel work anyone can pick up.
  </figcaption>
</figure>

I ran spec sessions with the team, the founder, and accounting experts to validate what counted as a task, led the architecture review, and made the coexistence call that let the new Workflow run alongside the old one instead of replacing it in a single cut. We had to reverse the call later because backend found no way to make the architecture change without breaking the old one. The rebuild took most of our resources for a limited amount of time and I kept two engineers on live user-facing bugs.

> **Key learning: small enough tasks gave us three service models.**
> We’d been trying to find a way to introduce more AI into the product for a year (we shipped a secret AI Chat Assistant which we were still testing with some users). The hard challenge was that we wanted specialized agents to only do what we wanted them to do. Not one thing that does everything. The old architecture was too fragile and one agent who fails could break the entire document and the workspace. Making the tasks small in scope and self-contained gave us three service models: users pay one price and do everything themselves, the cheapest tier; users pay our tax consultancy partner, whose experts take over some or all tasks while the user just supplies documents; or users pay for AI features that take over some tasks. Price on the last two was still undefined.

## Outcome

The new Workflow shipped in my last months at digital office. We’d already gained positive feedback. Users took a few weeks to adapt to the new experience but that was expected. The legacy Workflow is gone, the Speedflow modal as well. The positive feedback stays anecdotal. We were committed to shipping the new Workflow with an analytics solution but could not commit to one due to privacy and budgeting concerns.

<figure class="my-[2ch]">
  <img src="/img/do24-workflow-evolution/pipeline-shipped.png" alt="The shipped task pipeline: one document as a set of independent tasks" class="w-full" loading="lazy" />
  <figcaption class="text-teletext-green text-teletext-sm mt-[0.5ch]">
    The shipped architecture (2026-07 UI): the same document as a set of independent tasks, each
    with its own status.
  </figcaption>
</figure>

> **Key learning: escalating a strategic misalignment is product work.**
> The redesign served the founder's mission directly, which was to let tax consultancies take on more clients as accountants become scarce. A different vision for the company with different use cases and a more exclusive customer profile was being pursued in parallel. Both visions were compatible but were competing on the roadmap. It was my priority to keep pushing the founder and CEO to commit to one roadmap priority. That seemed to work, but the roadmap itself kept leaving a bitter taste for one of the two. Starting over, I would make it my first priority to push for one unified vision and direction because two compatible directions are still one too many.
