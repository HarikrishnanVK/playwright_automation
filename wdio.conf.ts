import type { Options } from '@wdio/types'
import path from 'path';
import localEnv from 'dotenv'
import { exec } from 'child_process'

// const video = require('wdio-video-reporter')
localEnv.config();

export const config: Options.Testrunner = {
    //
    // ====================
    // Runner Configuration
    // ====================
    // WebdriverIO supports running e2e tests as well as unit and component tests.
    runner: 'local',
    autoCompileOpts: {
        autoCompile: true,
        tsNodeOpts: {
            project: './tsconfig.json',
            transpileOnly: true
        }
    },

    port: 4724,
    specs: [
        './tests/android_apk_tests/cmh_apk.spec.ts'
    ],
    // Patterns to exclude.
    exclude: [
        // 'path/to/excluded/files'
    ],

    maxInstances: 1,

    capabilities: [{
        platformName: "Android",
        "appium:platformVersion": "13",
        "appium:deviceName": "Pixel_6a",
        "appium:automationName": "UIAutomator2",
        "appium:app": path.join(process.cwd(), "./app/android/app-appstore-release.apk"),
        "appium:noReset": true,
    }],

    logLevel: 'debug',
    outputDir: "./logs",

    bail: 0,
    //
    // Set a base URL in order to shorten url command calls. If your `url` parameter starts
    // with `/`, the base url gets prepended, not including the path portion of your baseUrl.
    // If your `url` parameter starts without a scheme or `/` (like `some/path`), the base url
    // gets prepended directly.
    // Default timeout for all waitFor* commands.
    waitforTimeout: 20000,
    //
    // Default timeout in milliseconds for request
    // if browser driver or grid doesn't send response
    connectionRetryTimeout: 30000,

    // Default request retries count
    connectionRetryCount: 3,
    //
    // Test runner services
    // Services take over a specific job you don't want to take care of. They enhance
    // your test setup with almost no effort. Unlike plugins, they don't add new
    // commands. Instead, they hook themselves up into the test process.
    services: [
        ['appium',
            {
                args: {
                    address: '127.0.0.1',
                    port: 4724,
                },
                logPath: './logs'
            }
        ]],
    // Framework you want to run your specs with.
    // The following are supported: Mocha, Jasmine, and Cucumber
    // see also: https://webdriver.io/docs/frameworks
    //
    // Make sure you have the wdio adapter package for the specific framework installed
    // before running any tests.
    framework: 'mocha',

    // Options to be passed to Mocha.
    // See the full list at http://mochajs.org/
    mochaOpts: {
        ui: 'bdd',
        timeout: 60000,
    },

    reporters: ['spec',
        // ['json', {
        //     outputDir: './reports'
        // }],
        // [video, {
        //     saveAllVideos: false,       // If true, also saves videos for successful test cases
        //     videoSlowdownMultiplier: 3, // Higher to get slower videos, lower for faster videos [Value 1-100]
        //     videoRenderTimeout: 5,      // Max seconds to wait for a video to finish rendering\
        //     outputDir: 'reports/html-reports/screenshots',
        // }],
        ['allure', {
            outputDir: './allure-results',
            disableWebdriverStepsReporting: true,
            disableWebdriverScreenshotsReporting: false,
            disableMochaHooks: true
        }],
        // ["html-nice", {
        //     debug: false,
        //     outputDir: './reports/html-reports/',
        //     filename: 'wdio_report.html',
        //     reportTitle: 'Test Report',
        //     showInBrowser: true,
        //     useOnAfterCommandForScreenshot: false,
        //     linkScreenshots: true,
        // }]
    ],

    afterTest: async function (test, context, { error, result, duration, passed, retries }) {
        if (error) {
            await driver.saveScreenshot('./allure-results/image.png')
        }
    },

    afterSession: function () {
        exec("npx kill-port 4724")
    }
}
