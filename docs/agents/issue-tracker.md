# Issue Tracker

**Tracker:** Local markdown — **`issues/`** in the repo root
**Decided:** 2026-08-25 (Linear considered; deferred — see "Linear mirror" below)

## How skills use it

Skills like `to-tickets`, `to-spec`, `triage`, and `implement` treat this repo's `issues/` folder as the tracker:

- One file per ticket: `issues/<NN>-<slug>.md`, numbered in dependency order (blockers first).
- Each file carries a structured header: Title, Type (`AFK` / `Human-in-the-loop`), Blocked by (ticket numbers/titles or "None"), Target Modules, Status.
- Triage roles are expressed in each ticket's `Status:` line using the label vocabulary in `triage-labels.md` (e.g. `Status: ready-for-agent`).
- Work the frontier: any ticket whose blockers are all complete. Never close or modify the parent planning document when publishing tickets.
- When a parent document's slices have all shipped, delete it and inline anything still binding into the tickets that need it — a spent plan left in `docs/` misleads later sessions.

## Current ticket set

`01-kion-case-study-tracer` … `06-subtitle-payoffs`. **02–06 are shipped and deployed** (`8792f68`); only `01` is open, at its Phase-A draft gate with the user. Their parent, `docs/PRD-portfolio-overhaul.md`, was deleted 2026-08-26 — its binding negative decisions (N1–N9) and testing/confidentiality posture now live inside `issues/01`. Dependency edges live in each file's header.

The teletext-system set **07–18** was filed 2026-08-26 from `docs/PLAN-teletext-system.md` (kept unmodified as parent reference). Numbers preserve the plan's own naming: plan-phase-1 was split three ways into **07** (live defects + CONCEPT.md/CONTEXT.md seed), **16** (dead code + React removal) and **17** (page-number drift guard); the plan's 08–15 kept their numbers; **18** (image weight/dimensions) was added later, so execution order follows each file's `Blocked by` header rather than numeric order. Existing issue 01 (KION) is now blocked by 08. Frontier at filing: 07, 08, 12, 13, 14, 15, 16, 17 can start immediately (13/14 honour the BaseLayout file-lock after 11); 09 and 01 wait on 08; 10 waits on 07+17; 11 waits on 10; 18 waits on 15.

## Not Linear

A Linear project named `siebrandsdotcom` exists (team JOR, created 2026-08-25) but is **empty and deliberately unused** — decided 2026-08-26. Local markdown under `issues/` is the only tracker. Do not file tickets there, do not mirror `issues/` into it, and do not treat its emptiness as a sign that work is untracked. (The sibling `table-hunter` project IS live in Linear; that's a different repo.)

## Hard process rule (unchanged)

Tracker state never authorizes a deploy. Nothing merges or deploys without the user's explicit approval.

---

## Linear mirror (optional, not active)

If native Linear tracking is wanted later:

1. Create `.mcp.json` at repo root:
   ```json
   { "mcpServers": { "linear": { "type": "http", "url": "https://mcp.linear.app/mcp" } } }
   ```
2. Restart Claude Code; approve the server-trust prompt; complete OAuth.
3. Target project already exists in the workspace: **"siebrandsdotcom"** (empty).
4. Publish one Linear issue per ticket in dependency order, wire native blocking relations, apply `ready-for-agent`, then add each Linear ID back into the matching file's header (`Linear: SIE-…`) so both surfaces stay reconcilable.
5. Update this file to flip the tracker-of-record to Linear.

Until then this section stays dormant and `issues/` remains authoritative.
