# qa-training-wexel — FS Learning Training Plan 1 (Wexel Gyles Molina)

Training repository for a 10-day plan. Everything here is fictional training material: no client data, no real credentials.

| Folder | What it is | Used on |
|---|---|---|
| `sandbox/` | CoverNest Renters Insurance API and quote page (`/ui`), Node.js, no dependencies. `README.md` is the specification | Day 1 onward |
| `test-design/` | Practice ticket CN-125; a junior's CN-125 draft and the peer-review brief | Day 2, Day 6 |
| `regression/` | Release R-2026.48 change list and regression inventory | Day 3 (reused Day 9) |
| `load/` | k6 starter script and brief | Day 5 |
| `sql/` | `covernest.db` (SQLite), schema, Day 6 drills (with SOQL), Day 7 brief | Day 1 (Rubric C), Days 6–7 |
| `defects/` | Day 8 isolation brief; your bug reports go here | Days 4–8 |
| `ai-eval/` | Day 8 AI evaluation brief | Day 8 |
| `communication/` | How to explain a finding (claim, evidence, impact, ask) | Every written note |
| `kata/` | Day 6 TypeScript kata (from your own bootcamp list) | Day 6 |
| `rebuild/` | Day 7 rebuild drill brief; you build `rebuild/day07/` from an empty folder | Day 7 |
| `playwright/` | Playwright + TypeScript starter (API and UI, Page Object) with worked examples and TODOs | Day 9 |
| `.github/workflows/ci.yml` | CI scaffold (layout check). You add the Playwright job on Day 9 | Day 1, Day 9 |

## Rules

- `main` is protected. Every change goes through a pull request named after the day (`day-04-postman`, …).
- The sandbox README is the specification. Expected results come from it, never from what the API returns.
- Never edit `sql/covernest.db`. Make copies for anything that writes data.
- AI tools are fine for daily work. Say in the PR description what an AI tool produced and what you checked. AI tools are not allowed in the Day 1 and Day 10 recorded windows.
