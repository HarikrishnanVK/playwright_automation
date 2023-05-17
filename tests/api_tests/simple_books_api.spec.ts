/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { expect, test } from '@playwright/test'

let authorizationToken: string
let orderID: string

/* GET Request */

test('Verify status code of Simple books API', async ({ request, baseURL }) => {
  /* validate status */
  const response = await request.get(`${baseURL}/status`)
  console.log(`status of ${baseURL} is ${response.statusText()}`)
  expect(response.status()).toBe(200)
  expect(response.ok).toBeTruthy()

  /* get list of books */
  const listOfBooks = await request.get(`${baseURL}/books`)
  console.log(await listOfBooks.json())

  /* get only the non-fiction books using query params */
  const fictionType = await request.get(`${baseURL}/books`, {
    params: {
      type: 'fiction',
      limit: 2
    }
  })
  console.log(await fictionType.json())

  /* get complete details of book using path variable */
  const detailsOfBook = await request.get(`${baseURL}/books/2`)
  console.log(`details of 'Just as I am" book is ${await detailsOfBook.body()}`)
})

/* Post Request */

test('Verify authorization and order the books', async ({ request, baseURL }) => {
  /* Register the client */
  const response = await request.post(`${baseURL}/api-clients/`, {
    data: {
      clientName: `API_Test_${Math.random()}`,
      clientEmail: `apitest${Math.random()}@example.com`
    }
  })
  console.log(`status of ${baseURL}/api-clients/ is ${response.statusText()}`)
  expect(response.status()).toBe(201)
  console.log(`auth token is ${await response.body()}`)
  authorizationToken = await JSON.parse(await response.text())
  authorizationToken = Object.values(authorizationToken)[0]
  console.log(`access token is ${authorizationToken}`)

  /* order a book */
  const orderConfirmation = await request.post(`${baseURL}/orders`, {
    headers: {
      Authorization: `Bearer ${authorizationToken}`
    },
    data: {
      bookId: 3,
      customerName: 'Shelby'
    }
  })
  const orderDetails = await orderConfirmation.json()
  console.log(`Response Body of ordered book details are ${orderDetails}`)
  expect(orderConfirmation.status()).toBe(201)
  const createdStatus: boolean = await orderDetails.created
  expect(createdStatus).toBeTruthy()
  orderID = await orderDetails.orderId
})

/* Patch Request */

test('Update the order using id with patch request', async ({ request, baseURL }) => {
  /* get order details of created order */
  const orderDetails = await request.get(`${baseURL}/orders/${orderID}`, {
    headers: {
      Authorization: `Bearer ${authorizationToken}`
    }
  })
  console.log(`order details before modification is ${await orderDetails.body()}`)
  const reponseBody = await JSON.parse(await orderDetails.text())
  const customerName = await reponseBody.customerName
  expect(await customerName).toBe('Shelby')
  const response = await request.patch(`${baseURL}/orders/${orderID}`, {
    headers: {
      Authorization: `Bearer ${authorizationToken}`
    },
    data: {
      customerName: 'Walter White'
    }
  })
  expect(response.status()).toBe(204)
  console.log(`reponse after modification ${await response.body()}`)
  const orderDetailsUpdated = await request.get(`${baseURL}/orders/${orderID}`, {
    headers: {
      Authorization: `Bearer ${authorizationToken}`
    }
  })
  console.log(`order details after modification is ${await orderDetailsUpdated.body()}`)
  const updatedOrderContent = await JSON.parse(await orderDetailsUpdated.text())
  const customerNameUpdated = await updatedOrderContent.customerName
  expect(customerNameUpdated).toBe('Walter White')
})

/* Delete Request */

test('Delete created order', async ({ request, baseURL }) => {
  const deleteResponse = await request.delete(`${baseURL}/orders/${orderID}`, {
    headers: {
      Authorization: `Bearer ${authorizationToken}`
    }
  })
  const statusCode = deleteResponse.status()
  expect(statusCode).toBe(204)
  const tryGettingDeletedOrder = await request.get(`${baseURL}/orders/${orderID}`, {
    headers: {
      Authorization: `Bearer ${authorizationToken}`
    }
  })
  expect(tryGettingDeletedOrder.status()).toBe(404)
  const orderNotFoundError = JSON.parse(await tryGettingDeletedOrder.text())
  expect(orderNotFoundError.error).toEqual(`No order with id ${orderID}.`)
})
