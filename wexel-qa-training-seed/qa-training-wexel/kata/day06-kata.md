# Day 6 — TypeScript kata (30 minutes, recorded, no AI)

Two problems from your own bootcamp live-coding list (#9 and #11). Plain TypeScript, no AI tools, docs are fine. Screen recording on; put the link in today's EOD. Write both in `kata/day06-kata.mts` (the `.mts` extension lets top-level `await` run) and run it with `npx tsx kata/day06-kata.mts`. Paste the console output as a comment at the bottom of the file.

## Problem 1 — In-stock names and total value (your #9)

An inventory API returned this response:

```json
[
  { "sku": "PL-01", "name": "Combination pliers", "inStock": true,  "quantity": 12, "unitPrice": 14.15 },
  { "sku": "HM-02", "name": "Claw hammer",        "inStock": false, "quantity": 0,  "unitPrice": 22.50 },
  { "sku": "SD-03", "name": "Screwdriver set",    "inStock": true,  "quantity": 3,  "unitPrice": 19.99 },
  { "sku": "TM-04", "name": "Tape measure",       "inStock": true,  "quantity": 7,  "unitPrice": 8.35 },
  { "sku": "WR-05", "name": "Adjustable wrench",  "inStock": true,  "quantity": 0,  "unitPrice": 17.10 },
  { "sku": "SW-06", "name": "Hand saw",           "inStock": false, "quantity": 4,  "unitPrice": 24.00 }
]
```

An item counts as **in stock** only when `inStock` is `true` **and** `quantity` is greater than 0.

Write `summarizeStock(items)` that returns `{ names, totalValue }`: the in-stock names in response order, and the total of `quantity × unitPrice` for those items, rounded to the cent. Describe the item with an `interface`; do not use `any`.

## Problem 2 — Retry an async function (your #11)

Write `retry<T>(fn: () => Promise<T>, times: number): Promise<T>` that calls `fn` until it succeeds, at most `times` times, and rethrows the **last** error if every attempt fails. Use this to check it:

```ts
let calls = 0;
async function flaky(): Promise<string> {
  calls++;
  if (calls < 3) throw new Error(`fail #${calls}`);
  return 'ok';
}

console.log(await retry(flaky, 3), calls);   // run 1
calls = 0;
try { await retry(flaky, 2); } catch (e) { console.log((e as Error).message, calls); }   // run 2
```
