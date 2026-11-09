// @ts-check
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  testMatch: '**/*.js',
  timeout: 60_000,
  // The public demo site can be slow - give assertions a bit longer than the 5s default
  expect: { timeout: 10_000 },
  fullyParallel: true,
  // The public demo site is occasionally slow, so retry a failed test once locally (twice on CI)
  retries: process.env.CI ? 2 : 1,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    baseURL: 'https://ecommerce-playground.lambdatest.io',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
