import { expect, Locator, Page, BrowserContext, Browser, devices, chromium } from "@playwright/test";
import { logger } from "./logger";
import { test } from '@playwright/test';
import * as fs from "fs"

export class WebBase {

    private _webElement!: Locator;
    private _webElementName = "";
    private _webElementIdentifier = "";
    private _webElementLocator = "";
    public elementTimeOut = 30 * 1000;

    private browser!: Browser
    private page!: Page | undefined
    private context!: BrowserContext
    private isMobile: Boolean = false


    private async testStepPassed(message: string): Promise<void> {
        logger.info(message);
        console.log(message);
        await test.step(message, () => { })
    }

    private async testStepFailed(message: string): Promise<void> {
        console.log(message)
        logger.error(message)
        //await test.step(message, () => { })
        throw new Error(`Test failed due to ${message}`)
    }

    /**
         * The element would be given as follows:
         * Books Link#css=div#nav-xshop>a[href*='Books']`
         * Using the index of the characters '#' and '=', we are separating the element name,
         * the identifier and the locator
         * We are then assigning these to the following variables:
         * _webElementName
         * _webElementIdentifier
         * _webElementLocator
         * These global variables would then be used while identifying elements and operating on them
         * @param objectLocator e.g: Link#css=div#nav-xshop>a[href*='Books']`
        */
    private _parseAndIdentifyBy(objectLocator: string): void {
        const indexOfHash: number = objectLocator.indexOf("#");
        logger.debug(`indexOfHash = '${indexOfHash}'`);

        const indexOfEqualTo: number = objectLocator.indexOf("=");
        logger.debug(`indexOfEqualTo = '${indexOfEqualTo}'`);

        // Element name would be the part of the string starting from the first character
        // till the index of the character '#', which would be 'Books Link'
        this._webElementName = objectLocator.substring(0, indexOfHash).trim();
        logger.debug(`_webElementName = '${this._webElementName}'`);

        // Element identifier would be the part of the string starting from the character next to '#'
        // till the index of the character '=',  which would be 'css'
        this._webElementIdentifier = objectLocator.substring(indexOfHash + 1, indexOfEqualTo);
        logger.debug(`_webElementIdentifier = '${this._webElementIdentifier}'`);

        // Element locator would be the part of the string starting from the character next to '='
        // till the end, which would be 'div#nav-xshop>a[href*='Books']'
        this._webElementLocator = objectLocator.substring(indexOfEqualTo + 1);
        logger.debug(`_webElementLocator = '${this._webElementLocator}'`);
        return;

    }

    public async launchDevice(device: string): Promise<Boolean> {
        try {
            !device.includes("Desktop") ? this.isMobile = true : this.isMobile = false
            this.browser = await chromium.launch({
                headless: false,
            })
            this.context = await this.browser.newContext(devices[device])
            this.page = await this.context.newPage();
            this.testStepPassed(`Running the test in ${device}`)
        } catch (error) {
            this.testStepFailed(`Test did not start on the ${device} due to ${error}`)
        }
        return this.isMobile
    }

    /**
     * This function would be used to find the element with the identifier and the locator.  Like the
     * 'parseAndIdentifyBy' function, this function would also be called by all the reusable functions like 'clickOn' etc.
     */
    private async _findWebElement(): Promise<Locator> {
        switch (this._webElementIdentifier.toLowerCase()) {
            case "xpath":
            case "css":
                try {
                    await this.page!.waitForSelector(this._webElementLocator, { timeout: this.elementTimeOut });
                }
                catch {
                    await this.page!.waitForSelector(this._webElementLocator, { strict: false, timeout: 30000, state: 'hidden' })
                }
                await this.page!.focus(this._webElementLocator);
                this._webElement = this.page!.locator(this._webElementLocator);
                break;
            default:
                logger.error(`Element Identifier ${this._webElementIdentifier} not coded in findWebElement`);
                console.log(`Element Identifier ${this._webElementIdentifier} not coded in findWebElement`);
                break;
        }

        return this._webElement;
    }

    public async findWebElement(objectLocator: string): Promise<Locator> {
        this._parseAndIdentifyBy(objectLocator);
        return this._findWebElement();
    }

    public async isTextAreaEmpty(selector: string): Promise<Boolean> {
        var result: boolean = false
        const text = await this.getAllText(selector)
        if (text.toString() == "") {
            result = true
        } else {
            result = false
        }
        return result
    }

    public async clickOn(locator: string) {
        try {
            await this.isElementEnabled(locator);
            await (await this.findWebElement(locator)).click();
            this.testStepPassed(`clicked on the '${this._webElementName}' selector`);
        } catch (err) {
            this.testStepFailed(`click action not performed on the '${this._webElementName}' selector due to '${err}'`);
        }
    }

