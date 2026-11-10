import { APIRequestContext, expect } from '@playwright/test';

export const PASSWORD = 'Train1ng!';

/** Logs in and returns an Authorization header for the given sandbox user. */
export async function authHeader(request: APIRequestContext, username: string): Promise<Record<string, string>> {
  const res = await request.post('/login', { data: { username, password: PASSWORD } });
  expect(res.status(), `login as ${username}`).toBe(200);
  const { token } = await res.json();
  return { Authorization: `Bearer ${token}` };
}

/** Expected premium from the README pricing rules (rate table v7, half-up monthly rounding). */
export function expectedPremium(q: { zip: string; coverageLimit: number; deductible: 500 | 1000 | 2500; roommates?: number; petsOnPremises?: boolean }) {
  const rate = q.zip.startsWith('9') ? 0.0125 : q.zip.startsWith('6') ? 0.01 : 0.009;
  const factor = { 500: 1.0, 1000: 0.9, 2500: 0.8 }[q.deductible];
  const cents = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;
  const annual = cents(q.coverageLimit * rate * factor + (q.roommates ?? 0) * 24 + (q.petsOnPremises ? 36 : 0));
  return { annualPremium: annual, monthlyPremium: cents(annual / 12) };
}
