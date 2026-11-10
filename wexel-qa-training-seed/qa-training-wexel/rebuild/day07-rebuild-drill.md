# Day 7 — Rebuild drill (45 minutes, recorded, no AI)

Your own bootcamp's Friday drill, done on the CoverNest quote page. Empty folder to passing tests against the clock. Docs are fine (playwright.dev); AI tools and copying from `playwright/` are not. Type it. Screen recording on from the empty folder to the last test run; put the link in today's EOD.

1. Create `rebuild/day07/` and start a new Playwright + TypeScript project there (`npm init playwright@latest`).
2. In its `playwright.config.ts`: `baseURL` `http://localhost:4030` and a `webServer` that runs `node ../../sandbox/server.js`.
3. A Page Object for the quote page (`/ui`, spec in `sandbox/README.md`, "Quote page (UI)").
4. A custom fixture (`test.extend`) that gives each test the Page Object.
5. Three UI tests, all passing:
   - a wrong password shows "Invalid username or password";
   - `ana.agent` signs in and sees "Signed in as Ana Reyes …";
   - `ana.agent` requests a quote for ZIP 94107, coverage 40,000, deductible 1,000, 1 roommate and sees the annual and monthly premium the README pricing rules give.
6. Stop at **45 minutes** even if you are not done. Commit what you have and write your start time, finish time and what is left in `rebuild/day07/README.md`.

Partial is fine: the time and what you finished are the result. It goes in the same PR as Day 7's work.
