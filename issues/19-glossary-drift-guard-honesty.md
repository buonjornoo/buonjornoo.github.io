# 19 — Glossary Drift Guard: make the test's name match its assertion

| Field | Value |
|---|---|
| **Type** | AFK |
| **Blocked by** | **08** (the test this ticket corrects is introduced in 08's diff and is not yet committed — never run 19 while 08 is unmerged). Related to **17**, which owns the real map-vs-content drift guard. |
| **Target Modules** | `tests/integration/concept-docs.test.ts` (one test title; optionally its assertion) |
| **Source** | `/code-review` on issue 08 fixes, 2026-08-26 — Spec axis finding (a)2, raised against F8's resolution. |
| **Status** | ready-for-agent |

## What to build

Issue 08 closed F8 by adding a test to `tests/integration/concept-docs.test.ts`:

```ts
it('keeps the page-number entry current with the route map', () => {
  const md = readFileSync(join(root, 'CONTEXT.md'), 'utf-8');
  const entry = md.split('\n').find((line) => line.includes('**Page number**')) ?? '';
  expect(entry).toContain('102');
});
```

The assertion is correct and passes. **The title is not what it does** — it never opens `pageRoutes.json`, so it cannot detect drift between the glossary and the map. It asserts one substring.

The defect is the false claim, not the check. A future session greps the test names, reads "keeps the page-number entry current with the route map", concludes drift is covered, and doesn't write the real one. That is the same substitution of a claim for a verification that produced findings F1–F9 in the first place.

**Do the honest, minimal thing: rename the test to what it asserts.** For example `'lists 102 in the page-number entry'`.

### Why not build the real check here

Two reasons, both binding:

1. **A naive one-to-one comparison would be wrong.** The glossary line is a *landmark summary*, not a mirror of the map — `201–210 individual projects` is written as a range, not ten entries. A test that demanded every `pageRoutes.json` key appear literally would fail on correct prose.
2. **Issue 17 already owns drift.** Its scope is front matter ↔ `pageRoutes.json` at build time. If a docs-side glossary assertion is wanted, it belongs there, where the map is already parsed — not duplicated in a docs test.

If the implementer judges a stronger assertion is cheap and non-brittle (e.g. every standalone three-digit number appearing in the glossary line resolves in `pageRoutes.json` — catching an invented number without demanding completeness), that is in scope. Completeness in both directions is **not**.

## Acceptance criteria

- [ ] The test's title states only what it asserts; no test name in `concept-docs.test.ts` claims coverage the file does not have
- [ ] The 102 assertion still passes, and still goes red if `102` is removed from the CONTEXT.md **Page number** entry (mutation-check it)
- [ ] `CONTEXT.md` content unchanged
- [ ] No duplication of issue 17's build-time map assertion
- [ ] `npm run check` && `npm test` green

## Boundaries

**In:** one test title in `tests/integration/concept-docs.test.ts`; optionally a narrowed-scope assertion as described above.
**Out:** `CONTEXT.md` edits · `pageRoutes.json` edits · building the bidirectional glossary↔map check (17's territory) · touching any other test in the file · refactoring the repeated `readFileSync` calls.

## Global gates

`npm run check` + `npm test` green · mutation-check demonstrated · user approves the diff · **user explicitly triggers any push to main.**
