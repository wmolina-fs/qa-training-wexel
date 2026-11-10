# How to explain a finding (use for every written note, the Day 5 video and the Day 10 walkthrough)

Four parts, in this order. One or two sentences each.

1. **Claim.** What is true, in one sentence a non-tester understands. "Customers in Chicago are quoted 5% more than agents quote them for the same cover."
2. **Evidence.** What you ran and what you saw: request, numbers, ids. "Same inputs, Q-1006 vs Q-1007: $24.50 vs $25.62 monthly. The customer quote carries rateTableVersion v6."
3. **Impact.** Who is affected, how much, how often. "Every customer-portal quote in territory T2. About $1.12 a month per policy."
4. **Ask.** The decision or action you need, from whom, by when. "Dev lead: confirm which rate table the customer channel should read, before Wednesday's release."

Rules:

- Say the number, not "a lot" or "some".
- Name the precise term (p95, 400, idempotency key, half-up) instead of describing around it.
- If you are not sure, say what you would check and how long it takes. Do not hedge with "usually" or "probably".
- When someone asks you a question, answer it first, then add context.