    public async refreshPage() {
        try {
            await this.page!.reload({ waitUntil: 'domcontentloaded' })
            this.testStepPassed(`page reloaded to load elements`);
        } catch (err) {
            this.testStepFailed(`Reload failed due to '${err}'`);
        }
    }


    public async mouseHover(locator: string) {
        try {
            await this.isElementEnabled(locator);
            await (await this.findWebElement(locator)).hover();
            this.testStepPassed(`Mouse hovered on the '${this._webElementName}' selector`);
        } catch (err) {
            this.testStepFailed(`Mouse hover not performed on the '${this._webElementName}' selector due to '${err}'`);
        }
    }

    public async navigateToURL(url: string) {
        try {
            await this.page!.goto(url)
            await this.page!.waitForTimeout(5000)
            await this.page!.waitForLoadState('domcontentloaded')
            this.testStepPassed(`Navigated to ${url}`);
        } catch (err) {
            this.testStepFailed(`Navigation to '${url}' failed due to '${err}'`);
        }
    }

    public async doubleClickOn(locator: string) {
        try {
            await this.isElementEnabled(locator);
            await (await this.findWebElement(locator)).dblclick();
            this.testStepPassed(`double clicked on the '${this._webElementName}' selector`);
        } catch (err) {
            this.testStepFailed(`click action not performed on the '${this._webElementName}' selector due to '${err}'`);
        }
    }

    public async typeIn(locator: string, inputText: string): Promise<void> {
        try {
            await this.isElementDisplayed(locator);
            await (await this.findWebElement(locator)).fill(inputText);
            this.testStepPassed(`entered text on '${this._webElementName}' selector`);
        } catch (err) {
            this.testStepFailed(`Type action not performed on the '${this._webElementName}' selector due to '${err}'`);
        }
    }

    public async enterKeyCommands(key: string): Promise<void> {
        try {
            await this.page!.keyboard.press(key);
            this.testStepPassed(`pressed the ${key} key`);
        } catch (error) {
            this.testStepFailed(`${key} key is not pressed due to ${error}`);
        }
        return;
    }

    public async enterKeyCommandsOnWebElement(keys: string, locator: string): Promise<void> {
        try {
            await (await this.findWebElement(locator)).press(keys);
            this.testStepPassed(`pressed the ${keys} key on ${locator}`);
        } catch (error) {
            this.testStepFailed(`${keys} key press failed on the ${locator} due to ${error}`);
        }
    }

    public async getText(locator: string): Promise<string | null> {
        let text: string = ""
        try {
            await (await this.findWebElement(locator)).textContent();
            this.testStepPassed(`Obtained text ${text} from the ${locator}`);
        } catch (err) {
            this.testStepFailed(`Unable to extract text using '${locator}' selector due to '${err}'`);
        }
        return text
    }

    public async getAttributeValue(locator: string, propertyName: string): Promise<string | null> {
        let attribute: string = ""
        try {
            await this.findWebElement(locator);
            await this.page!.getAttribute(this._webElementLocator, propertyName!);
            this.testStepPassed(`Obtained text ${attribute} from the ${this._webElementName}`);
        } catch (err) {
            this.testStepFailed(`Unable to extract '${propertyName}' value using '${this._webElementName}' selector due to '${err}'`);
        }
        return attribute
    }

    public async getAttributeValueWithoutVisibilityCheck(locator: string, propertyName: string): Promise<string | null> {
        let attribute: string = ""
        try {
            await this.findWebElement(locator);
            await this.page!.getAttribute(this._webElementLocator, propertyName!, { strict: false });
            this.testStepPassed(`Obtained text ${attribute} from the ${this._webElementName}`);
        } catch (err) {
            this.testStepFailed(`Unable to extract '${propertyName}' value using '${this._webElementName}' selector due to '${err}'`);
        }
        return attribute
    }

    public async isElementHidden(locator: string): Promise<boolean> {
        this._webElement = this.page!.locator(locator);
        return this._webElement.isHidden();
    }

    public async isElementEnabled(locator: string): Promise<boolean> {
        const locatorState = await this.findWebElement(locator);
        await expect(locatorState).toBeEnabled({ timeout: this.elementTimeOut });
        this.testStepPassed(`${this._webElementName} is enabled`);
        return (await this.findWebElement(locator)).isEnabled()
    }

    public async isElementDisplayed(locator: string): Promise<boolean> {
        const locatorState = await this.findWebElement(locator);
        await expect(locatorState).toBeVisible({ timeout: this.elementTimeOut });
        this.testStepPassed(`${this._webElementName} is displayed`);
        return (await this.findWebElement(locator)).isVisible()
    }

    public async waitForSeconds(sec: number) {
        return new Promise<void>(resolve => setTimeout(() => resolve(), sec * 1000));
    }

    public async waitForMinutes(ms: number): Promise<void> {
        return new Promise<void>(resolve => setTimeout(() => resolve(), ms * 10000));
    }

