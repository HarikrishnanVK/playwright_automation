import { type PlaywrightTestConfig, devices } from '@playwright/test'

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const config: PlaywrightTestConfig = {
  testDir: './tests/',
  testMatch: 'bupa.spec.ts',
  /* Maximum time one test can run for. */
  timeout: 60 * 1000,
  expect: {
    timeout: 60000
  },
  fullyParallel: false,
  workers: 1,
  reporter: 'html',
  use: {
    actionTimeout: 60000
  },

  /* Configure projects for major browsers */
  /* Test against branded browsers. */

  projects: [
    {
      name: 'Chrome_Staging',
      use: {
        headless: false,
        channel: 'Chrome',
        screenshot: 'only-on-failure',
        baseURL: 'https://www.bupa.com/',
        video: 'retain-on-failure',
        launchOptions: {
          executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
        }
      }
    },

    {
      name: 'Chrome_Prod',
      use: {
        headless: false,
        channel: 'Chrome',
        screenshot: 'only-on-failure',
        baseURL: 'https://bupa.com',
        video: 'retain-on-failure',
        launchOptions: {
          executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
        }
      }
    },

    {
      name: 'edge',
      use: {
        headless: false,
        channel: 'msedge'
      }
    },

    {
      name: 'firefox',
      use: {
        headless: false,
        browserName: 'firefox'
      }
    },

    {
      name: 'APIConfig',
      testMatch: 'api.spec.ts',
      use: {
        baseURL: 'https://simple-books-api.glitch.me'
      }
    },

    {
      name: 'GooglePixel5',
      use: {
        headless: false,
        ...devices['Pixel 5']
      }
    }

    // {
    //   name: 'Firefox',
    //   use: {
    //     headless: false,
    //     viewport: { width: 1920, height: 1080 },
    //     video: 'on',
    //     trace: 'on',
    //     screenshot: 'only-on-failure',
    //     browserName: 'firefox'
    //   },
    // },

    // {
    //   name: 'Microsoft Edge',
    //   use: {
    //     headless: false,
    //     viewport: { width: 1920, height: 1080 },
    //     video: 'on',
    //     trace: 'on',
    //     screenshot: 'only-on-failure',
    //     channel: 'msedge',
    //   },
    // },

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

  ]

  /* Folder for test artifacts such as screenshots, videos, traces, etc. */
  // outputDir: 'test-results/',

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   port: 3000,
  // },
}

export default config
