import { test, expect } from '@playwright/test';
import { authHeader, expectedPremium } from './helpers';
import { QuotePage, money } from './pages/quote-page';

// Worked examples. All three pass against the sandbox. Read them, run them, then write tests/todo.spec.ts.

test('agent quote in T1 is priced by the README rules', async ({ request }) => {
  const headers = await authHeader(request, 'ana.agent');
  const input = { zip: '94107', coverageLimit: 40000, deductible: 1000 as const, roommates: 1 };

  const res = await request.post('/quotes', { headers, data: input });

  expect(res.status()).toBe(201);
  const body = await res.json();
  // Expected values come from the specification, never from a previous response.
  expect(body).toMatchObject({ ...expectedPremium(input), status: 'Open', rateTableVersion: 'v7' });
});

test('a CSR cannot create a quote', async ({ request }) => {
  const headers = await authHeader(request, 'dan.csr');

  const res = await request.post('/quotes', { headers, data: { zip: '30301', coverageLimit: 20000, deductible: 500 } });

  expect(res.status()).toBe(403);
  expect(await res.json()).toHaveProperty('error');
});

test('UI: an agent sees the README premium on the quote page', async ({ page }) => {
  const quote = new QuotePage(page);
  const input = { zip: '94107', coverageLimit: 40000, deductible: 1000 as const, roommates: 1 };

  await quote.goto();
  await quote.signIn('ana.agent');
  await expect(quote.signedInAs()).toHaveText(/^Signed in as Ana Reyes/);
  await quote.requestQuote(input);

  const expected = expectedPremium(input);
  await expect(quote.result()).toBeVisible();
  await expect(quote.annualPremium()).toHaveText(money(expected.annualPremium));
  await expect(quote.monthlyPremium()).toHaveText(money(expected.monthlyPremium));
});
