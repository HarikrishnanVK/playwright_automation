import { test, expect } from '@playwright/test'

const countries = ['India']

countries.forEach(async (data) => {
  test(`Data driven test ${data}`, async ({ page }) => {
    await page.goto('https://www.google.com/')
    await page.fill("input[aria-label='Searching']", data)
    await page.keyboard.press('Enter')
    await page.waitForNavigation()
    const title = await page.title()
    expect(title).toContain(data)
  })
})

// // Expect a title "to contain" a substring.
// await expect(page).toHaveTitle(/Playwright/);

// // create a locator
// const getStarted = page.locator('text=Get Started');

// // Expect an attribute "to be strictly equal" to the value.
// await expect(getStarted).toHaveAttribute('href', '/docs/intro');

// // Click the get started link.
// await getStarted.click();

// // Expects the URL to contain intro.
// await expect(page).toHaveURL(/.*intro/);
// });
