import { Page, BrowserContext } from "@playwright/test"
import { WebBase } from "../helpers/web_base"

export class IndiumStore extends WebBase {

    constructor(page: Page, context: BrowserContext) {
        super(page, context)
    }

    /* selectors */
    private readonly storeLogo = `store logo#css=a[class='logo']`
    private readonly searchBox = `search box#css=input[type='search']`
    private readonly searchButton = `search button#xpath=//i[@class='fa fa-search']//parent::button`
    
    private readonly productInformation = `product information#xpath=//a[contains(@href,'product')]//small`
    // private readonly searchButton = `search button#xpath=//i[@class='fa fa-search']//parent::button`
    // private readonly searchButton = `search button#xpath=//i[@class='fa fa-search']//parent::button`
    // private readonly searchButton = `search button#xpath=//i[@class='fa fa-search']//parent::button`


    /*functions*/
    public async getLogoText(): Promise<string | null> {
        return await this.getText(this.storeLogo)
    }

    public async searchProduct(textToSearch: string): Promise<void> {
         await this.typeIn(this.searchBox, textToSearch)
         await this.clickOn(this.searchButton)
    }




}