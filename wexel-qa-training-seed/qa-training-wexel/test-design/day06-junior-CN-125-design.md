# CN-125 test design — draft for review

*Author: Mika (Junior QA, client team). Fictional training material written by your EM for the Day 6 peer review. It is not anyone's real work.*

> Hi! First time doing renewals. Can you review before I share it with the PO tomorrow? Thanks!

## Eligibility

| Case | Years with CoverNest | Claims in last 12 months | Expected credit |
|---|---|---|---|
| E1 | 2 | None | 5% |
| E2 | 3 | None | 8% |
| E3 | 4 | None | 8% |
| E4 | 3 | Any claim (paid or denied) | No credit |
| E5 | 2 | One paid claim | No credit |

## Calculation

Credit = credit % × current annual premium (before any deductible change). The renewal premium is the new annual premium minus the credit.

| Policy | Current annual | Credit | Renewal annual | With deductible → 2,500 |
|---|---|---|---|---|
| CN-710001 | 474.00 | 5% = 23.70 | 450.30 | 424.00 − 23.70 = 400.30 |
| CN-710002 | 836.00 | 8% = 66.88 | 769.12 | 676.00 − 66.88 = 609.12 |
| CN-710003 | 225.00 | none (paid claim) | 225.00 | 180.00 |
| CN-710004 | 1,048.00 | none (had a claim) | 1,048.00 | already 2,500 |

The credit is per customer, so a customer with two policies gets it once.

## Boundaries

- Years = 2 → 5%, years = 3 → 8%.
- Credit of $45 → still applied (needs checking with dev).
- Renewal accepted on the term end date → OK.

## Top 8 (first pass)

1. Renewal email shows old premium, new premium, credit and deductible (AC6)
2. Email subject line and branding
3. CN-710001 renewal amount
4. CN-710002 renewal amount
5. Deductible dropdown shows 500, 1000, 2500
6. CN-710003 gets no credit
7. Offer sent 30 days before term end
8. Premium should be correct after deductible change

## Not running

Everything else: later, if there is time.
