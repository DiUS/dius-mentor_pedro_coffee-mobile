import { expect } from 'chai'
import pact from 'pact'
import Client from '../client/Client'
import fetch from 'isomorphic-fetch'

const { eachLike, somethingLike: like } = pact.Matchers
const path = require('path')
const mockServerStartupTimeout = 15000 // Slow in docker.
const endpoint = 'http://localhost'
const port = 1234
const mimeAppJson = 'application/json'
const requestHeaders = { 'Accept': mimeAppJson }
const responseHeaders = { 'Content-Type': mimeAppJson }

describe('Coffee service (orders)', () => {
  const client = Client(`${endpoint}:${port}`)

  let provider = pact({
    consumer: 'Coffee Mobile Consumer',
    provider: 'Coffee Ordering Provider',
    port: port,
    log: path.resolve(process.cwd(), 'logs', 'mockserver-integration.log'),
    dir: path.resolve(process.cwd(), 'pacts'),
    spec: 2,
    done: (error) => {
      expect(error).to.be.null
    }
  })

  beforeAll(() => provider.setup(), mockServerStartupTimeout)
  afterAll(() => provider.finalize())

  describe('orders', () => {
    beforeEach(() => provider.removeInteractions())
    afterEach(() => provider.verify())

    describe('lists no orders', () => {
      beforeEach(() =>
        provider.addInteraction({
          state: 'no orders',
          uponReceiving: 'request to list orders',
          withRequest: {
            method: 'GET',
            path: '/order',
            headers: requestHeaders
          },
          willRespondWith: {
            status: 200,
            headers: responseHeaders,
            body: {
              orders: []
            }
          }
        })
      )

      it('', () => client.listOrders()
        .then((body) => {
          expect(body.orders).to.eql([])
        })
        .catch(fail)
      )
    })

    describe('lists many orders', () => {
      beforeEach(() =>
        provider.addInteraction({
          state: 'many orders',
          uponReceiving: 'request to list many orders',
          withRequest: {
            method: 'GET',
            path: '/order',
            headers: requestHeaders
          },
          willRespondWith: {
            status: 200,
            headers: responseHeaders,
            body: {
              orders: eachLike({
                id: like(29),
                path: like('/order/29')
              }, {
                min: 3, max: 7
              })
            }
          }
        })
      )

      it('', () => client.listOrders()
        .then((body) => {
          expect(body.orders.length).to.eql(3)

          body.orders.forEach((it) => {
            expect(it.path).to.eql(`/order/${it.id}`)
          })
        })
        .catch(fail)
      )
    })

    describe('gets one order', () => {
      beforeEach(() =>
        provider.addInteraction({
          state: 'order 2',
          uponReceiving: 'request to get a specific order',
          withRequest: {
            method: 'GET',
            path: '/order/2',
            headers: requestHeaders
          },
          willRespondWith: {
            status: 200,
            headers: responseHeaders,
            body: {
              id: 2,
              coffees: [],
              name: 'Charlie Brown',
              path: '/order/2'
            }
          }
        })
      )

      it('', () => client.getOrder(2)
        .then((body) => {
          expect(body.id).to.eql(2)
          expect(body.coffees.length).to.eql(0)
          expect(body.name).to.eql('Charlie Brown')
          expect(body.path).to.eql('/order/2')
        })
        .catch(fail)
      )
    })

    describe('fails to get one order', () => {
      beforeEach(() =>
        provider.addInteraction({
          state: 'no orders',
          uponReceiving: 'request to get a specific order',
          withRequest: {
            method: 'GET',
            path: '/order/3',
            headers: requestHeaders
          },
          willRespondWith: {
            status: 404,
            headers: responseHeaders,
            body: {
              message: 'Order with id 3 not found',
              path: '/order/3'
            }
          }
        })
      )

      it('', () => client.getOrder(3)
        .catch(error => {
          expect(error.response.status).to.eql(404)
        })
      )
    })

    describe('names an order', () => {
      beforeEach(() =>
        provider.addInteraction({
          state: 'empty order 4',
          uponReceiving: 'request to change order name',
          withRequest: {
            method: 'PATCH',
            path: '/order/4',
            headers: requestHeaders,
            body: {
              name: 'Annie Hall'
            }
          },
          willRespondWith: {
            status: 200,
            headers: responseHeaders,
            body: {
              id: 4,
              path: '/order/4'
            }
          }
        })
      )

      it('', () => client.updateOrder(4,'Annie Hall')
        .then((body) => {
          expect(body.id).to.eql(4)
          expect(body.path).to.eql('/order/4')
        })
        .catch(fail)
      )
    })

    describe('fails to name an order', () => {
      beforeEach(() =>
        provider.addInteraction({
          state: 'no orders',
          uponReceiving: 'request to change order name',
          withRequest: {
            method: 'PATCH',
            path: '/order/5',
            headers: requestHeaders,
            body: {
              name: 'Alvy Singer'
            }
          },
          willRespondWith: {
            status: 404,
            headers: responseHeaders,
            body: {
              message: 'Order with id 5 not found',
              path: '/order/5'
            }
          }
        })
      )

      it('', () => client.updateOrder(5,'Alvy Singer')
        .catch(error => {
          expect(error.response.status).to.eql(404)
        })
      )
    })

    describe('cancels an order', () => {
      beforeEach(() =>
        provider.addInteraction({
          state: 'empty order 6',
          uponReceiving: 'request to cancel the order',
          withRequest: {
            method: 'DELETE',
            path: '/order/6',
            headers: requestHeaders
          },
          willRespondWith: {
            status: 200,
            headers: responseHeaders,
            body: {
              id: 6,
              path: '/order/6'
            }
          }
        })
      )

      it('', () => client.deleteOrder(6)
        .then((body) => {
          expect(body.id).to.eql(6)
          expect(body.path).to.eql('/order/6')
        })
        .catch(fail)
      )
    })

    describe('fails to cancel an order', () => {
      beforeEach(() =>
        provider.addInteraction({
          state: 'no orders',
          uponReceiving: 'request to cancel the order',
          withRequest: {
            method: 'DELETE',
            path: '/order/7',
            headers: requestHeaders
          },
          willRespondWith: {
            status: 404,
            headers: responseHeaders,
            body: {
              message: 'Order with id 7 not found',
              path: '/order/7'
            }
          }
        })
      )

      it('', () => client.deleteOrder(7)
        .catch(error => {
          expect(error.response.status).to.eql(404)
        })
      )
    })

  })

})
