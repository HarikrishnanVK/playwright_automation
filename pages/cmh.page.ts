import { AppiumBase } from "../helpers/appium_base"
import { logger } from "../helpers/logger"

export class CMH extends AppiumBase {

    /* selectors */

    private loginLabel = `login label at login screen#xpath=(//android.widget.TextView[@text="Log In"])[2]`
    private guestUserButton = `guest user button#xpath=//android.widget.TextView[@text="Proceed as Guest"]`
    private educatorsIcon = `educators icon#xpath=//android.widget.TextView[@text="Educators"]`
    private explorerIcon = `explorer icon#xpath=//android.widget.TextView[@text="Explore"]`
    private aboutMeTitle = `about me title#xpath=(//android.widget.TextView[@text='ABOUT ME'])[2]`
    private myVideosTab = `videos tab#xpath=//android.view.View[@content-desc="My Videos"]/android.view.ViewGroup`
    private backButton = `back button#xpath=//android.widget.Button[contains(@content-desc,"back")]`
    private aboutMeTab = `about me tab#xpath=//android.view.View[@content-desc="About Me"]`
    private educatorsBackButton = `educators back button#xpath=//android.widget.Button[@content-desc="Educators, back"]`
    public callingAllArtistsImage = `calling all artists image#xpath=(//android.widget.ImageView)[1]`
    private proSkillsImage = `pro skills image#xpath=(//android.widget.ImageView)[4]`
    private geekOutImage = `geek out image#xpath=(//android.widget.ImageView)[2]`
    private explorerImages = `all images#xpath=//android.widget.ImageView`
    private emailField = `Email text box#xpath=//android.widget.TextView[@text='EMAIL']//following-sibling::android.widget.EditText`
    private passwordField = `Password text box#xpath=//android.widget.TextView[@text='PASSWORD']//following-sibling::android.widget.EditText`
    private loginButton = `login button#xpath=//android.widget.TextView[@text='Proceed as Guest']/../preceding-sibling::android.view.ViewGroup//android.widget.TextView[@text='Log In']`
    public accountLogo = `Account Icon#xpath=//android.widget.TextView[@text='Account']`
    private signOutButton = `Sign out button#xpath=//android.widget.TextView[@text='Sign out']`
    private filtersButton = `filters button#xpath=//android.widget.TextView[@text='Filters']`
    private filterOptions = `filter options#xpath=//android.view.View[@content-desc]`
    private educatorSelectedInFilter = `educator name selected in filter#xpath=(//android.widget.TextView[@text='Selected Filters:']//..//android.widget.TextView)[2]`
    private langSelectedInFilter = `languages selected in filter#xpath=(//android.widget.TextView[@text='Selected Filters:']//..//android.widget.TextView)[3]`
    private subjectsSelectedInFilter = `subjects selected in filter#xpath=(//android.widget.TextView[@text='Selected Filters:']//..//android.widget.TextView)[4]`
    private agesSelectedInFilter = `ages selected in filter#xpath=(//android.widget.TextView[@text='Selected Filters:']//..//android.widget.TextView)[5]`

    /* functions */

    public waitForLogInPage = async (): Promise<void> => {
        const isLabelDisplayed: any = await this.isElementDisplayed(this.loginLabel)
        expect(isLabelDisplayed).toBe(true)
    }

    public isAboutMeTitleDisplayed = async (): Promise<any> => {
        return await this.isElementDisplayed(this.aboutMeTitle)
    }

    public isTitleDisplayed = async (option: string): Promise<any> => {
        const locator = `${option}#xpath=//android.widget.TextView[@text="${option}"]`
        return await this.isElementDisplayed(locator)
    }

    public logIn = async (idValue: string, passwordValue: string): Promise<void> => {
        await this.typeIn(this.emailField, idValue)
        await this.typeIn(this.passwordField, passwordValue)
        // await this.clickOn(this.loginButton)
        await this.clickOn(this.guestUserButton)
    }

    public signOut = async (): Promise<void> => {
        await this.clickOn(this.accountLogo)
        await this.clickOn(this.signOutButton)
        await this.waitForLogInPage()
    }

