# Day 5 — Load test brief (self-administered, no EM send)

**Question from the PM:** "Open enrollment starts next month and adjusters expect about twice today's search traffic, around 10 people searching at once. Will claims search hold up?"

The requirement is in `sandbox/README.md` under Claims: at 10 concurrent users, `/claims/search` keeps **p95 under 300 ms** and **error rate under 1%**.

## Steps

1. Install k6 (Windows: `winget install k6 --source winget`, or the MSI from the k6 install page). Check with `k6 version`.
2. Finish the TODOs in `load/search-load.js`. Thresholds must encode the requirement, so k6 itself reports pass or fail. Do not change the randomized think time.
3. Restart the sandbox, then do four separate runs, one user level each: `-e VUS=1` (baseline), `-e VUS=5`, `-e VUS=10` (the requirement) and `-e VUS=20` (to see where it breaks).
4. Record for each run: requests, p50, p90, p95, max, error rate, and which thresholds failed. The verdict uses the **10-user run** only.

## Deliverable (`load/day05-load-report.md`)

- **Workload model:** what one virtual user does and why that resembles an adjuster (requests per minute, think time, search terms).
- **Results table** for the four runs.
- **Reading:** where latency starts to climb, what the error responses were (status code and message), and the most likely bottleneck. Say what you would ask the developer to look at.
- **Verdict:** does search meet the requirement at 10 users? Pass or fail, with the number.
- Keep it within one page. The API quality report (Day 5 card) reuses this.
