import { Locator, Page } from '@playwright/test';
import { PASSWORD } from '../helpers';

export type QuoteForm = {
  zip: string;
  coverageLimit: number;
  deductible: 500 | 1000 | 2500;
  roommates?: number;
  petsOnPremises?: boolean;
};

/** Page Object for the CoverNest quote page (sandbox/README.md, "Quote page (UI)"). */
export class QuotePage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto('/ui');
  }

  async signIn(username: string, password: string = PASSWORD) {
    await this.page.getByLabel('Username').fill(username);
    await this.page.getByLabel('Password').fill(password);
    await this.page.getByRole('button', { name: 'Sign in' }).click();
  }

  signInAlert(): Locator {
    return this.page.locator('#signin-alert');
  }

  formAlert(): Locator {
    return this.page.locator('#form-alert');
  }

  signedInAs(): Locator {
    return this.page.getByTestId('signed-in');
  }

  async requestQuote(q: QuoteForm) {
    await this.page.getByLabel('ZIP code').fill(q.zip);
    await this.page.getByLabel('Coverage limit').fill(String(q.coverageLimit));
    await this.page.getByLabel('Deductible').selectOption(String(q.deductible));
    await this.page.getByLabel('Roommates').fill(String(q.roommates ?? 0));
    await this.page.getByLabel('Pets on premises').setChecked(q.petsOnPremises ?? false);
    await this.page.getByRole('button', { name: 'Get quote' }).click();
  }

  result(): Locator {
    return this.page.getByTestId('quote-result');
  }

  annualPremium(): Locator {
    return this.page.getByTestId('annual-premium');
  }

  monthlyPremium(): Locator {
    return this.page.getByTestId('monthly-premium');
  }

  /** The input for a form field, by its API field name (zip, coverageLimit, deductible, roommates). */
  field(name: 'zip' | 'coverageLimit' | 'deductible' | 'roommates'): Locator {
    return this.page.locator(`#${name}`);
  }

  // TODO (Day 9): return the error message element shown under one form field.
  // Hint: each field's input points at its message with aria-describedby.
  fieldError(name: 'zip' | 'coverageLimit' | 'deductible' | 'roommates'): Locator {
    throw new Error(`TODO: implement QuotePage.fieldError('${name}')`);
  }
}

/** Formats an amount the way the README says the page must show it: $1,234.56 */
export function money(n: number): string {
  return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
