import { test } from '@playwright/test'
import { IndiumCareers } from '../../pages/indium_careers.page'
import { IndiumCareersData } from '../../test_data/test_data.json'

let careers: IndiumCareers

test.describe(`Indium careers site test cases`, async () => {
    test.beforeEach(async ({page, context}) => {
        careers = new IndiumCareers(page, context)
        await careers.navigateToUrl(IndiumCareersData.baseURL)
    })

    test(`Search jobs in indium careers`, async () => {
        let category = await careers.readDataFromExcel("./test_data/careersData.xlsx", "Category")
        let jobs = await careers.readDataFromExcel("./test_data/careersData.xlsx", "Jobtype")
        let location = await careers.readDataFromExcel("./test_data/careersData.xlsx", "Location")
        for (let i = 0; i < category.length; i++) {
            await careers.selectValueFromCareersDropdown(careers.categoryDD, category[i])
            await careers.selectValueFromCareersDropdown(careers.jobTypeDD, jobs[i])
            await careers.selectValueFromCareersDropdown(careers.locationDD, location[i])
            await careers.runSearch()
            await careers.verifyResults()
        }
    })

    test.afterEach(async ()=>{
        await careers.closeSession()
    })
})