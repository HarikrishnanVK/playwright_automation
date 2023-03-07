/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable no-unreachable-loop */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { type BrowserContext, expect, type Locator, type Page } from '@playwright/test'
import { readdirSync, lstatSync } from 'fs'
import { join } from 'path'
import { exec } from 'child_process'
import { chdir } from 'process'

export class BupaPage {
  private globalVariable!: string | null
  private page: Page
  private readonly context: BrowserContext

  constructor (page: Page, context: BrowserContext) {
    this.page = page
    this.context = context
  }

  // Selectors
  private readonly bupaCompanyLogo = 'figure[id=\'logo\'] img[src*=\'bupa-company-logo\']'
  private readonly subLinksOfOurBupa = 'ul[id=\'section-our-bupa-level2\'] li[id*=\'level2\'] > a > span'
  private readonly searchButton = '//nav[@class=\'desktop-nav\']//..//a[@class=\'searchButton\']'
  private readonly searchTextBox = 'input[id=searchTextbox]'
  private readonly searchTextBox2 = 'input[id=\'searchButton\']'
  private readonly resultSummary = 'div[id=\'result-summary\']'
  private readonly resultLinks = 'span[class=\'resultURL\']'
  private readonly linkHeader = '//div[@class=\'banner-landing-page-title\']//h1'
  private readonly socialMediaLnks = 'footer[id=\'footerwrapper\'] div[class=\'share-icons\'] a'
  private readonly serviceLinks = 'section[class=\'footer-box-bottom\'] a'
  private readonly acceptCookieButton = 'button[id=\'cc-cookieAgree\']'

  // functions
  private async findElement (selector: string): Promise<Locator> {
    try {
      await this.page.waitForSelector(this.bupaCompanyLogo, { strict: false, timeout: 30000 })
    } catch {
      await this.page.waitForSelector(this.bupaCompanyLogo, { strict: false, timeout: 30000, state: 'hidden' })
    }
    return this.page.locator(selector)
  }

  private async findElementForActiveWindow (window: Page, selector: string): Promise<Locator> {
    await window.waitForSelector(selector, { strict: false, timeout: 60000 })
    return window.locator(selector)
  }

  async verifyHomePage () {
    const logo = await this.findElement(this.bupaCompanyLogo)
    await expect(logo).toBeEnabled({ timeout: 30000 })
    await (await this.findElement(this.acceptCookieButton)).click()
  }

  public async getLatestTouchBuildFromDir (dir: string) {
    const projectDir = process.cwd()
    const files = readdirSync(dir)
      .filter((file) => lstatSync(join(dir, file)).isFile())
      .map((file) => ({ file, mtime: lstatSync(join(dir, file)).mtime }))
      .sort((a, b) => b.mtime.getTime() - a.mtime.getTime())
    console.log(`latest file from download is ${files[0].file}`)

    chdir(dir)
    for (let i = 0; i < files.length; i++) {
      if (files[i].file.includes('DYNAMICS Touch') && files[i].file.includes('.exe')) {
        exec(`"${files[i].file}" /FORCECLOSEAPPLICATIONS /VERYSILENT`, (err, stdout) => {
          if (err != null) {
            console.error(err)
            return
          }
          console.log(stdout)
        })
      }
      await this.sleep(90000)
      chdir(projectDir)
      break
    }
  }

  async mouseHoverOnLink (linkName: string) {
    const ourBupaPrimaryLink = await this.findElement(`ul[id='section-Homepage-level1'] > li > a[href*='${linkName}']`)
    await ourBupaPrimaryLink.hover()
  }

