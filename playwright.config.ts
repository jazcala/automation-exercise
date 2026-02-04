import { defineConfig, devices } from '@playwright/test';
const GUEST_STATE = { cookies: [], origins: [] };
const LOGGED_IN_STATE = 'playwright/.auth/user.json';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'blob' : 'html',
  globalTeardown: require.resolve('./tests/global.teardown'),
  use: {
    baseURL: 'https://automationexercise.com',
    screenshot: 'only-on-failure',
    testIdAttribute: 'data-qa',
    trace: 'on-first-retry',
    extraHTTPHeaders: {
      'Accept': 'application/json',
    }
  },
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.02,
      threshold: 0.2,
    },
  },
  projects: [
    { name: 'setup', testMatch: /.*\.setup\.ts/ },
    { name: 'api-tests', testMatch: /.*\.api\.spec\.ts/ },

    // --- CHROMIUM (primary dev & fast feedback environment) ---
    {
      name: 'chromium-logged-in',
      testMatch: /.*\.logged\.spec\.ts/,
      dependencies: ['setup'],
      use: { ...devices['Desktop Chrome'], storageState: LOGGED_IN_STATE },
    },
    {
      name: 'chromium-guest',
      testMatch: [/tests\/auth\/.*\.spec\.ts/, /.*\.guest\.spec\.ts/],
      use: { ...devices['Desktop Chrome'], storageState: GUEST_STATE },
    },

    // --- REGRESSION (Firefox & Webkit - logged in user) ---
    {
      name: 'firefox-logged-in',
      testMatch: /.*\.logged\.spec\.ts/,
      dependencies: ['setup'],
      use: { ...devices['Desktop Firefox'], storageState: LOGGED_IN_STATE },
    },
    {
      name: 'webkit-logged-in',
      testMatch: /.*\.logged\.spec\.ts/,
      dependencies: ['setup'],
      use: { ...devices['Desktop Safari'], storageState: LOGGED_IN_STATE },
    },
    {
      name: 'visual-regression',
      testMatch: /tests\/visual\/.*\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        storageState: { cookies: [], origins: [] }, //as guest
      },
      grep: /@visual/,
    },
  ],
});
