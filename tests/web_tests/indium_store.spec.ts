import { expect, test } from '@playwright/test'
import { exec } from 'child_process'
import { IndiumStore } from '../../pages/indium_store.page'
import { remote } from 'webdriverio'
import path from 'path';
import { CMH } from '../../pages/cmh.page'
import { logger } from '../../helpers/logger'

let page: CMH
let indiumStore: IndiumStore

let browser: WebdriverIO.Browser

test.beforeAll(async () => {
    browser = await remote({
        services: [
            ['appium',
                {
                    args: {
                        address: 'http://localhost:4444/wd/hub',
                    },
                    logPath: './logs'
                }
            ]],
        capabilities: {
            platformName: "Android",
            "appium:platformVersion": "13",
            "appium:deviceName": "Pixel_6a",
            "appium:automationName": "UIAutomator2",
            "appium:app": path.join(process.cwd(), "./app/android/app-appstore-release.apk"),
            "appium:noReset": true,
        },
    })
})

test.beforeEach(async () => {
    page = new CMH()

    // launch the app and wait for main screen
    await page.launchApplication()
    await page.waitForLogInPage()
    logger.info("App main screen is loaded")

    // Sign-in 
    await page.logIn("kostfeld13@gmail.com", "1500-T3sting")
    logger.info("Signed in")
})

test.only("Verify educators video information", async () => {

    // Click on educators icon
    await page.performClick("educators icon")

    // Verify educator details of "Andrea Hernandez"
    await page.playVideoOfAnEducator("Andrea Hernandez", "Stomp Rockets")
    expect(await page.isTitleDisplayed("By Andrea Hernandez")).toBeFalsy()
    await page.navigateToEducatorsHome()

    // Verify educator details of "Belkis Hernandez"
    await page.playVideoOfAnEducator("Belkis Hernandez", "Haz Una Alcancía")
    expect(await page.isTitleDisplayed("By Belkis Hernandez")).toBeTruthy()
    await page.navigateToEducatorsHome()
})

test.describe("Indium store tests", () => {

    test.beforeEach(async ({ page, context }) => {
        indiumStore = new IndiumStore(page, context)
        exec('./test_data/Indium-store-Online-master/run_server.bat')
        /* wait till the server spin up */
        await indiumStore.waitForSeconds(2)
        await page.goto("http://127.0.0.1:8000/")
        await page.waitForLoadState()
    })

    test("Search for shirts in store", async () => {
        const logoText = await indiumStore.getLogoText()
        expect(logoText).toEqual("Indium Store")
        await indiumStore.searchProduct("shirts")

    })
})