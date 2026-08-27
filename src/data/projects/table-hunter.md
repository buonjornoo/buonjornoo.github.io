---
title: "Table Hunter"
description: "A three-person test removed the primary button from my own shipped product. It's since grown to five cities, on a roadmap I checked against the code before building it."
subtitle: "A consumer map of public table-tennis tables across Frankfurt and four Rhein-Main neighbours. Built solo with an agent team and my maps experience from Bikemap."
tags: ["Product Design", "User Research", "Maps", "React", "Cloudflare"]
coverImage: "/img/projects/tableHunterCover.png"
url: "https://table-hunter.pages.dev"
slug: "table-hunter"
order: 4
pageNumber: "206"
---

## Challenge

The map started with 261 public table-tennis tables in Frankfurt, four of which had a name. Nobody could answer the question a player actually has, which is whether there's a decent table near where they're going this afternoon, and the one incumbent site treats tables as records to fill in rather than places to find.

I built Table Hunter to answer that one question. It's live at
[table-hunter.pages.dev](https://table-hunter.pages.dev): five cities now, Frankfurt plus four
Rhein-Main neighbours, React and TypeScript with MapLibre GL on the front, Cloudflare Workers and
D1 behind. **I did not write the code. I directed the agents that wrote it**, which meant every
architectural decision still had to be made and defended, and none of them could be delegated to a
habit.

## The team and my role

I worked solo, which is why the decision log exists. With nobody to argue with, the only way to keep
myself honest was to write down each non-trivial decision, the reasoning behind it, and the specific
condition that would make me revisit it. That file is the real artefact of this project. It also let
a three-person usability test overturn a decision I had already shipped, without the ego that
attaches to a thing you built yourself.

## What I ruled out

A map of a thing tempts you into becoming the database of that thing. I ruled that out early and
wrote down why.

Tables with restricted access, about 22% of the Frankfurt set, are filtered out at fetch time with
no toggle, because club and private tables damage the answer to "find a public table near you".
Directions link out to Google or Apple Maps rather than routing in-app, since a self-hosted router
is an operations commitment and people memorise the tables they like anyway. Crowd-verified
freshness was deferred with three explicit triggers written down, because a verification system
needs a crowd, and v0.1 would have low double-digit weekly users against a few hundred tables.

## Making anonymous places findable

Only 1.6% of the features carry a name in OpenStreetMap: 8 of 496, across all five cities now
live. Users cannot recognise a table they have used before, sharing has no anchor, and there is
nothing for a problem report to point at. So the fetch step derives a name for every table from the
Stadtteil plus the nearest named landmark: "Bornheim, am Bethmannpark". That is how people in
Frankfurt describe where something is, and it beats a street address. OpenStreetMap already holds
both ingredients.

> **Key learning: I show "unbekannt" rather than defaulting a missing field to "no".**
> Tag coverage in OpenStreetMap runs 70 to 79%, and where a boolean like "covered" or "lit" is
> populated, over 95% of the values are "no". Defaulting the missing ones to "no" would have been
> close to harmless in practice and dishonest all the same: "Überdacht: nein" reads identically
> whether the table is uncovered or simply unmapped. Every missing field now shows "unbekannt". It
> costs a little tidiness and it gives the user something true, including the knowledge that this is
> a gap worth contributing back to OpenStreetMap.

<figure class="my-[2ch]">
  <img src="/img/table-hunter/live-map.png" alt="The live Table Hunter map showing the custom map style with clustered table pins across a Frankfurt neighbourhood" class="w-full" loading="lazy" />
  <figcaption class="text-teletext-green text-teletext-sm mt-[0.5ch]">
    The live map. Custom MapLibre style, clustered pins, and the corner-cluster convention:
    contributor actions top right, spatial action bottom left, bottom right deliberately empty.
  </figcaption>
</figure>

## The test that moved the furniture

The whole study was three people in one round.

The finding arrived unprompted, from more than one of them: the plus button looks like a primary
action although it is not, because the primary action is to find a good table at the place you are
going. Several also said the teal floating action button blended into the map and they had nearly
missed it. Both complaints have the same root.

> **Key learning: my only button advertised the wrong primary task.**
> By convention a floating action button announces the thing you should be doing here. For Table
> Hunter the dominant task is finding a table; the map, its pins and its popups *are* the primary
> interface. Reporting a missing table is a contribution flow used in a small minority of sessions.
> I had given it that weight because it was the only button I had, and three people spotted in one
> session what I had not seen in weeks of building. The fix set a convention I now hold to: top
> right for secondary and contributor actions, bottom left for spatial actions, bottom right
> deliberately empty. No primary floating button comes back without a logged reversal.

The same test surfaced a subtler failure. Requesting geolocation on map mount, without a user
gesture, gets silently auto-denied by real browsers often enough that the denial then poisons the
later find-me button. In testing that read as "the locate me button stops working after a while, no
prompt, no feedback." Removing the gesture-less call removed the failure mode. The map now opens on
Frankfurt and centres on you when you ask, which describes what the app knows.

## Checking a roadmap before building it

A month after v0.1 shipped, I wrote the next roadmap the normal way: multi-city expansion, a "signal
layer" of real-time trust signals, an identity system underneath it. Before building any of it, I
checked the roadmap's own assumptions against the live code instead of trusting what I had written.
The agents ran the greps and the diffs; deciding what each result meant for the roadmap was mine to
do.

Three premises, three different outcomes. The identity problem I had flagged as a nice-to-have was
worse than described: the fetch script recomputes each table's ID from OpenStreetMap on every run,
with no persistence across runs, so a real table's identity could change with zero real-world edits
behind it. Favourites, which the original scope had parked behind a future accounts system, turned
out not to need one. A grep of the codebase found nothing referencing favourites and nothing that
would: "needs accounts" had been copied forward from the v0.1 scope cut without anyone re-checking
it. The GDPR gap I already suspected was real, was real: no Impressum, no retention policy, no
deletion path, submitter emails and geolocation sitting in the database indefinitely.

> **Key learning: a roadmap inherited from my own earlier self is still a claim, not a fact.**
> I had written "favourites need accounts" months earlier, and every plan since carried it forward
> unquestioned, including the one I had just finished drafting. One grep found it was wrong. The
> other two premises could as easily have come back clean, nothing to do, but I would not have known
> that either without checking. I now treat "we already decided this" as a claim to verify against
> the decision log, on every roadmap pass, mine included.

## Five cities, each held to the same bar

The roadmap called for expanding into Rhein-Main: Mainz, Wiesbaden, Darmstadt, Offenbach. I did not
add all four the same way. Each city had to clear the same real Overpass density check Frankfurt had
cleared for v0.1, one city at a time, not a blanket rollout. Three passed. The fourth, Offenbach,
did not: its administrative boundary overlaps roughly two-thirds of Frankfurt's own, a question none
of the first three raised, and the query service itself was degraded the day I first checked,
returning no real count at all. I held it rather than force it through on a guess.

The overlap question had one answer: pool every city's raw data through the existing
duplicate-detection logic instead of building a second, bespoke system to draw boundaries between
cities. That let me verify the design instead of assuming it. I ran the fetch with Offenbach added,
diffed the result against the four-city baseline, and accounted for every difference by hand. Nine
features out of 505 moved: seven were the fallback-naming logic getting more accurate now that a
fifth city existed to fall back to, two were unrelated real-world edits on OpenStreetMap itself.
Zero were bugs.

The map now covers 496 tables across five cities. Four of the five shipped only after they had
individually earned it.

## What shipped alongside it

The map style and pin system the v0.1 write-up called "still placeholders" are placeholders no
longer: a restrained palette designed in Maputnik, six pin states, replacing the earlier default
style. Tables now carry a durable identity in the database rather than a recomputed OpenStreetMap ID,
which is what makes the "new" badge trustworthy and what any future signal feature will need to key
off. Favourites work with no login, stored on-device, exactly as the premise-check found they could.
An Impressum and Datenschutzerklärung are live. A monthly job anonymises submitter emails and
location data on report rows older than twelve months, closing the retention gap the
Datenschutzerklärung itself promises. Bug and backlog tracking moved to Linear, fed by a small
capture pipeline of my own, so nothing I notice mid-build gets lost.

<figure class="my-[2ch]">
  <img src="/img/table-hunter/table-detail.png" alt="A table detail popup on Table Hunter showing a NEU badge, unbekannt fields, and the favourite star" class="w-full" loading="lazy" />
  <figcaption class="text-teletext-green text-teletext-sm mt-[0.5ch]">
    A single table's detail popup: the "NEU" badge fed by the durable identity system, "unbekannt"
    on every unmapped field, and the on-device favourite star that needed no account after all.
  </figcaption>
</figure>

## What worked and what did not

Writing the decision log before there was anything to decide between paid for itself twice: once
in v0.1, again when it caught the favourites premise. So did treating the map style and pin system
as v0.1 scope rather than post-launch polish, and testing with three people, early, on the real
thing.

Against that: I shipped a primary action that misdescribed the product and found out from users. The
freshness display went through three revisions in two days because I specified how it looked before
deciding what "missing" should mean. Multi-city expansion, designed for in principle from the start,
still needed a real per-city check before I trusted it. Frankfurt's own numbers were never evidence
that Mainz or Darmstadt would look the same.

## Outcome

v0.1 shipped, then grew into a second phase rather than staying paused: five cities, a durable
identity system, a real map style and pin set, and the legal and privacy infrastructure a live
product with user-submitted data needs. Every addition after the initial launch went through the
same test the first version did: checked against real data or real code before I trusted it. None
of it shipped because it seemed like the obvious next step.

The shape of the original three-person test is still what I would take to another product: a few
people, one afternoon, no recruitment budget, changing the information architecture rather than the
wording of a button. What is new since is a second habit worth keeping: treat a roadmap, including
one I wrote myself, as a set of claims to check before it becomes a plan to execute.
