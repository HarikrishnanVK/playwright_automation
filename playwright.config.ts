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
  // testDir: './tests/parallel_tests',
  //testMatch: 'bupa_healthcare.spec.ts',
  testDir: './tests/parallel_tests',
  testMatch: 'webtests.spec.ts',
  /* Maximum time one test can run for. */
  timeout: 120 * 1000,
  expect: {
    timeout: 5000
  },
  fullyParallel: true,
  workers: 3,
  reporter: [['list'],
  [
    'html',
    {
      outputFolder: './reports/html-reports',
      open: 'never' 
    }],
  [
    'json',
    {
      outputFile: './reports/playwright_results.json',
      stripANSIControlSequences: true
    }
  ],
  [
    'allure-playwright',
    {
      detail: true,
      outputFolder: "./allure-results",
      suiteTitle: false,
    },
  ]
  ],
  use: {
    actionTimeout: 60000
  },

  /* Configure projects for major browsers */
  /* Test against branded browsers. */

  projects: [
    {
      name: 'Smoke Tests',
      // testMatch: 'parallel1.spec.ts',
      use: {
        headless: false,
        screenshot: 'only-on-failure',
        // trace: 'retain-on-failure',
        baseURL: 'https://www.bupa.com/',
        video: 'retain-on-failure',
        // viewport: {width: 1920, height: 1080}
      },
    },

    // {
    //   name: 'Samsung_Galaxy',
    //   // testMatch: 'parallel2.spec.ts',
    //   use: {
    //   ...devices['iPad Mini'],
    //     headless: false,
    //     screenshot: 'only-on-failure',
    //     baseURL: 'https://www.bupa.com/',
    //   }
    // },

    // {
    //   name: 'iPhone_12',
    //   // testMatch: 'parallel3.spec.ts',
    //   use: {
    //     ...devices['iPhone 12 Mini landscape'],
    //     headless: false,
    //     screenshot: 'only-on-failure',
    //     baseURL: 'https://www.bupa.com/',
    //   }
    // }

    // {
    //   name: 'Chrome_Prod',
    //   use: {
    //     headless: false,
    //     channel: 'Chrome',
    //     screenshot: 'only-on-failure',
    //     baseURL: 'https://bupa.com',
    //     video: 'retain-on-failure',
    //     launchOptions: {
    //       executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
    //     }
    //   }
    // },

    // {
    //   name: 'edge',
    //   use: {
    //     headless: false,
    //     channel: 'msedge'
    //   }
    // },

    // {
    //   name: 'APIConfig',
    //   testMatch: 'api.spec.ts',
    //   use: {
    //     baseURL: 'https://simple-books-api.glitch.me'
    //   }
    // },

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
