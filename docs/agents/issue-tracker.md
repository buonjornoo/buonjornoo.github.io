# Issue Tracker

**Tracker:** Local markdown — **`issues/`** in the repo root
**Decided:** 2026-08-25 (Linear considered; deferred — see "Linear mirror" below)

## How skills use it

Skills like `to-tickets`, `to-spec`, `triage`, and `implement` treat this repo's `issues/` folder as the tracker:

- One file per ticket: `issues/<NN>-<slug>.md`, numbered in dependency order (blockers first).
- Each file carries a structured header: Title, Type (`AFK` / `Human-in-the-loop`), Blocked by (ticket numbers/titles or "None"), Target Modules, Status.
- Triage roles are expressed in each ticket's `Status:` line using the label vocabulary in `triage-labels.md` (e.g. `Status: ready-for-agent`).
- Work the frontier: any ticket whose blockers are all complete. Never close or modify parent documents (the PRD) when publishing tickets.

## Current ticket set

The active set is the portfolio-overhaul decomposition derived from `docs/PRD-portfolio-overhaul.md`: `01-kion-case-study-tracer` … `06-subtitle-payoffs`. Dependency edges live in each file's header.

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
