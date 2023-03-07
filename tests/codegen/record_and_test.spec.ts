import { test } from '@playwright/test'

test('test', async ({ page }) => {
  // Go to about:blank
  await page.goto('https://bupa.com')
  console.log(`captured site title as ${await page.title()}`)
})
