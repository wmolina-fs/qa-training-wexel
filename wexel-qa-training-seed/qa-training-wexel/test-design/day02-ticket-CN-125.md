# Day 2 — Practice ticket CN-125 (self-administered, no EM send)

Use this ticket for today's test design. You cannot ask the BA: write each question down with the default you will assume. The worked amounts use the CoverNest pricing rules in `sandbox/README.md`.

---

## TICKET CN-125: Renewals — loyalty credit and deductible change at renewal

**User story.** As a long-standing policyholder, I want a loyalty credit at renewal and the option to change my deductible, so that staying with CoverNest is worth it.

**Acceptance criteria**

- **AC1** At renewal, a policyholder with **2 or more consecutive years** with CoverNest and **no paid claim in the last 12 months** gets a loyalty credit of **5%** off the renewal annual premium. With **3 or more** consecutive years the credit is **8%**.
- **AC2** The credit is capped at **$40.00** per renewal.
- **AC3** The policyholder may change the deductible (500, 1000, 2500) at renewal. The credit is calculated **after** the new deductible factor is applied.
- **AC4** Roommate and pet fees are **not** discounted. The credit applies to the coverage part of the premium only.
- **AC5** The renewal offer is sent 30 days before the term end. The policyholder can accept until the term end date. After that the policy lapses.
- **AC6** The renewal offer email shows the old premium, the new premium, the credit amount and the deductible.

**Notes.** Amounts rounded to the cent. Dates in the policy state's time zone. "Consecutive years" is counted at the term end date.

**Reference policies for worked amounts**

| Policy | ZIP | Limit | Deductible now | Roommates | Pets | Years with CoverNest at term end | Paid claims, last 12 months |
|---|---|---|---|---|---|---|---|
| CN-710001 | 94107 | 40,000 | 1,000 | 1 | No | 2 | None |
| CN-710002 | 60614 | 80,000 | 500 | 0 | Yes | 3 | None |
| CN-710003 | 30301 | 25,000 | 500 | 0 | No | 4 | One paid claim, 11 months ago |
| CN-710004 | 94107 | 100,000 | 2,500 | 2 | No | 3 | None (one denied claim) |

## Deliverable (`test-design/day02-CN-125.md`)

1. Questions and assumptions log (question · why it matters · default you assume).
2. A **decision table** for credit eligibility (years × paid-claim status × any other condition you find), with one test per column.
3. Boundary values for years, the cap, and the acceptance window, each with an exact expected result.
4. **Worked expected amounts** for all four reference policies, with and without a deductible change to 2,500.
5. **Top 8** for a 45-minute first pass, ranked, each with its test level (API, UI, database, email) and one line of risk reasoning.
6. **Not running, and why**, with the risk you accept.
