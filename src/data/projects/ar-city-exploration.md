---
title: "AR City Exploration"
description: "A master's thesis testing whether AR could tell Frankfurt's looted-art history better than a plaque or a walking-tour app."
subtitle: "Location-based AR storytelling for Frankfurt's Raubkunst history, built with a five-person team and shown at the Frankfurt Book Fair 2018."
tags: ["Unity3D", "AR", "UX Design", "Experience Design", "Research"]
coverImage: "/img/arCityExploration/raubkunst_cover-small.gif"
heroImage: "/img/arCityExploration/raubkunst_cover.gif"
slug: "ar-city-exploration"
order: 7
pageNumber: "203"
---

## Challenge

Frankfurt carries a Raubkunst history, art looted under the Nazi regime and never fully returned,
attached to specific buildings most people walk past without knowing it. For my master's thesis I
wanted to find out whether augmented reality could tell that kind of place-bound history better than
a plaque or a walking-tour app, and whether the prototype could hold up outside a classroom. It got
tested at the Frankfurt Book Fair 2018, in front of the public rather than a thesis committee only.

## The team and my role

Five of us built this: Eve, Dori, Benji, Ramiro and me, all contributing to a shared concept. From
there the work split by strength: Eve took visual assets and design, Dori and Benji worked
interaction design, Benji also handled engineering, and Ramiro and I wrote the story, with Ramiro
developing the characters. My own build work was in prototyping, across Figma and Unity3D, and I
designed the sound myself, drawing on a background in sound and music production. The thesis was
mine to write.

## Discovery

I ran the research the thesis needed: semantic analysis of the Raubkunst material, workshops
structured as rapid ten-plus-ten idea rounds, and a physical research wall to keep findings visible
while the concept moved. Two 2018 exhibitions grounded the history: Geerbt, Gekauft, Geraubt at the
Historical Museum Frankfurt, and the Gurlitt Status Report show, the public unveiling of the
Schwabinger Kunstfund, the Nazi-era art hoard found in Hildebrand Gurlitt's apartment. That hoard
shaped our antagonist, and real figures found their way into the fiction too, among them Max
Beckmann, dismissed from the Städel and banned from working under the regime.

A feasibility matrix turned the output into a build decision: what a five-person team could ship on a
fixed thesis timeline. I don't have the specific rejected concepts anymore. What's left is the matrix
itself and the concept it selected.

<figure class="my-[2ch]">
  <img src="/img/arCityExploration/raubkunst_feasibilityMatrix.jpg" alt="Feasibility matrix for design decisions" class="w-full" loading="lazy" />
  <figcaption class="text-teletext-green text-teletext-sm mt-[0.5ch]">
    The feasibility matrix that turned research into a build decision.
  </figcaption>
</figure>

## Designing the experience

Every design decision was intentional. I chose a starting place with cafes nearby, used vibration
for haptic feedback, kept the sound design blending into the environment rather than announcing
itself, and built in reminders to take a break at local stores along the way.

<figure class="my-[2ch]">
  <img src="/img/arCityExploration/raubkunst_experience_design_principles.webp" alt="Experience Design Principles" class="w-full" loading="lazy" />
  <figcaption class="text-teletext-green text-teletext-sm mt-[0.5ch]">
    The experience design principles behind the walk.
  </figcaption>
</figure>

## The Memorama framework

We built Memorama together as the thesis's framework for location-based experiences that combine
fiction, historical knowledge and real places, structured around three spaces: Navigation, Discovery
and Home.

Navigation deliberately isn't turn-by-turn. No straight line from point A to point B, more of a
paper chase: sketches of nearby landmarks pushed based on proximity, giving people room to explore
instead of just following a blue dot. The idea came straight from geocaching, which never gives you
point-to-point directions either.

Discovery Spaces were built from a small toolkit: five kinds of Artifact (walkthrough spaces,
see-through windows, 3D objects you could examine, display overlays, hideouts), three kinds of
Object (scenery, interactive, collectable), and three kinds of Sound (static atmosphere,
proximity-triggered, feedback). Home Space isn't a literal home, it's wherever someone pauses, a
café, a park bench.

Memorama sat inside a bigger structure too, a 5E model (Entice, Enter, Engage, Exit, Extend) adapted
from experience-design literature, tying the walk to onboarding and to what happens after someone
finishes it.

<figure class="my-[2ch]">
  <img src="/img/arCityExploration/raubkunst_memorama.png" alt="Memorama Framework diagram" class="w-full" loading="lazy" />
  <figcaption class="text-teletext-green text-teletext-sm mt-[0.5ch]">
    The Memorama framework: Navigation, Discovery and Home spaces.
  </figcaption>
