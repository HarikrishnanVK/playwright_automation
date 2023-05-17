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
        BupaLinkTest.forEach((data: any) => {
            test(`[${device}] - Verify primary links of Bupa site ${data.BupaServiceSite!}`, async ({ baseURL }) => {
                isMobile = await bupa.launchDevice(device)
                await bupa.navigateToURL(baseURL as string)
                await bupa.acceptCookies()
                await bupa.mouseHoverOnLink(BupaSiteConstants.primaryLink, isMobile)
                await bupa.selectSubLink(data.LinkName!, isMobile)
                let actualPageTitle = await bupa.returnPageTitle()
                expect(actualPageTitle.toLowerCase()).toContain(data.LinkName!.toLowerCase())
                await bupa.clickMediaLinks(data.BupaServiceSite!, isMobile)
                actualPageTitle = await bupa.returnPageTitle()
                expect(actualPageTitle.toLowerCase()).toContain(data.ServicePageTitle!.toLowerCase())
                await bupa.searchContent(BupaSiteConstants.searchKey, isMobile)
                await bupa.verifySearchResult(BupaSiteConstants.searchKey)
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
})
