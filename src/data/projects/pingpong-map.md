---
title: "Pingpong Map"
description: "A three-person test removed the primary button from my own shipped product. v0.1 is live."
subtitle: "A consumer map of public table-tennis tables in Frankfurt. Built solo, directed rather than coded."
techStack: ["Product Design", "User Research", "Maps", "React", "Cloudflare"]
coverImage: "/img/projects/pingpongMapCover.png"
url: "https://table-hunter.pages.dev"
slug: "pingpong-map"
order: 4
pageNumber: "206"
---

## Challenge

The map shows 261 public table-tennis tables in Frankfurt. Four of them have a name. Nobody can
answer the question a player actually has, which is whether there is a decent table near where they
are going this afternoon, and the one incumbent site treats tables as records to fill in rather than
places to find.

I built Pingpong Map to answer that one question. It is live at
[table-hunter.pages.dev](https://table-hunter.pages.dev), Frankfurt first, React and TypeScript with
MapLibre GL on the front, Cloudflare Workers and D1 behind. **I did not write the code. I directed
the agents that wrote it**, which meant every architectural decision still had to be made and
defended, and none of them could be delegated to a habit.

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

Only 1.5% of the features carry a name in OpenStreetMap. Users cannot recognise a table they have
used before, sharing has no anchor, and there is nothing for a problem report to point at. So the
fetch step derives a name for every table from the Stadtteil plus the nearest named landmark:
"Bornheim, am Bethmannpark". That is how people in Frankfurt describe where something is, and it
beats a street address. OpenStreetMap already holds both ingredients.

> **Key learning: I show "unbekannt" rather than defaulting a missing field to "no".**
> Tag coverage in OpenStreetMap runs 70 to 79%, and where a boolean like "covered" or "lit" is
> populated, over 95% of the values are "no". Defaulting the missing ones to "no" would have been
> close to harmless in practice and dishonest all the same: "Überdacht: nein" reads identically
> whether the table is uncovered or simply unmapped. Every missing field now shows "unbekannt". It
> costs a little tidiness and it gives the user something true, including the knowledge that this is
> a gap worth contributing back to OpenStreetMap.

<figure class="my-[2ch]">
  <img src="/img/pingpong-map/live-map.png" alt="The live Pingpong Map showing Frankfurt with clustered table pins" class="w-full" loading="lazy" />
  <figcaption class="text-teletext-green text-teletext-sm mt-[0.5ch]">
    The live map, Frankfurt. Custom MapLibre style, clustered pins, and the corner-cluster
    convention: contributor actions top right, spatial action bottom left, bottom right deliberately
    empty.
  </figcaption>
</figure>

## The test that moved the furniture

The whole study was three people in one round.

Three people in an afternoon is my default test size, and it's less a method I chose than a gap
I've learned to fill: Bikemap had a real analytics team, but it was built to feed the CEO's
dashboard rather than close the loop on any one project, and my PM tenure there ended before I
could wire the two together, the same gap behind
[the tracking regret at Bikemap](/projects/bikemap-route-planner/). Solo here, with nobody to
close that loop for me, three people in a room is the version I can run myself.

The finding arrived unprompted, from more than one of them: the plus button looks like a primary
action although it is not, because the primary action is to find a good table at the place you are
going. Several also said the teal floating action button blended into the map and they had nearly
missed it. Both complaints have the same root.

> **Key learning: my only button advertised the wrong primary task.**
> By convention a floating action button announces the thing you should be doing here. For Pingpong
> Map the dominant task is finding a table; the map, its pins and its popups *are* the primary
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

## What worked and what did not

Writing the decision log before there was anything to decide between paid for itself. So did
treating the map style and pin system as v0.1 scope rather than post-launch polish, on the argument
that visual quality is the differentiator against a default-styled OpenStreetMap map and "polish
later" never arrives. And testing with three people, early, on the real thing.

Against that: I shipped a primary action that misdescribed the product and found out from users. The
freshness display went through three revisions in two days because I specified how it looked before
deciding what "missing" should mean. And the Frankfurt-only derived names mean a second city needs
its own landmark and boundary fetch step, which I did not design for.

## Outcome

v0.1 shipped and is live. I paused it there, finished at the scope I set for it, with the next
version's triggers written down rather than its features. The map style and the pin set are still
placeholders I would replace before calling it v1.

The shape of that test is what I would take to another product. Three people, one afternoon, no
recruitment budget, and it changed the information architecture rather than the wording of a button.
Waiting until you can run a "proper" study is how a wrong primary action stays shipped for a year.
