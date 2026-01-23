// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  
  reporter: process.env.CI
    ? [
        ['dot'], 
        ['html', {outputFolder: 'reports/playwright'}], 
        ['junit', {outputFile: 'reports/junit/results.xml'}]
      ]
    : [
        ['list'], 
        ['html', {outputFolder: 'reports/playwright'}]
      ],

  use: {
    trace: 'on-first-retry',
  },
  expect: {
    timeout: 10_000,
  },
  /* Configure projects for major browsers */
  projects: [
    {
      name: "setup",
      testMatch: /.*\.setup\.ts/,
      use: {
        storageState: { cookies: [], origins: []},
      },
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});