    public async getpageTitle(): Promise<string> {
        let pageTitle: string = ""
        try {
            pageTitle = await this.page!.title();
            this.testStepPassed(`got page title from ${this._webElementName}`);
        } catch (error) {
            this.testStepFailed(`get page title from ${this._webElementName} failed due to the following error: ${error}`);
        }
        return pageTitle;
    }

    public async getAllText(locator: string): Promise<string[]> {
        let allText: string[] = []
        try {
            allText = await (await this.findWebElement(locator)).allTextContents();
            this.testStepPassed(`'${allText}' are extracted from '${this._webElementName}'`);
        } catch (err) {
            this.testStepFailed(`Unable to extract collection of text using '${this._webElementName}' selector due to '${err}'`);
        }
        return allText
    }

    public async writeInFile(filePath: string, data: string): Promise<void> {
        try {
            fs.writeFileSync(filePath, data);
            this.testStepPassed(`'${data}' values written in textfile`);
        }
        catch (error) {
            this.testStepFailed(`can't write to file due to the following error: ${error}`);
        }
    }

    public async switchToNewPage(): Promise<Page | undefined> {
        let newWindow!: Page
        await this.waitForSeconds(3)
        try {
            let pages = this.context.pages()
            newWindow = pages[1]
            await newWindow.waitForLoadState('domcontentloaded')
            this.testStepPassed(`switched to window with title as ${await newWindow.title()}`)
        } catch (err) {
            this.testStepFailed(`Unable to switch to new page due to '${err}'`);
        }
        this.page = newWindow
        return newWindow
    }

    public async readFileData(filePath: string): Promise<any> {
        let fileData: any = "";
        try {
            fileData = fs.readFileSync(filePath, "utf8");
            this.testStepPassed(`values read from in textfile`);
        }
        catch (error) {
            console.log("Cannot read file ", error);
            this.testStepFailed(`read action failed due to the following error: ${error}`);
        }
        return fileData;
    }

    public async ReplaceXmlFiles(sourceFilePath: string, destFilePath: string): Promise<void> {
        var fs = require('fs');
        try {
            fs.copyFileSync(sourceFilePath, destFilePath);
            this.testStepPassed(`File Moved from '${sourceFilePath}' to '${destFilePath}'`);
        }
        catch (error) {
            this.testStepFailed(`File not moved: ${error}`);
        }
    }

    public async selectDataFromList(objectLocator: string, actualText: string): Promise<void> {
        try {
            this._webElement = await this.findWebElement(objectLocator);
            const countOfElements = await (await this.findWebElement(objectLocator)).count();
            for (let i = 0; i < countOfElements; i++) {
                const expectedText = await this._webElement.nth(i).textContent({ timeout: this.elementTimeOut });
                if (actualText == expectedText) {
                    await this._webElement.nth(i).click();
                    this.testStepPassed(`${actualText} is selected using ${this._webElementName}`);
                    break;
                }
            }
        } catch (error) {
            this.testStepFailed(`value is not selected from '${this._webElementName}' list due to ${error}`);
        }
    }

    public async selectDataFromDropdown(locator: string, ddValue: string) {
        try {
            await this.findWebElement(locator);
            await this.page!.selectOption(this._webElementLocator, ddValue)
            this.testStepPassed(`${ddValue} value is selected from '${this._webElementName}'`);
        }
        catch (error) {
            this.testStepFailed(`${ddValue} value is not selected from '${this._webElementName}' due to ${error}`);
        }
    }

    public async verifyListOfData(objectLocator: string, values: string): Promise<void> {
        let actualArray: string[] = [];
        try {
            this._webElement = await this.findWebElement(objectLocator);
            const countOfElements = await (await this.findWebElement(objectLocator)).count();
            if (values.includes(",")) {
                actualArray = values.split(",");
                actualArray.sort();
            }
            else {
                actualArray = [values];
            }
            let expectedArray: any = [];
            for (var i = 0; i < countOfElements; i++) {
                expectedArray!.push((await this._webElement.nth(i).textContent())!.trim());
            }
            expectedArray.sort();
            expect(actualArray.toString()).toEqual(expectedArray.toString());
        } catch (error) {
            this.testStepFailed("list verification failed due to " + error);
        }
    }

    public async getCountOfElementInString(objectLocator: string): Promise<string> {
        this._webElement = await this.findWebElement(objectLocator);
        return (await this._webElement.count()).toString();
    }

    public async scrollToElement(objectLocator: string): Promise<void> {
        try {
            this._webElement = await this.findWebElement(objectLocator);
            await this._webElement.waitFor({ timeout: this.elementTimeOut });
            await this._webElement.scrollIntoViewIfNeeded();
            this.testStepPassed(`Scroll action performed on '${this._webElementName}'`);
        } catch (error) {
            logger.error(`Scroll action failed due to : ${error}`);
        }
    }

