import { Page, BrowserContext } from "@playwright/test"
import {logger} from "../helpers/logger"
import * as xlsx from "xlsx"
import * as excel from "exceljs"

export class IndiumCareers {

  private page: Page
  private context: BrowserContext

  constructor(page: Page, context: BrowserContext) {
    this.page = page
    this.context = context
  }

  /* selectors */

  public categoryDD = "select[id=category]"
  public jobTypeDD = "select[id=jobtype]"
  public locationDD = "select[id=location]"
  private searchCareer = "input[type='submit']"
  private searchResults = "//div[@class='sjb-listing']//div[@class='list-view']//p"

  /*functions*/

  async selectValueFromCareersDropdown(selector: string, ddValue: string) {
    await this.page.selectOption(selector, ddValue)
  }

  async navigateToUrl(url: string) {
    await this.page.goto(url)
    await this.page.waitForLoadState()
  }

  async closeSession() {
    await this.page.close()
    await this.context.close()
  }

  async runSearch() {
    await this.page.click(this.searchCareer);
    await this.page.waitForLoadState('domcontentloaded')
  }

  async verifyResults() {
    let actualResult = await this.page.locator(this.searchResults).allTextContents()
    if (actualResult.includes("Apply Now")) {
      logger.info(`Jobs are available`)
    } else if (actualResult.includes("No jobs found")) {
      logger.info(`Jobs are not available`)
    } else {
      throw new Error(`${actualResult} does not match with job results`)
    }
  }

  async convertExcelDataToJson(filePath: string, sheetName: string): Promise<JSON[]> {
    const workbook = xlsx.readFile(filePath)
    const worksheet = workbook.Sheets[sheetName]
    const unknownData: unknown = xlsx.utils.sheet_to_json(worksheet)
    return unknownData as JSON[]
  }

  async readDataFromExcel(excelFileName: string, columnName: string): Promise<string[]> {
    var arrayOfData: string[] = []
    const workbook = new excel.Workbook()
    const excelFile = await workbook.xlsx.readFile(excelFileName)
    const worksheet = excelFile.worksheets[0]
    const rowData = worksheet.getRows(1, worksheet.rowCount)!
    let columnIndex;
    for (let i = 1; i < rowData.length; i++) {
      for (let j = i; j < rowData.length; j++) {
        const colName = worksheet.getCell(i, j).value?.toString()!
        if (colName.match(columnName)) {
          columnIndex = j;
          console.log(`${columnName} is present in column ${j}`)
          break;
        }
      }
      break;
    }
    for (let i = 1; i < rowData.length; i++) {
      arrayOfData.push(worksheet.getCell(i + 1, columnIndex).value?.toString()!)
    }
    return arrayOfData
  }

}