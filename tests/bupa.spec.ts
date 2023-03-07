/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-confusing-void-expression */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-base-to-string */
/* eslint-disable @typescript-eslint/no-floating-promises */
import { test, expect } from '@playwright/test'
import { BupaPage } from '../pages/bupa.page'
import { TestData } from '../test_data.json'

let bupa: BupaPage

// test.beforeAll(async ({ page }) => {
//     await page.goto(env.bupa);
//     console.log(`captured site title as ${await page.title()}`);
// });

test.beforeEach(({ page, baseURL }) => {
  page.goto(baseURL!)
    .then(() => {
      page.waitForLoadState()
        .then(() => {
          page.title()
            .then(title => {
              console.log(`captured site title as ${title}`)
              expect("").toEqual(title)
            })
        })
    })
  // page.goto(baseURL!)
  // console.log("I must execute after navigating to URL")
  // page.waitForLoadState()
  // const title = page.title()
  // console.log("I must execute after getting the title")
  // console.log(`captured site title as ${title}`)
})

test.describe('sample test', () => {
  test('Verify Bupa search engine working', ({ page, context }) => {
    bupa = new BupaPage(page, context)
    bupa.verifyHomePage()
      .then(() => {
        bupa.mouseHoverOnLink('our-bupa')
          .then(() => {
            bupa.verifySubLinksOfOurBupa()
              .then(() => {
                bupa.selectSubLink('Leadership')
                  .then(() => {
                    bupa.returnPageTitle()
                      .then(actualPageTitle => {
                        expect(actualPageTitle.toLowerCase()).toContain('Leadership | Bupa.com'.toLowerCase())
                      })
                  })
              })
          })
      })
  })
})
// await bupa.searchContent('James lenton')
// await bupa.verifySearchResult('James lenton')
// await bupa.navigateToFirstLink()
// await bupa.validateArticle('James lenton')

test.describe('Bupa data driven tests', () => {
  TestData.forEach(data => {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    test(`Verify primary links of Bupa site ${data.BupaServiceSite}`, async ({ page, context }) => {
      bupa = new BupaPage(page, context)
      await bupa.verifyHomePage()
      await bupa.mouseHoverOnLink('our-bupa')
      await bupa.selectSubLink(data.LinkName)
      const actualPageTitle = await bupa.returnPageTitle()
      expect(actualPageTitle.toLowerCase()).toContain(data.LinkName.toLowerCase())
      await bupa.clickSocialMediaLinks(data.BupaServiceSite)
      const actualPageTitle5 = await bupa.returnPageTitle()
      expect(actualPageTitle5.toLowerCase()).toContain(data.ServicePageTitle.toLowerCase())
      await bupa.searchContent('James lenton')
      await bupa.verifySearchResult('James lenton')
      await bupa.navigateToFirstLink()
      await bupa.validateArticle('James lenton')
    })
  })
})
