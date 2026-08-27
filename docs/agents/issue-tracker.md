# Issue Tracker

**Tracker:** Linear — project **`siebrandsdotcom`**, team **Jorne (JOR)**
**Decided:** 2026-08-25 (Linear considered, deferred); flipped to tracker-of-record 2026-08-27 once the account-level Linear MCP connection was available (no `.mcp.json` needed — see "History" below).

## How skills use it

Skills like `to-tickets`, `to-spec`, `triage`, and `implement` should treat the Linear `siebrandsdotcom` project as the tracker going forward:

- One Linear issue per ticket, titled `NN — <slug title>` (numbering preserved from the local-markdown era for continuity, not required for new tickets).
- Triage roles are expressed as Linear labels using the vocabulary in `triage-labels.md` (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`) — all five already exist as team-scoped labels on **Jorne**.
- State maps: shipped/deployed → `Done`; open/actionable → `Todo` (blocking is expressed via native Linear `blockedBy` relations, not by parking blocked tickets in `Backlog`).
- Work the frontier: any issue whose blockers are all `Done`.
- **Do not mix projects.** The `Jorne` team also holds the unrelated `table-hunter` project — always filter/create against `project: siebrandsdotcom` explicitly, never rely on team scope alone.

## Local markdown (`issues/*.md`) — historical record, not authoritative

The 20 tickets filed 2026-08-25/26 (`01-kion-case-study-tracer` … `20-directory-listing-test-hardening`) still live under `issues/` and each file now carries a `**Linear**` row in its header table linking to its mirrored issue (`JOR-45` … `JOR-64`). Keep these files as the detailed narrative record (review findings, locked copy, TDD logs) — Linear's description on each issue is a compressed summary, not a replacement. **Do not file new tickets as markdown files** — create them directly in Linear from now on. If a markdown file and its Linear issue ever disagree on state, Linear wins.

Dependency graph (native Linear `blockedBy`, mirrored from each file's old `Blocked by` header): 01←08, 03←02, 04←03, 05←04, 09←08, 10←07+17, 11←10, 13←11, 14←11, 18←15, 19←08 (related: 19↔17).

## Status at migration (2026-08-27)

Shipped/`Done`: 02, 03, 04, 05, 06, 07, 08, 09, 10, 12, 17 (all confirmed ancestors of `origin/main` via `git merge-base --is-ancestor` — several local files had stale "not deployed" status text that this migration corrected against actual git history, not against the files' own claims).
Open/`Todo`: 01 (`ready-for-human`, draft gate), 11, 13, 14, 15, 16, 18, 19, 20 (all `ready-for-agent`).

## Hard process rule (unchanged)

Tracker state never authorizes a deploy. Nothing merges or deploys without the user's explicit approval.

## History

A Linear project named `siebrandsdotcom` (team JOR) existed empty from 2026-08-25 pending a `.mcp.json` setup that was never done. On 2026-08-27 the account-level Linear MCP connection (`mcp__claude_ai_Linear__*`) turned out to already be authenticated, making the planned manual OAuth setup unnecessary — all 20 tickets were published directly, blocking relations wired, and Linear IDs written back into the local files' headers.
