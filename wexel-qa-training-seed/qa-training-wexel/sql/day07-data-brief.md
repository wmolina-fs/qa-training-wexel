# Day 7 — Reconciliation and test data (self-administered, no EM send)

## Part 1 — "Finance says 14, the portal says 12"

Finance's October report says **14 policies renewed in October 2026**. The agency portal's renewal widget says **12**. The finance team works in Manila time. The portal widget runs this query:

```sql
SELECT COUNT(DISTINCT r.policy_id)
FROM renewals r JOIN policies p ON p.id = r.policy_id
WHERE r.renewed_at_utc >= '2026-10-01' AND r.renewed_at_utc < '2026-11-01'
  AND p.status = 'Active' AND p.deleted_at_utc IS NULL;
```

1. Write down your hypotheses before querying (at least three).
2. Test each hypothesis with a query. Compare **renewal ids and policy ids**, not only the totals.
3. Decide what the right number is and why. It may be neither 14 nor 12.
4. Write a reply to the finance lead and a bug report for whichever query or data is wrong (use `communication/structure.md`). If there is a second defect hiding in the data, report it too.

## Part 2 — Build test data you can repeat

Tomorrow's regression needs four policies, each in a known state:

| State | Definition |
|---|---|
| S1 Renewed, no lapse | Active policy with a renewal row dated within the 30 days before its `term_end` (renewed before the term ran out) |
| S2 Lapsed | Status Lapsed, term end in the past, no renewal |
| S3 Active with an open claim | Active policy with one Open claim |
| S4 Three roommates | Active policy with `roommates = 3` |

1. Make a copy of the database: `sql/covernest-test.db`. Never change `covernest.db`.
2. Write `sql/seed_states.sql` that creates S1–S4 with fictional customers. Tag every row you create so it can be found and removed: use `source = 'qa-<run id>'` on policies and an email domain of `@qa.covernest.test` on customers.
3. Write `sql/reset_states.sql` that removes exactly what the seed created (child rows first) and nothing else.
4. Prove it: run seed → check → reset → check → seed again. Record row counts per table at each step in `sql/day07-test-data.md`.
5. In three or four lines: how you would create the same four states through the API instead of SQL, and when you would choose that.

## Deliverable

PR with `sql/day07-reconciliation.sql`, `sql/day07-findings.md` (reply to finance + bug reports), `sql/seed_states.sql`, `sql/reset_states.sql`, `sql/day07-test-data.md`.
