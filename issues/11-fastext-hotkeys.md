# 11 — Fastext Hotkeys + Contextual Arrows + ADR 0002

| Field | Value |
|---|---|
| **Type** | AFK |
| **Blocked by** | 10 (the `◀ n · n ▶` affordance reads its neighbours from 10's sequence walk) |
| **Target Modules** | `src/layouts/BaseLayout.astro` inline script, `src/components/teletext/RemoteControl.astro` (mnemonic reconciliation), Fastext footer affordance, `docs/adr/0002-fastext-stays-fixed.md` (create) |
| **Source** | `docs/PLAN-teletext-system.md` Phase 4 item 11 + Documentation section |
| **Status** | ready-for-agent |

## What to build

Keyboard shortcuts for the four colour slots: `r`/`g`/`y`/`c` navigate Home/Projects/Blog/Contact. **The four destinations stay fixed on all pages** — making them contextual would mean Contact stops being one keystroke away from wherever a hiring manager is standing. The contextual layer lives on the arrows instead: a small `◀ 203 · 205 ▶` affordance above the Fastext bar showing the previous/next neighbours from 10's walk.

**Mnemonic reconciliation:** the remote rail's letter badges are currently H/P/B/C (`RemoteControl.astro:11-14`) while the new hotkeys are r/g/y/c. Reconcile into one consistent system across rail and footer — exact treatment settled with designer review, but post-change there must be a single mental model, not two competing mnemonics.

**Write ADR 0002 (`docs/adr/0002-fastext-stays-fixed.md`) in this ticket:** why the four colour slots do not go contextual while the arrows do.

## Acceptance criteria

- [ ] `r`/`g`/`y`/`c` navigate to `/`, `/projects/`, `/blog/`, `/contact/` from every BaseLayout page
- [ ] Hotkeys can never hijack the game: page 210 loads no nav script (07's static chrome), so Kaboom keeps `r`/`escape`
- [ ] Affordance shows the correct wrapped neighbours on every numbered page
- [ ] Rail + footer present one consistent mnemonic system after reconciliation
- [ ] ADR 0002 exists and records the fixed-vs-contextual decision with its reasoning
- [ ] `npm run check` && `npm run build` green

## Boundaries

**In:** four hotkeys, neighbour affordance, mnemonic cleanup, one ADR.
**Out:** making Fastext destinations contextual (rejected — see ADR) · sequential paging itself (10) · key-sync animation (14) · new colours/fonts (N7).

## Global gates

`npm run check` + `npm run build` green · designer-agent review (affordance placement, mnemonics) · user approves the diff · **user explicitly triggers any push to main.**
