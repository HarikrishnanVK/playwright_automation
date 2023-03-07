import { test, expect } from '@playwright/test'
import { env } from '../package.json'
import { BupaPage } from '../pages/bupa.page'

let bupa: BupaPage

test.beforeEach(async ({ page, context }) => {
  await page.goto(env.bupa)
  console.log(`captured site title as ${await page.title()}`)
})

test('Window handles', async ({ page, context }) => {
  bupa = new BupaPage(page, context)
  await bupa.mouseHoverOnLink('our-bupa')
  await bupa.selectSubLink('Leadership')
  const actualPageTitle = await bupa.returnPageTitle()
  expect(actualPageTitle.toLowerCase()).toContain('Leadership | Bupa.com'.toLowerCase())
  await bupa.searchContent('James lenton')
  await bupa.verifySearchResult('James lenton')
  await bupa.navigateToFirstLink()
  await bupa.validateArticle('press releases')
})
