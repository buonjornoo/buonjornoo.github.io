# CONCEPT

## What this site is

**siebrands.com is a Ceefax simulator, not a retro-styled portfolio.**

Every design decision follows from that sentence. The screen is a 1980s
teletext receiver: eight colours, one pixel font (Bedstead), scanlines, a
ticking clock in the masthead. The aesthetic is not decoration applied to a
normal portfolio — it is the medium itself.

## Navigation model

The **page-number system is the navigation model**. Every page has a
three-digit number (`100` Home, `200` Projects, `300` Blog, `400` Contact,
`2xx` individual projects). Visitors type the number on a keyboard or the
on-screen remote; the buffer fills green, rolls to the target, and the page
loads. There is no traditional nav bar and never will be. Fastext colour keys
(red/green/yellow/cyan) are the four shortcuts, exactly as on a real TV.

The route table lives in `src/data/pageRoutes.json`.

## Prime rule

> **chrome may be maximalist; content must get out of the way.**

The frame — header, Fastext bar, remote control, scanlines — can be as loud
as broadcast television demands. But the content a page exists to deliver is
typeset inside an 80-column measure on black, high-contrast, no animation of
its own. When chrome and content compete, content wins.

## Glossary

Shared vocabulary is seeded in [CONTEXT.md](CONTEXT.md) and maintained
lazily via `/domain-modeling`.
