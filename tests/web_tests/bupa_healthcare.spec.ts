import { test, expect, devices } from '@playwright/test'
import { BupaPage } from '../../pages/bupa.page'
import { BupaLocationTest, BupaLinkTest } from '../../test_data/test_data.json'
import { exec } from 'child_process'

let bupa: BupaPage

test.describe.configure({ mode: "serial" })
test.beforeEach(async ({ page, baseURL, context }) => {
  bupa = new BupaPage(page, context)
  await bupa.navigateToURL(baseURL as string)
  await bupa.acceptCookies()
})

test.describe('Bupa health care tests', () => {
  test('Verify Bupa search engine working', async ({ isMobile }) => {
    const title = await bupa.returnPageTitle()
    console.log(`captured site title as ${title}`)
    console.log(`Is Mobile device running : ${isMobile}`)
    await bupa.searchContent('Bupa', isMobile)
    await bupa.verifySearchResult('Bupa')
    await bupa.navigateToFirstLink()
    await bupa.validateArticle()
  })

  test('Verify search navigating using window handles', async ({ isMobile }) => {
    await bupa.mouseHoverOnLink('our-bupa', isMobile)
    await bupa.selectSubLink('Leadership', isMobile)
    const actualPageTitle = await bupa.returnPageTitle()
    expect(actualPageTitle.toLowerCase()).toContain('Leadership | Bupa.com'.toLowerCase())
    await bupa.searchContent('Bupa', isMobile)
    await bupa.verifySearchResult('Bupa')
    await bupa.navigateToFirstLink()
    await bupa.validateArticle()
  })

  BupaLinkTest.forEach((data: any) => {
    test(`Verify primary links of Bupa site ${data.BupaServiceSite!}`, async ({ isMobile }) => {
      await bupa.mouseHoverOnLink('our-bupa', isMobile)
      await bupa.selectSubLink(data.LinkName!, isMobile)
      let actualPageTitle = await bupa.returnPageTitle()
      expect(actualPageTitle.toLowerCase()).toContain(data.LinkName!.toLowerCase())
      await bupa.clickMediaLinks(data.BupaServiceSite!, isMobile)
      actualPageTitle = await bupa.returnPageTitle()
      expect(actualPageTitle.toLowerCase()).toContain(data.ServicePageTitle!.toLowerCase())
      await bupa.searchContent('Bupa', isMobile)
      await bupa.verifySearchResult('Bupa')
      await bupa.navigateToFirstLink()
      await bupa.validateArticle()
    })
  })
})

  //   BupaLocationTest.forEach(testData => {
  //     test(`Verify locations of the health care ${testData.countryName!}`, async () => {
  //       await bupa.clickContactList()
  //       await bupa.selectCountriesFromList(testData.countryName!)
  //       await bupa.openLocationLink(testData.countryName!)
  //       await bupa.verifyLocation(testData.countryLink!)
  //     })
  //   })
  // })