    public performClick = async (option: string, option2?: string): Promise<void> => {
        switch (option.toLowerCase().replace(/ +/g, "")) {
            case "guestuserbutton":
                await this.clickOn(this.guestUserButton)
                break
            case "educatorsicon":
                await this.clickOn(this.educatorsIcon)
                break
            case "clicktitle":
                const locator = `${option2}#xpath=//android.widget.TextView[@text="${option2}"]`
                await this.clickOn(locator)
                break
            case "myvideostab":
                await this.clickOn(this.myVideosTab)
                break
            case "backbutton":
                await this.clickOn(this.backButton)
                break
            case "aboutmetab":
                await this.clickOn(this.aboutMeTab)
                break
            case "educatorsbackbutton":
                await this.clickOn(this.educatorsBackButton)
                break
            case "explorericon":
                await this.clickOn(this.explorerIcon)
                break
            case "callingallartistsimage":
                await this.clickOn(this.callingAllArtistsImage)
                break
            case "proskillsimage":
                await this.clickOn(this.proSkillsImage)
                break
            case "geekoutimage":
                await this.clickOn(this.geekOutImage)
                break
            case "filtersbutton":
                await this.clickOn(this.filtersButton)
                break
            default:
                throw new Error(`${option} is not mentioned in switch case`)
        }
    }

    public playVideoOfAnEducator = async (educatorName: string, videoName: string): Promise<void> => {
        await this.performClick("click title", educatorName)
        logger.info(`${educatorName} selected as educator`)
        expect(await this.isAboutMeTitleDisplayed()).toBeTruthy()
        await this.performClick("my videos tab")
        await this.performClick("click title", videoName)
        logger.info(`${videoName} video is selected`)
    }

    public navigateToEducatorsHome = async (): Promise<void> => {
        await this.performClick("Back button")
        await this.waitTime(1)
        logger.info("Navigated back to video tab")
        await this.performClick("Educators back button")
        console.log("Navigated back to educators home")
    }

    public verifyVideoAndAuthor = async (video: string, author: string) => {
        let result: boolean = false
        const pageContent = await $$("//android.view.ViewGroup//android.widget.TextView")
        for (var i = 0; i < pageContent.length; i++) {
            await pageContent[i].waitForExist({ timeout: 30000 })
            const text = await pageContent[i].getText()
            console.log(`text extracted is ${text}`)
            if (text.match(video)) {
                const text2 = await pageContent[i + 1].getText()
                if (text2.match(author)) {
                    result = true
                    break
                }
            }
        }
        if (result) {
            console.log(`${video} and the ${author} is verified`)
            logger.info(`${video} and the ${author} is verified`)
        }
        else {
            throw new Error(`Video: ${video} and the Author: ${author} details were wrong`)
        }
    }

    public async getFilterOptions(): Promise<String[]> {
        return await this.getAllAttributeValues(this.filterOptions, "content-desc")
    }

    public getSelectedFilter = async (filterName: string, filterOption: string) => {
        switch (filterName.toLowerCase()) {
            case "educators":
                await this.scrollUsingCoordinates(2190, 647)
                await this.performClick("click title", filterOption)
                return await this.getText(this.educatorSelectedInFilter)
            case "languages":
                await this.scrollUsingCoordinates(647, 2190)
                await this.clickBasedOnAttribute(this.filterOptions, "content-desc", filterName)
                await this.performClick("click title", filterOption)
                return await this.getText(this.langSelectedInFilter)
            case "subjects":
                await this.clickBasedOnAttribute(this.filterOptions, "content-desc", filterName)
                await this.performClick("click title", filterOption)
                return await this.getText(this.subjectsSelectedInFilter)
            case "ages":
                await this.clickBasedOnAttribute(this.filterOptions, "content-desc", filterName)
                await this.performClick("click title", filterOption)
                return await this.getText(this.agesSelectedInFilter)
            default:
                throw new Error(`${filterName} provided is not valid`)
        }
    }

    public async scrollToProSkillsImage(): Promise<void> {
        await this.scrollToView(this.explorerImages, this.proSkillsImage)
    }
}