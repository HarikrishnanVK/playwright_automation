import { PlaywrightTestConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const config: PlaywrightTestConfig = {
  testDir: './tests',
  testMatch: /.*bupa.spec.ts/,
  /* Maximum time one test can run for. */
  timeout: 360 * 1000,
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 30000
  },
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* no of parallels */
  workers: 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    actionTimeout: 5000,
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://localhost:3000',
  },

  /* Configure projects for major browsers */
  /* Test against branded browsers. */
  projects: [
    {
      name: 'Google Chrome',
      use: {
        headless: false,
        viewport: { width: 1920, height: 1080 },
        video: 'on',
        trace: 'on',
        screenshot: 'only-on-failure',
        browserName: 'chromium'
      },
    },

    // {
    //   name: 'Firefox',
    //   use: {
    //     headless: true,
    //     viewport: { width: 1920, height: 1080 },
    //     video: 'on',
    //     trace: 'on',
    //     screenshot: 'only-on-failure',
    //     browserName: 'firefox'
    //   },
    // },

    {
      name: 'Microsoft Edge',
      use: {
        headless: false,
        viewport: { width: 1920, height: 1080 },
        video: 'on',
        trace: 'on',
        screenshot: 'only-on-failure',
        channel: 'msedge',
      },
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: {
    //     ...devices['Pixel 5'],
    //   },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: {
    //     ...devices['iPhone 12'],
    //   },
    // },
    
    
  ],

  /* Folder for test artifacts such as screenshots, videos, traces, etc. */
  // outputDir: 'test-results/',

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   port: 3000,
  // },
};

export default config;
