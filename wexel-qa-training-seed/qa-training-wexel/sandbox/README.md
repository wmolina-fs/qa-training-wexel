# CoverNest Renters Insurance API — v1.0 (training sandbox)

This folder is a small practice API for your FS Learning training plan. It runs on your laptop, needs only Node.js, and resets its data every time you restart it.

**Test it as a black box.** Do not read `server.js` or `ui.html` to find problems: real client systems do not hand testers their source. A finding must be backed by a request and its response; a finding that cites a line of code instead counts as not found.

**This README is the specification.** The API has deliberate defects. Whenever the API and this README disagree, the README is right and you have found a bug. Write your expected results from this README, never from what the API happens to return.

## Run it

```
cd sandbox
node server.js
```

It listens on `http://localhost:4030` (set `PORT=xxxx` to change). Check `GET /health` → `200 {"ok": true, "version": "1.0.0"}`. The quote page (UI) is at `http://localhost:4030/ui`. The terminal prints one line per request with the status code and the time it took.

## Users

All passwords are `Train1ng!` (fictional, training only).

| Username | Role | Scope |
|---|---|---|
| `ana.agent` | agent | Northgate Agency (A1) |
| `ben.agent` | agent | Lakeside Agency (A2) |
| `cara.customer` | customer | Policyholder C100, agency A1 (policies CN-500100, CN-500102) |
| `dev.customer` | customer | Policyholder C101, agency A2 (policy CN-500101) |
| `dan.csr` | csr | Customer service rep. **Read-only** across all agencies |

## Authentication

- `POST /login` with `{"username": "...", "password": "..."}` → `200 {"token", "role", "displayName"}`. Wrong credentials → `401`.
- Every other endpoint (except `/health`) needs `Authorization: Bearer <token>`.
- No `Authorization` header → `401`. A token that is unknown or malformed → `401`.
- A signed-in user asking for something outside their scope gets `403` for actions their role can never do, and `404` for records that belong to another agency or customer (so the API does not reveal that the record exists).

## Error format

Every error response is JSON: `{"error": "<message>"}`, plus `"field": "<name>"` when one input field caused it. A request with a missing or invalid field is a client error and returns **`400`**. A `5xx` is never an acceptable answer to bad input.

## Quotes

### `POST /quotes`

Who: agents (for their own agency) and customers (for themselves). CSRs get `403`.

| Field | Rule |
|---|---|
| `zip` | Required. Exactly 5 digits, as a string |
| `coverageLimit` | Required. Whole number from **10,000 to 100,000 inclusive**, in steps of 1,000 |
| `deductible` | Required. One of 500, 1000, 2500 |
| `roommates` | Optional, default 0. Whole number from **0 to 3 inclusive** |
| `petsOnPremises` | Optional, default false. Boolean |
| `customerId` | Agents only, optional. Ignored for customers (taken from the token) |

**Pricing (rate table v7, the only current table).** The same inputs must give the same premium whichever channel (agent or customer) asks for it.

1. Territory from the first digit of the ZIP: `9` → T1, `6` → T2, anything else → T3.
2. Rate per dollar of coverage per year: T1 0.0125, T2 0.0100, T3 0.0090.
3. Deductible factor: 500 → 1.00, 1000 → 0.90, 2500 → 0.80.
4. `annualPremium = coverageLimit × rate × deductibleFactor + roommates × 24.00 + (petsOnPremises ? 36.00 : 0)`, rounded to the cent.
5. `monthlyPremium = annualPremium ÷ 12`, rounded **half-up** to the cent (0.005 rounds up).

Response `201` with the quote: `id`, the inputs, `annualPremium`, `monthlyPremium`, `rateTableVersion`, `channel`, `status: "Open"`, `createdAt`.

### `GET /quotes/{id}`

Agents see their agency's quotes, customers their own, CSRs all. Anything else → `404`.

### `POST /quotes/{id}/convert`

Turns a quote into a policy. Who: **agents of the agency that owns the quote**. Customers and CSRs → `403`. An agent of another agency → `404`.

- Header `Idempotency-Key: <any unique string>` is required (missing → `400`).
- **Retrying with the same key must not create a second policy.** The retry returns `200` with the policy created by the first call.
- Only `Open` quotes convert. A quote that is already `Converted` → `409`.
- A quote is valid for **30 days** from `createdAt`. An older quote → `409 {"error": "Quote expired"}`.
- Success → `201 {"policyNumber", "firstPremium", "status": "Active", "effectiveDate"}`. `firstPremium` equals the quote's `monthlyPremium`. The new policy must then be readable with `GET /policies/{policyNumber}` and appear in `GET /policies`.

## Policies

- `GET /policies?status=Active` — agents: their agency; customers: their own; CSRs: all.
- `GET /policies/{policyNumber}` — same scope rules; otherwise `404`.
- `PATCH /policies/{policyNumber}` with `{"status": "Cancelled"}` — **agents of the owning agency only**. Customers and CSRs → `403`. Only an `Active` policy can be cancelled; any other status → `409`.

## Claims

- `GET /claims/{id}` — scope follows the claim's policy.
- `GET /claims/search?q=<text>` — searches claim causes (case-insensitive) or an exact claim id, within the caller's scope.
- **Performance requirement:** at 10 concurrent users, `/claims/search` must keep **p95 response time under 300 ms** with an **error rate under 1%**.

## Claim summary assistant (AI feature)

`POST /assist/claim-summary` with `{"claimId": "CL-7001"}` → `200 {"claimId", "model", "summary"}`. Same scope rules as claims.

The summary is generated and **can differ between calls**. Product requirements for every summary:

1. States the policy number, the cause, the date of loss and the claimed amount, and each one matches the claim (`GET /claims/{id}`). Formatting may differ (for example `2026-09-14` vs "September 14, 2026", or `1840.5` vs "$1,840.50"); a different value may not.
2. Never names or refers to any other customer.
3. Never states or implies a coverage decision (for example "covered", "approved", "will be paid").
4. Is never empty.

Testing hook: send header `X-Eval-Seed: <number>` to make a call repeatable (the same seed and claim always give the same summary). Without the header every call can differ.

Release bar for the assistant (set by the product owner): **at least 95% of summaries meet all four requirements, and zero summaries name another customer.**

## Quote page (UI)

`GET /ui` serves a small quote page for agents and customers (open `http://localhost:4030/ui` in a browser).

1. **Sign in** with username and password. Wrong credentials show the API's message ("Invalid username or password") in the sign-in alert, and the quote form stays hidden.
2. After sign-in the page shows **"Signed in as <displayName>"** and the quote form: ZIP code, Coverage limit, Deductible, Roommates, Pets on premises, and a **Get quote** button.
3. On success the result panel shows the quote id, the **Annual premium** and the **Monthly premium**, formatted as `$1,234.56`, exactly as returned by `POST /quotes`. The page never calculates a premium itself.
4. On a `400`, the page shows the API's `error` message **under the field named in `field`**, marks that field invalid (`aria-invalid="true"`), and shows no result panel.
5. On any other error (another 4xx, or a 5xx), the page shows an alert in the form and no result panel.
