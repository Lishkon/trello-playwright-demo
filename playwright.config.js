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
    screenshot: 'only-on-failure',
    video: 'on'
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
      name: 'chromium-no-auth',
      testMatch: /login\.spec\.ts/i,
      use: {
        ...devices['Desktop Chrome'],
        storageState: {cookies:[], origins:[]},
      }
    },
    {
      name: 'chromium',
      dependencies:["setup"],
      testIgnore: /login\.spec\.ts/i,
      use: { 
        ...devices['Desktop Chrome'],
        storageState: "auth/atlassian-storage.json"   
      },
      
    },

    {
      name: 'firefox',
      dependencies:["setup"],
      testIgnore: /login\.spec\.ts/i,
      use: { 
        ...devices['Desktop Firefox'],
        storageState: "auth/atlassian-storage.json" 
      },
    },

    {
      name: 'webkit',
      dependencies:["setup"],
      testIgnore: /login\.spec\.ts/i,
      use: { 
        ...devices['Desktop Safari'] ,
        storageState: "auth/atlassian-storage.json"
      },
    },
  ],
});

