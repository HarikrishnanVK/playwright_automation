import { test, expect } from '@playwright/test'

const searchKeys = ["India", "China", "Australia"]

searchKeys.forEach(data => {
  test(`data driven test on google search ${data}`, async ({ page }) => {
    await page.goto("https://in.search.yahoo.com/")
    const searchBox = page.locator("input[type='text']")
    await searchBox.fill(data)
    await page.click("button[type='submit']")
    await page.waitForLoadState()
    const title = await page.title()
    expect(title).toContain("China")
  })
})

test.describe('Form test', () => {
  test.beforeEach(async ({ page, context }) => {
    await page.goto("https://demoqa.com/automation-practice-form");
  });

  test(`QA Demo form`, async ({ page }) => {
    await page.fill("#firstName", "Tommy");
    await page.fill("#lastName", "Shelby");
    await page.click('#gender-radio-1', { force: true });
    await page.fill("#userNumber", "9999988888");
    await page.check('#hobbies-checkbox-1', { force: true });
    await page.setInputFiles('#uploadPicture', 'C:/Users/Indium Software/Pictures/tommy-shelby.jpg');
    await page.click('#submit', { force: true })
  });
});

test.describe('findelements', () => {
  test.beforeEach(async ({ page, context }) => {
    await page.goto("https://flipkart.com");
  });

  test('get best electronic product names and price from flipkart', async ({ page }) => {

    await page.click(`//button[text()='✕']`);
    let listOfProducts = page.locator(`//div[@data-tracking-id='Best of Electronics']//a//div[2]`);
    let listOfPrice = page.locator(`//div[@data-tracking-id='Best of Electronics']//a//div[3]`);

    /*reference for iteration*/
    let productNames = await listOfProducts.allTextContents();

    console.log(`running 'for' loop >>>>>>>>>`, '\n');
    for (var i = 0; i < productNames.length; i++) {
      let productName = await listOfProducts.nth(i).textContent();
      let price = await listOfPrice.nth(i).textContent();
      if (price?.includes("Shop Now")) {
        continue;
      }
      console.log(`Product name = ${productName} and price is ${price}`);
    }

    console.log(`running 'While' loop >>>>>>>>>`, '\n');
    let count = 0;
    do {
      let productName = await listOfProducts.nth(count).textContent();
      let price = await listOfPrice.nth(count).textContent();
      if (price?.includes("Shop Now")) {
        count++;
        continue;
      }
      console.log(`Product name = ${productName} and price is ${price}`);
      count++;
    } while (count < productNames.length);

    console.log(`running 'forEach' loop >>>>>>>>>`, '\n');
    productNames.forEach(async (product, index) => {
      let price = await listOfPrice.nth(index).textContent();
      if (price?.includes("Shop Now")) {
        //don't print the output
      } else {
        console.log(`Product name = ${product} and price is ${price}`);
      }
    })
  })
})

