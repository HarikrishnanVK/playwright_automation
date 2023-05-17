import { CMH } from '../../pages/cmh.page'
import { logger } from '../../helpers/logger'

let page: CMH

describe("Android : Native App => Children's Museum Houseton tests", () => {
    beforeEach(async () => {
        page = new CMH()

        // launch the app and wait for main screen
        await page.launchApplication()
        await page.waitForLogInPage()
        logger.info("App main screen is loaded")

        // Sign-in 
        await page.logIn("kostfeld13@gmail.com", "1500-T3sting")
        logger.info("Signed in")
    })

    it("Verify educators video information", async () => {

        // Click on educators icon
        await page.performClick("educators icon")

        // Verify educator details of "Andrea Hernandez"
        await page.playVideoOfAnEducator("Andrea Hernandez", "Stomp Rockets")
        expect(await page.isTitleDisplayed("By Andrea Hernandez")).toBeTruthy()
        await page.navigateToEducatorsHome()

        // Verify educator details of "Belkis Hernandez"
        await page.playVideoOfAnEducator("Belkis Hernandez", "Haz Una Alcancía")
        expect(await page.isTitleDisplayed("By Belkis Hernandez")).toBeTruthy()
        await page.navigateToEducatorsHome()
    })

    it("Verify Calling All Artists and Geek Out from Explorer view", async () => {

        // Click on explorer view
        await page.performClick("Explorer icon")
        await page.waitTime(1)

        // Click 'Calling All Artists' image
        await page.performClick("Calling all artists image")
        await page.waitTime(3)

        // Check Story Bags and Seussian Structures videos displayed with author names
        await page.verifyVideoAndAuthor("Story Bags", "VIRIDIANA JARILLO")
        await page.verifyVideoAndAuthor("Seussian Structures", "JASON HAMMOND")

        await page.performClick("Back button")
        await page.waitTime(1)

        // Click 'Geek Out' image
        await page.performClick("Geek out image")
        await page.waitTime(3)

        // Check Story Bags and Seussian Structures videos displayed with author names
        await page.verifyVideoAndAuthor("Electroscope!", "JOHN BARTLETT")
        await page.verifyVideoAndAuthor("Diy Animal Cell", "JASON HAMMOND")
    })

    it("Verify video filters are working", async () => {

        // Select an image
        await page.performClick("Explorer icon")
        await page.waitTime(0.5)
        await page.scrollUsingCoordinates(2190, 647)
        await page.performClick("Pro Skills Image")

        // Verify filters options are present 
        await page.performClick("Filters button")
        await page.waitTime(1)
        const optionInFilter = await page.getFilterOptions()
        expect(optionInFilter).toHaveText("Educators")
        expect(optionInFilter).toHaveText("Languages")
        expect(optionInFilter).toHaveText("Subjects")
        expect(optionInFilter).toHaveText("Ages")

        // Verify filter works
        const selectedEducator = await page.getSelectedFilter("Educators", "Tiffany Espinosa")
        expect(selectedEducator).toEqual("Tiffany Espinosa")
        const selectedLanguage = await page.getSelectedFilter("Languages", "Español")
        expect(selectedLanguage).toEqual("Español")
        const selectedSubject = await page.getSelectedFilter("Subjects", "Social Studies")
        expect(selectedSubject).toEqual("Social Studies")
        const selectedAges = await page.getSelectedFilter("Ages", "11")
        expect(selectedAges).toEqual("11")

        // Play the video appeared from filter
        await page.performClick("Back button")
        await page.waitTime(2)
        await page.verifyVideoAndAuthor("Cadena Comunitaria", "Tiffany Espinosa".toUpperCase())
        await page.performClick("click title", "Cadena Comunitaria")
        expect(await page.isTitleDisplayed("By Tiffany Espinosa")).toBeTruthy()
    })

    afterEach(async () => {
        await page.closeApp()
    })
})
