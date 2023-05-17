import { test, expect } from '@playwright/test'
import { BupaPage } from '../../pages/bupa.page'
import { BupaLocationTest, BupaLinkTest, BupaSiteConstants, Devices } from '../../test_data/test_data.json'

let bupa: BupaPage
let isMobile: Boolean = false

test.beforeEach(async () => {
    bupa = new BupaPage()
})

test.afterEach(async () => {
    await bupa.closeApplication()
})

test.describe('Bupa health care tests', () => {
    Devices.forEach((device) => {
        test(`'[${device}]' - Verify Bupa search engine working`, async ({ baseURL }) => {
            isMobile = await bupa.launchDevice(device)
            await bupa.navigateToURL(baseURL as string)
            await bupa.acceptCookies()
            const title = await bupa.returnPageTitle()
            console.log(`captured site title as ${title}`)
            await bupa.searchContent(BupaSiteConstants.searchKey, isMobile)
            await bupa.verifySearchResult(BupaSiteConstants.searchKey)
            await bupa.navigateToFirstLink()
            await bupa.validateArticle()
        })
    })

    Devices.forEach((device) => {
        test(`[${device}] - Verify search navigating using window handles`, async ({ baseURL }) => {
            isMobile = await bupa.launchDevice(device)
            await bupa.navigateToURL(baseURL as string)
            await bupa.acceptCookies()
            await bupa.mouseHoverOnLink(BupaSiteConstants.primaryLink, isMobile)
            await bupa.selectSubLink(BupaSiteConstants.childLink, isMobile)
            const actualPageTitle = await bupa.returnPageTitle()
            expect(actualPageTitle.toLowerCase()).toContain('Leadership | Bupa.com'.toLowerCase())
            await bupa.searchContent(BupaSiteConstants.searchKey, isMobile)
            await bupa.verifySearchResult(BupaSiteConstants.searchKey)
            await bupa.navigateToFirstLink()
            await bupa.validateArticle()
        })
    })

    Devices.forEach((device) => {
        test(`[${device}] - Verify primary links of Bupa site`, async ({ baseURL }) => {
            isMobile = await bupa.launchDevice(device)
            await bupa.navigateToURL(baseURL as string)
            await bupa.acceptCookies()
            await bupa.mouseHoverOnLink(BupaSiteConstants.primaryLink, isMobile)
            await bupa.selectSubLink(BupaSiteConstants.LinkName, isMobile)
            let actualPageTitle = await bupa.returnPageTitle()
            expect(actualPageTitle.toLowerCase()).toContain(BupaSiteConstants.LinkName.toLowerCase())
            await bupa.clickMediaLinks(BupaSiteConstants.BupaServiceSite, isMobile)
            actualPageTitle = await bupa.returnPageTitle()
            expect(actualPageTitle.toLowerCase()).toContain(BupaSiteConstants.ServicePageTitle!.toLowerCase())
            await bupa.searchContent(BupaSiteConstants.searchKey, isMobile)
            await bupa.verifySearchResult(BupaSiteConstants.searchKey)
            await bupa.navigateToFirstLink()
            await bupa.validateArticle()
        })
    })
})