    public async captureSystemDateTime(): Promise<string> {
        let systemDate: string = "";
        try {
            const date_ob = new Date();
            let date = ("" + (date_ob.getDate())).slice(-2);
            const month = date_ob.toLocaleString('en-us', { month: 'short' });
            const year = date_ob.getFullYear();
            let hours = (date_ob.getHours());
            const minutes = (date_ob.getMinutes());
            const seconds = (date_ob.getSeconds());
            const newformat = hours >= 12 ? "PM" : "AM";
            const dHours = hours.toString().length;
            const dDate = date.toString().length;
            let newHour = hours.toString();
            let newDate = date.toString();
            newHour = dHours == 1 ? 0 + newHour : newHour;
            newDate = dDate == 1 ? 0 + newDate : newDate;
            systemDate = newDate + "-" + month + "-" + year + " " + newHour + ":" + minutes + ":" + seconds;
            this.testStepFailed(`captured system date and time : ${systemDate}`);
        } catch (error) {
            this.testStepFailed(`unable to capture system date and time due to : ${error}`);
        }
        return systemDate;
    }

    public async closeApplication(): Promise<void> {
        try {
            await this.page!.close()
            await this.context.close()
            this.testStepPassed("page closed");
        }
        catch (err) {
            logger.log("skip the error if app is not closed and continue remaining cases")
        }
    }

    public async getPageSourceCode(): Promise<string> {
        var sourceCode: string = "";
        try {
            sourceCode = await this.page!.content();
            this.testStepPassed("source code captured successfully");
        } catch (error) {
            this.testStepFailed("source code not captured due to " + error);
        }
        return sourceCode;
    }

    public async getHTMLFromWebElement(objectLocator: string): Promise<string> {
        let html: string = "";
        try {
            this._webElement = await this.findWebElement(objectLocator);
            await this._webElement.waitFor({ timeout: this.elementTimeOut });
            html = await this._webElement.innerHTML();
            this.testStepPassed(`'${this._webElementName}' HTML is captured`);
        } catch (error) {
            this.testStepFailed(`unable to capture HTML due to the following error: ${error}`);
        }
        return html;
    }

    public async getProjectDirectory(): Promise<string> {
        var dir: string = "";
        try {
            dir = process.cwd();
        } catch (error) {
            this.testStepFailed(`unable to capture project path due to the following error: ${error}`);
        }
        return dir;
    }

    public async getFilesInDirectory(filePath: string, fileName: string): Promise<boolean> {
        let flag = false;
        try {
            const files = fs.readdirSync(filePath);
            files.forEach(file => {
                if (file === fileName) {
                    flag = true;
                }
            })
        } catch (error) {
            this.testStepFailed(`unable to capture files from directory due to the following error: ${error}`);
        }
        return flag;
    }

    public async verifySystemFilePresent(filePath: string): Promise<boolean> {
        let fileExists = false;
        try {
            fileExists = fs.existsSync(filePath);
            this.testStepPassed(`file is present at ${filePath}`);
        } catch (error) {
            this.testStepFailed(`file verification failed due to the following error: ${error}`);
        }
        return fileExists;
    }

    public async deleteSystemFile(filePath: string, throwOnFailure?: boolean) {
        try {
            fs.unlinkSync(filePath);
        }
        catch (e) {
            console.warn("deleteSystemFile", e);
            if (throwOnFailure) {
                throw e;
            }
        }
    }

    public async returnLinesOfString(objectLocator: string): Promise<string[]> {
        const linesOfString: string[] = [];
        try {
            this._webElement = await this.findWebElement(objectLocator)
            const wholeText = await this._webElement.innerText()
            const linesOfText: string[] = wholeText.toString().split("\n");
            for (const text of linesOfText) {
                linesOfString.push(text.trim());
            }
            this.testStepPassed("lines of string returned : " + linesOfString);
        } catch (error) {
            this.testStepFailed("lines of string not returned due to " + error);
        }
        return linesOfString;
    }

    public async returnElementStatus(objectLocator: string): Promise<boolean> {
        let isDisplayed = false;
        try {
            isDisplayed = await this.page!.locator(objectLocator).isVisible({ timeout: 2000 });
            this.testStepPassed(`element status returned is ${isDisplayed}`)
        } catch (error) {
            logger.error(`waiting for element to appear`);
        }
        return isDisplayed;
    }

    public async takeScreenshot(name: string): Promise<void> {
        try {
            await this.page!.screenshot({ path: `../reports/screenshots/screenshot_${name}.png`, fullPage: true });
            this.testStepFailed(`${name} screenshot is taken`);
        }
        catch (error) {
            this.testStepFailed(`${name} screenshot not taken due to ${error}`);
        }
    }
}