</figure>

## Prototype

The prototype ran on Unity3D and Vuforia. Benji handled engineering; my part was prototyping the
experience across Unity3D and Figma. The final build had two Discovery Spaces, two Navigation Spaces
and two findable artworks, tested on location in Frankfurt's Neue Altstadt.

The tested episode, Kontrollmädchen, was grounded in the real history of state-licensed prostitution
in early-20th-century Germany, threaded into the story's 1937 Degenerate Art exhibition arc. We cast
a friend to voice the narrator, recorded it in Cologne, and processed it in Steinberg's Nuendo.

<figure class="my-[2ch]">
  <img src="/img/arCityExploration/raubkunst_appscreens.webp" alt="Raubkunst app screens" class="w-full" loading="lazy" />
  <figcaption class="text-teletext-green text-teletext-sm mt-[0.5ch]">
    App screens for the Raubkunst prototype.
  </figcaption>
</figure>

<figure class="my-[2ch]">
  <div class="aspect-video">
    <iframe
      width="100%"
      height="100%"
      src="https://www.youtube.com/embed/sccf2EZheEw"
      title="Story Introduction AR Installation"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowfullscreen
      loading="lazy"
      class="border border-teletext-white/20"
    ></iframe>
  </div>
  <figcaption class="text-teletext-green text-teletext-sm mt-[0.5ch]">
    AR installation that can be triggered anywhere.
  </figcaption>
</figure>

<figure class="my-[2ch]">
  <div class="aspect-video">
    <iframe
      width="100%"
      height="100%"
      src="https://www.youtube.com/embed/zotKldUVY_w"
      title="Navigation Experience Prototype"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowfullscreen
      loading="lazy"
      class="border border-teletext-white/20"
    ></iframe>
  </div>
  <figcaption class="text-teletext-green text-teletext-sm mt-[0.5ch]">
    Navigation experience prototype.
  </figcaption>
</figure>

## Testing

We ran an Early Concept Test on May 17, 2018: seven participants, ages 19 to 30, mostly students from
the Frankfurt area, most with little or no AR experience. Four sessions, solo, pairs, one trio, about
30 minutes each, covering all three prototype phases: Puzzle, Navigation, AR-Searching. We recorded
it all, script, audio, video, photos, pre- and post-interviews.

<figure class="my-[2ch]">
  <img src="/img/arCityExploration/raubkunst_guerilla_testing.jpg" alt="User testing AR at a Frankfurt monument" class="w-full" loading="lazy" />
  <figcaption class="text-teletext-green text-teletext-sm mt-[0.5ch]">
    Guerrilla testing: a participant triggers an AR installation at a Frankfurt monument.
  </figcaption>
</figure>

People liked it. They learned something about Frankfurt, found new places, had fun, and it worked as
a team activity. Navigation landed especially well, participants called it fun and playful, and it
reminded some of them of games from childhood.

AR-Searching didn't. It was the hardest phase by far: people weren't sure how to search with the
camera at all, some never opened it, others missed the spot entirely. One safety issue came up too, a
participant crossed a street without checking traffic, too absorbed in the phone screen to look up.

That test set the direction for the rest of the build: keep Navigation close to unchanged, rebuild
AR-Searching from scratch, and tighten how the story itself got told.

A second, smaller round, the Diorama Tests, checked one Discovery Space room on its own. Version 1
had two problems: nobody understood why they'd just collected an object, there was no clear
call-to-action, and the audio ran too long, people stopped listening after a few seconds. Version 2
fixed both: a bigger room, the audio trigger moved, and a proximity condition added so sound only
played when someone was actually close enough for it to matter.

My own sound design turned up a finding worth owning. Each sound worked fine on its own, isolated,
people found the source easily, but layered together they felt overwhelming, and most participants
couldn't follow the story audio while also examining the visual artifacts. There was no clear cue for
which sound was active, so attention split instead of building.

## Outcome

The prototype showed at the Frankfurt Book Fair 2018, running in front of the public rather than a
thesis committee only. Memorama held up as a framework, and the iOS prototype demonstrated it end to
end.

The May 2018 test is the clearest proof of that: Navigation worked close to as designed, AR-Searching
didn't and had to be rebuilt, and the street-crossing incident was a reminder that AR asks people to
split attention between a screen and the world around them. Five people, a fixed thesis timeline, and
a working AR prototype pushed hard enough on strangers to find where it broke, and rebuilt from
there.
