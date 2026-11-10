# Day 3 — Release R-2026.48: regression selection (self-administered, no EM send)

**Situation.** CoverNest ships release R-2026.48 on **Wednesday**. You have **4 hours** of regression time on Tuesday. On **Monday night** a hotfix (CN-142) is added to the same release. The full regression inventory below takes about 10½ hours. You cannot run all of it.

## Changes in the release

| Ticket | Change | Developer note |
|---|---|---|
| CN-131 | Rate table **v8** for territory **T2**: rate 0.0100 → 0.0098. Applies to quotes created on or after release. Existing policies keep their rate until renewal | "Rate lookup now reads `rate_table_version` from config, not a constant" |
| CN-133 | Monthly premium rounding: round **once** at the end (half-up) instead of rounding each fee separately | "Shared `money.round()` helper, used by quote, convert, renewal and the premium-adjustment job" |
| CN-137 | New optional field `preferredContact` (email or SMS) on the customer profile | "UI and API only, nullable column" |
| CN-140 | Copy change in the quote confirmation email | "Template text only" |
| CN-142 (hotfix, Monday night) | Claims search timeout 5 s → 10 s, and a new index on `claims.cause` | "Customers were getting timeouts in search" |

## Regression inventory (estimated minutes)

| ID | Test | Level | Min |
|---|---|---|---|
| R01 | Quote premium, T1, all deductibles | API | 20 |
| R02 | Quote premium, T2, all deductibles | API | 20 |
| R03 | Quote premium, T3, all deductibles | API | 20 |
| R04 | Quote with roommates and pets fees | API | 15 |
| R05 | Quote validation (zip, limits, deductible, roommates) | API | 25 |
| R06 | Quote in Customer Portal end to end | UI | 25 |
| R07 | Quote in Agent Portal end to end | UI | 25 |
| R08 | Convert quote to policy, first premium | API | 20 |
| R09 | Convert: idempotency, expired quote, other agency | API | 20 |
| R10 | Policy list and detail views | UI | 20 |
| R11 | Cancel policy (agent) and role checks | API | 15 |
| R12 | Renewal offer generation and premium | Batch + DB | 30 |
| R13 | Premium adjustment job (mid-term changes) | Batch + DB | 30 |
| R14 | Monthly payment run amounts | Batch + DB | 30 |
| R15 | Claims: create and view | UI | 20 |
| R16 | Claims search by cause and id | API | 15 |
| R17 | Claims search response time at 10 users | Load | 30 |
| R18 | Customer profile edit | UI | 20 |
| R19 | Password reset | UI | 15 |
| R20 | Document upload (proof of address) | UI | 20 |
| R21 | Quote confirmation email | Email | 10 |
| R22 | Renewal offer email | Email | 10 |
| R23 | Cancellation email | Email | 10 |
| R24 | CSR read-only access across screens | UI | 25 |
| R25 | Agency A vs agency B data isolation | API | 20 |
| R26 | Reports: premium written per agency | DB | 25 |
| R27 | Accessibility smoke (keyboard, labels) on quote form | UI | 20 |
| R28 | Cross-browser smoke (Chrome, Safari, Edge) | UI | 30 |
| R29 | Mobile smoke, claim creation with photo | UI | 25 |
| R30 | Login and session expiry | UI | 15 |

## Deliverable (`regression/day03-R2026-48.md`)

1. **Impact map.** For each change: the flows it can break, and a risk rating (impact × likelihood) with one line of reasoning.
2. **Questions for the developer** (5 or more) that would change what you run.
3. **Run list for Tuesday** within 240 minutes: ranked, with level and minutes. Say where you would cut an inventory test down to a smaller check instead of running it whole.
4. **Monday-night update.** What you drop to make room for CN-142, and why.
5. **Not running, and why.** Every inventory test you skip, with the risk you accept.
6. **Note to the PM** (150 words or less) using `communication/structure.md`: what is covered, what is not, the residual risk, and the decision you need.
7. **Automation picks** (`regression/AUTOMATION-CANDIDATES.md`): from the inventory, the 5 tests you would automate first and 2 you never would, each judged by run frequency, risk, stability and upkeep cost.