  async verifySubLinksOfOurBupa () {
    const expectedLinks: string[] = ['Our strategy', 'Responsible business', 'Leadership', 'Our story', 'Governance']
    const actualLinks: string[] = []
    const links: any = (await this.findElement(this.subLinksOfOurBupa))
    const linksCount = await (await this.findElement(this.subLinksOfOurBupa)).count()
    for (let i = 0; i < linksCount; i++) {
      actualLinks.push(await links.nth(i).textContent({ strict: false, timeout: 60000 }))
    }
    console.log(`sub links captured '${actualLinks}'`)
    expect(actualLinks.toString()).toContain(expectedLinks.toString())
  }

  async selectSubLink (subLinkName: string) {
    const linksCount = await (await this.findElement(this.subLinksOfOurBupa)).count()
    const links: any = (await this.findElement(this.subLinksOfOurBupa))
    for (let i = 0; i < linksCount; i++) {
      if ((await links.nth(i).textContent({ strict: false, timeout: 60000 })).match(subLinkName)) {
        console.log('link name captured as ' + await links.nth(i).textContent())
        await this.page.keyboard.down('Control')
        await links.nth(i).click()
        await this.page.keyboard.up('Control')
        await this.sleep(5000)
        const pages = this.context.pages()
        await pages[1].bringToFront()
        this.page = pages[1]
        const title = await this.page.title()
        expect(title).toEqual('Leadership | Bupa.com')
        break
      } else {
        continue
      };
    }
  }

  async returnPageTitle (): Promise<string> {
    return await this.page.title()
  }

  async searchContent (content: string) {
    await this.page.waitForLoadState()
    await (await this.findElement(this.searchButton)).click()
    await (await this.findElement(this.searchTextBox)).fill(content)
    await (await this.findElement(this.searchTextBox2)).click()
  }

  async verifySearchResult (content: string) {
    const locator = this.page.locator(this.resultSummary)
    await expect(locator.nth(0)).toContainText(content, { timeout: 20000 })
    const result = await (await this.findElement(this.resultSummary)).allTextContents()
    expect(result.toString()).toContain(content)
    const resultLink = await (await this.findElement(this.resultLinks)).allTextContents()
    expect(resultLink.toString().toLowerCase()).toContain(content.toLowerCase())
  }

  async navigateToFirstLink () {
    const firstLinkResult = await (await this.findElement(this.resultLinks)).nth(1).textContent({ timeout: 60000 })
    this.globalVariable = firstLinkResult
    console.log(`result from the 1st link is captured as ${firstLinkResult}`)
    await (await this.findElement(this.resultLinks)).nth(1).click()
  }

  async sleep (msec: number | undefined) {
    return await new Promise(resolve => setTimeout(resolve, msec))
  }

  private async switchToWindow (): Promise<Page> {
    const [newWindow] = await Promise.all([
      await this.context.waitForEvent('page')
    ])
    await newWindow.waitForSelector(this.bupaCompanyLogo)
    console.log(`switched to window with title as ${await newWindow.title()}`)
    return newWindow
  }

  async validateArticle (articleName: string) {
    const newWindow = await this.switchToWindow()
    const newsHeader = await (await this.findElementForActiveWindow(newWindow, this.linkHeader)).textContent({ timeout: 60000 })
    expect(newsHeader!.toLowerCase()).toContain(articleName.toLowerCase())
    expect(this.globalVariable).toEqual(newsHeader)
    console.log(`Relevant article is displayed '${newsHeader}'`)
  }

  async clickSocialMediaLinks (siteName: string) {
    let links: Locator
    if (!siteName.includes('.com')) {
      links = await this.findElement(this.serviceLinks)
    } else {
      links = await this.findElement(this.socialMediaLnks)
    }
    for (let i = 0; i < await links.count(); i++) {
      const attributeValue: any = await links.nth(i).getAttribute('href')
      if (attributeValue.match(siteName)) {
        await links.nth(i).click()
      }
    }
  }

  async validateSocialMediaSite (siteName: string) {
    const newWindow = await this.switchToWindow()
    const windowTitle = await newWindow.title()
    expect(windowTitle.toLowerCase()).toContain(siteName)
  }
}
