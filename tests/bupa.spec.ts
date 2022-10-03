import { test, expect} from '@playwright/test';
import { env } from "../package.json";
import { BupaPage } from '../pages/bupa.page';
import { TestData} from "../test_data.json";

let bupa: BupaPage;

test.beforeEach(async ({ page }) => {
    await page.goto(env.bupa, { timeout: 30000 });
    console.log(`captured site title as ${await page.title()}`);
});

test.describe('Bupa site test cases', () => {
    test("Verify Bupa search engine working", async ({ page, context }) => {
        bupa = new BupaPage(page, context);
        await bupa.verifyHomePage();
        await bupa.mouseHoverOnLink("our-bupa");
        await bupa.verifySubLinksOfOurBupa();
        await bupa.selectSubLink("Leadership");
        const actualPageTitle = await bupa.returnPageTitle();
        expect(actualPageTitle.toLowerCase()).toContain("Leadership | Bupa.com".toLowerCase());
        await bupa.searchContent("James lenton");
        await bupa.verifySearchResult("James lenton");
        await bupa.navigateToFirstLink();
        await bupa.validateArticle("James lenton");
    });

    TestData.forEach(data => {
        test(`Verify primary links of Bupa site ${data.BupaServiceSite}`, async ({ page, context }) => {
            bupa = new BupaPage(page, context);
            await bupa.verifyHomePage();
            await bupa.mouseHoverOnLink("our-bupa");
            await bupa.selectSubLink(data.LinkName);
            const actualPageTitle = await bupa.returnPageTitle();
            expect(actualPageTitle.toLowerCase()).toContain(data.LinkName.toLowerCase());
            await bupa.mouseHoverOnLink("what-we-do");
            await bupa.selectSubLink(data.LinkName2);
            const actualPageTitle2 = await bupa.returnPageTitle();
            expect(actualPageTitle2.toLowerCase()).toContain(data.LinkTitle.toLowerCase());
            await bupa.mouseHoverOnLink("sustainability");
            await bupa.selectSubLink(data.LinkName3);
            const actualPageTitle3 = await bupa.returnPageTitle();
            expect(actualPageTitle3.toLowerCase()).toContain(data.LinkName3.toLowerCase());
            await bupa.mouseHoverOnLink("news");
            await bupa.selectSubLink(data.LinkName4);
            const actualPageTitle4 = await bupa.returnPageTitle();
            expect(actualPageTitle4.toLowerCase()).toContain(data.LinkName4.toLowerCase());
            await bupa.clickSocialMediaLinks(data.BupaServiceSite);
            const actualPageTitle5 = await bupa.returnPageTitle();
            expect(actualPageTitle5.toLowerCase()).toContain(data.ServicePageTitle.toLowerCase());
            await bupa.searchContent("Bupa");
            await bupa.verifySearchResult("Bupa");
            await bupa.navigateToFirstLink();
            await bupa.validateArticle("bienvenido a ecodisruptive");
        });
    });
})
