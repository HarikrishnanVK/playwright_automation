import { test } from "@playwright/test"

let accessToken: string
let messageID: string

test("Get messages from Gmail", async ({ request, baseURL, page }) => {

    /*Generate refresh token*/
    await page.goto("https://accounts.google.com/o/oauth2/v2/auth?scope=https://mail.google.com&access_type=offline&redirect_uri=http://localhost&response_type=code&client_id=252334850057-dmhqug3iedvs4es0lji6p7c4qp873k38.apps.googleusercontent.com")
    await page.waitForLoadState()
    const url =  page.url()
    console.log(`Redirected url with code ${url}`)
    
    /*Get new access token using refresh token*/
    let response = await request.post(`https://accounts.google.com/o/oauth2/token`, {
        data: {
            client_id: "252334850057-dmhqug3iedvs4es0lji6p7c4qp873k38.apps.googleusercontent.com",
            client_secret: "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",
            refresh_token: "1//0gkDFW-NjgY5uCgYIARAAGBASNwF-L9Ir2Z_oRcpIHf6vbjumsg4FGYc4WYmYhLbs1ovsNP94eZ1cjxIsDGnnu4DjyMb2Dw27DUs",
            grant_type: "refresh_token"
        },
        ignoreHTTPSErrors: true,
        timeout: 30000
    })
    const responseBody = await response.json()
    console.log(`Response from Gmail API for oauth is ${await response.body()}`)
    console.log(`Response code from Gmail API for oauth is ${response.status()}`)
    accessToken = await responseBody.access_token
    console.log(`access token is ${accessToken}`)

    /*Get message id using access token generated*/

    const messageIDResponse = await request.get(`${baseURL}/gmail/v1/users/me/messages`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        },
        params: {
            subject: "verification code"
        }
    })
    const messageIDs = await messageIDResponse.json()
    console.log(`Response from get message ids is ${await messageIDResponse.body()}`)
    console.log(`Response code from get message ids is ${messageIDResponse.status()}`)
    messageID = await messageIDs.messages[1].id
    console.log(`Message id captured from json is ${messageID}`)

    const messageBodyResponse = await request.get(`${baseURL}/gmail/v1/users/me/messages/${messageID}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
    const messageJson = await messageBodyResponse.json()
    console.log(`Whole message Json body is ${await messageBodyResponse.body()}`)
    console.log(`Response code from get message body is ${messageBodyResponse.status()}`)
    const message = await messageJson.snippet
    console.log(`Needed message from latest mail is is ${message}`)
})