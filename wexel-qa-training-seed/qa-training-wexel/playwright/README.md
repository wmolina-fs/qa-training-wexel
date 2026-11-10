# Day 9 — Playwright + TypeScript API and UI tests for CoverNest

```
cd playwright
npm install
npx playwright install chromium   # once, for the UI tests
npx playwright test               # starts the sandbox automatically (see playwright.config.ts)
npx playwright show-report
```

- `tests/examples.spec.ts` — three worked examples (two API, one UI). They pass.
- `tests/todo.spec.ts` — tests for you to write: two API (TODO 1 is data-driven over the required fields) and three UI (TODO 5 mocks a failing response with `page.route`). Expected results come from `sandbox/README.md`.
- `tests/helpers.ts` — API login helper and the README pricing rules as a function.
- `tests/pages/quote-page.ts` — Page Object for the quote page (`/ui`). `fieldError()` is yours to finish.
- `ai-generated/quote.ai.spec.ts` — a file an AI assistant wrote and reported as "7 passed". Copy it into `tests/`, run it, then review it (Day 9 card). It is not run by default.

Rule for this repo: when a test fails because the sandbox breaks the README, keep the assertion, mark the test with `test.fail(true, '<bug id>: <one line>')`, and link your bug report. Never change an expected value to match what the API returns.

Repo bar for your PR: no hard-coded base URL or password (use `playwright.config.ts` and the helpers), log in through the helper or the Page Object, name each test for the behaviour it checks, use role/label/test-id locators, and no fixed waits (`waitForTimeout`).
