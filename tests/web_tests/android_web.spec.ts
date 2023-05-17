import { AndroidDevice, test, _android as android } from "@playwright/test";

var device: AndroidDevice;

test.describe('android tests', () => {
    
    const androidTestData = [{ FirstName: "Tommy", LastName: "Shelby", UserNumber: 9879879879, UserEmail: "tommy@gmail.com" },
    { FirstName: "Walter", LastName: "White", UserNumber: 9859779979, UserEmail: "walter@gmail.com" }]

    test.beforeEach(async () => {
        [device] = await android.devices()
        console.log(`Model: ${device.model()}`)
        console.log(`Serial: ${device.serial()}`)
        // Take screenshot of the whole device.
        await device.screenshot({ path: 'device.png' })
    })

    androidTestData.forEach(data => {
        test(`sample android test for chrome ${data.FirstName}`, async ({ context, page }) => {
            // Launch Chrome browser.
            await device.shell('am force-stop com.android.chrome')
            context = await device.launchBrowser()

            // Use BrowserContext as usual.
            page = await context.newPage()
            await page.goto('https://demoqa.com/automation-practice-form')
            console.log(await page.evaluate(() => window.location.href))
            await page.screenshot({ path: 'page.png' })
            await page.fill("#firstName", `${data.FirstName}`)
            await page.fill("#lastName", `${data.LastName}`)
            await page.click('#gender-radio-1', { force: true })
            await page.fill("#userEmail", `${data.UserEmail}`)
            await page.fill("#userNumber", `${data.UserNumber}`)
            await page.click("button[id='submit']", { force: true })
        });

        test(`sample android test for webview ${data.FirstName}`, async ({ page }) => {
            // Launch an application with WebView.
            await device.shell('am force-stop org.chromium.webview_shell')
            await device.shell('am start org.chromium.webview_shell/.WebViewBrowserActivity')

            // Get the WebView.
            const webview = await device.webView({ pkg: 'org.chromium.webview_shell' })
            await device.fill({ res: 'org.chromium.webview_shell:id/url_field' }, 'https://demoqa.com/automation-practice-form')
            await device.press({ res: 'org.chromium.webview_shell:id/url_field' }, 'Enter')

            // Use BrowserContext as usual.
            page = await webview.page();
            await page.waitForNavigation({ url: "https://demoqa.com/automation-practice-form" })
            console.log(await page.evaluate(() => window.location.href))
            console.log(await page.title())
            await page.screenshot({ path: 'page.png' })
            await page.fill("#firstName", `${data.FirstName}`)
            await page.fill("#lastName", `${data.LastName}`)
            await page.click('#gender-radio-1', { force: true })
            await page.fill("#userEmail", `${data.UserEmail}`)
            await page.fill("#userNumber", `${data.UserNumber}`)
            await page.click("button[id='submit']", { force: true })
        })
    })

    test.afterEach(async ({ context, page }) => {
        await page.close();
        await context.close();
        // Close the device.
        await device.shell('am force-stop com.android.chrome');
        await device.shell('am force-stop org.chromium.webview_shell');
    });
});