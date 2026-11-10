import { defineConfig } from '@playwright/test';

// Starts the CoverNest sandbox before the tests and stops it after.
// The sandbox resets its data on every start, so every run begins from the README's seed data.
export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: { baseURL: 'http://localhost:4030' },
  webServer: {
    command: 'node ../sandbox/server.js',
    url: 'http://localhost:4030/health',
    reuseExistingServer: !process.env.CI,
    timeout: 15_000,
  },
});
