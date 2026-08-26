# CONTEXT

Domain vocabulary for siebrands.com. One line per term; maintained lazily
via `/domain-modeling`. See [CONCEPT.md](CONCEPT.md) for what the site is.

- **Fastext**: the four colour-key links fixed to the bottom of every page (red=Home 100, green=Projects 200, yellow=Blog 300, cyan=Contact 400), mirroring a real teletext remote.
- **Page number**: the three-digit address of a page (100=Home, 200=Projects, 201–210 individual projects, 300=Blog, 400=Contact); typed anywhere to navigate; mapped in `src/data/pageRoutes.json`.
- **Magazine**: teletext term for a top-level section grouping pages by number range (2xx projects, 3xx blog); the site's equivalent of a section.
- **Chrome**: everything that frames the simulator — Ceefax header, Fastext bar, remote control, scanline overlay; maximalist by design.
- **Content**: the prose and media a page delivers; set in an 80ch measure on black, must get out of the way (prime rule).
- **Curated**: currently part of the site's visible lineup — chosen for the story the portfolio tells now (contrast: archived).
- **Archived**: kept reachable at its URL but withdrawn from curation and cross-links; nothing is archived since the Aug-2026 overhaul.
- **Directory**: a planned index page (101) listing pages by number, like teletext's index pages; see issues/09.
- **Buffer**: the display holding digits as they are typed — green while typing, yellow while navigating, red flash + reset for unmapped numbers.
- **Roll**: the counting animation of the page number from current to target over ~400ms before navigating (skipped under prefers-reduced-motion).
