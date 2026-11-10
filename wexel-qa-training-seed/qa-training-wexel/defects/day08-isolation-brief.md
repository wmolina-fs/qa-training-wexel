# Day 8, Part 1 — Isolate a price difference (self-administered, no EM send)

**Report from a customer, via the agent:** "I got a quote in the customer portal and then my agent quoted me the same thing. The agent's price was lower."

Reproduce it on the sandbox with these inputs, once as `ana.agent` and once as `cara.customer`:

| Case | zip | coverageLimit | deductible | roommates | petsOnPremises |
|---|---|---|---|---|---|
| X1 | 60614 | 30000 | 1000 | 1 | false |
| X2 | 30301 | 37000 | 1000 | 0 | false |

1. Record both responses in full. Work out the **expected** annual and monthly premium for each case by hand from the README pricing rules.
2. Compare layer by layer: the inputs each channel received, the fields in each response, the intermediate values (annual vs monthly), and the rule each number should follow.
3. There may be more than one cause. For each cause decide **configuration or code**, and write down the evidence that decides it. A guess without evidence scores as a guess.
4. Write one bug report per cause, and a 4-line note to the dev lead using `communication/structure.md`.

Deliverable: `defects/day08-isolation.md` (responses, hand calculation, comparison table, verdicts with evidence, bug reports, note).
