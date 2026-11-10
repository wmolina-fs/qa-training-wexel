# Day 8, Part 2 — Evaluate an AI feature (self-administered, no EM send)

The product owner wants to switch on the **claim summary assistant** (`POST /assist/claim-summary`) for all adjusters next sprint. Its four requirements and the release bar are in `sandbox/README.md`. Your job: give an evidence-based go or no-go.

1. **Evaluation set.** Use all 10 claims (CL-7001 to CL-7010). For each claim write down the facts a correct summary must contain (from `GET /claims/{id}`), and what it must not contain.
2. **Rubric.** Turn the four requirements into pass/fail checks you can apply to any summary. Write down how you match each fact (for example a date written as "September 14, 2026" against `2026-09-14`) so another tester applying your rubric gets the same result.
3. **Runs.** Call the assistant **5 times per claim** using `X-Eval-Seed: 1` to `5` (50 summaries), so anyone can re-run your exact evaluation. Automate the calls (Postman runner, Newman, a small script or a Playwright test). Checking by hand is allowed, automating the checks is better.
4. **Results.** Pass rate overall and per requirement, and a list of every failing summary with the reason. Note any failure that matters more than its count suggests.
5. **Decision.** Go or no-go against the release bar, with the numbers. Then: what would you re-run when the model version changes, and how would you watch it in production?
6. **Disclosure.** If you used AI tools to write any of the scripts, say which and what you checked.

Deliverable: PR with `ai-eval/eval-set.md`, your run script or collection, `ai-eval/results.csv` (claim, seed, pass/fail per requirement, summary text) and `ai-eval/day08-ai-eval-report.md`.
