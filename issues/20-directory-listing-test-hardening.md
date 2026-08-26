# 20 — Directory Listing: harden the regression test and its own test helper

| Field | Value |
|---|---|
| **Type** | AFK |
| **Blocked by** | None (09 is shipped) |
| **Target Modules** | `tests/integration/directory-page.test.ts` |
| **Source** | `/code-review` on issue 09's fix commit (`e60a215`), 2026-08-26 — re-review of the label-drift + brittle-helper findings from the first pass. |
| **Status** | ready-for-agent |

## What to build

The fix commit for issue 09 (`e60a215`) closed both findings from the first review correctly — build green, 100/100 tests green, no scope creep. The re-review surfaced three follow-on items in the same file, none blocking, all worth cleaning up before the pattern gets copied elsewhere:

1. **`listingBlock()`'s new balanced-tag scan fails silently instead of loudly.** If the tag stream never rebalances (malformed markup, or `id="page-directory"` missing so `openTagStart` is `-1`), the loop exits with `end` still `-1`, and `html.slice(openTagStart, -1)` silently returns a slice of almost the whole document instead of the test failing with a clear error. This is the same "assumes the happy path, fails silently on deviation" shape as the bug the commit was fixing — just moved from "no nesting" to "no unclosed tag." Add a guard: `if (end === -1) throw new Error('listingBlock: unbalanced <div> or missing #page-directory')`.
2. **The new "Home + About" regression test only checks substring presence, not binding.** `expect(html).toContain('Home + About')` passes even if the string appeared anywhere else on the page — it doesn't confirm the label is bound to page number `100` specifically, unlike the sibling href-pairing test in the same file. Strengthen it to parse the row for `100` and assert its label, the same way the existing anchor-resolution test already does.
3. **The tag-scan regex doesn't skip HTML comments and can't handle a literal `>` inside an attribute value.** Neither case exists in current markup, so this is latent, not live. Note it as a known limitation in a one-line comment rather than fixing it now — fixing it is not worth the complexity at 7 static, non-nested entries.

## Deferred (judgement calls, not actioned — logged for a future session with more entries to justify the refactor)

- Page numbers as strings threaded through three lookup sources (`STATIC_LABELS` / `collectionLabels` / `pageRoutes.json`) — mild Primitive Obsession.
- The `{ number, url, label }` template-local triple — mild Data Clump.
- The `??`-chained label fallback — mild Repeated-Switches shape.
- Three different HTML-slicing strategies now live side by side in the test file (`listingBlock`'s tag scan, `headerBlock`'s `indexOf('</header>')` slice, `shippedRoutes()`'s regex-attribute extraction) — mild Duplicated Code; this ticket's own fix (item 1) adds to that pile rather than consolidating it. Revisit if a fourth slicing helper shows up.

None of the deferred items warrant restructuring at the current scale (7 static entries, one test file). Re-raise only if the listing grows enough that the duplication or primitive-typing actually causes a bug.

## Acceptance criteria

- [ ] `listingBlock()` throws a clear error instead of silently mis-slicing when the tag stream doesn't rebalance or the anchor id is missing
- [ ] The `"Home + About"` regression test asserts the label is bound to row `100`, not just present on the page
- [ ] A one-line comment documents the tag-scan's comment/attribute-`>` limitation
- [ ] No other test in the file is touched
- [ ] `npm run check` && `npm test` green

## Boundaries

**In:** `listingBlock()`'s failure mode, the one regression test's assertion strength, one documentation comment.
**Out:** the Deferred items above · `DirectoryListing.astro` component logic · `pageRoutes.json` · any other test file.

## Global gates

`npm run check` + `npm test` green · user approves the diff · **user explicitly triggers any push to main.**
