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

  //Testing Orders
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

    describe('create a new order', () => {
      beforeEach(() =>
        provider.addInteraction({
          state: 'no orders',
          uponReceiving: 'request to create a new order',
          withRequest: {
            method: 'POST',
            path: '/order',
            headers: requestHeaders
          },
          willRespondWith: {
            status: 201,
            headers: responseHeaders,
            body: {
              id:1,
              path:'/order/1'
            }
          }
        })
      )

      it('', () => client.createOrder()
        .then((body) => {
          expect(body.id).to.eql(1)
          expect(body.path).to.eql('/order/1')
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

  //Testing Drinks
  describe('drinks', () => {
    beforeEach(() => provider.removeInteractions())
    afterEach(() => provider.verify())

    describe('gets a coffee', () => {
      beforeEach(() =>
        provider.addInteraction({
          state: 'order 20 with coffee 40',
          uponReceiving: 'request to fetch a coffee',
          withRequest: {
            method: 'GET',
            path: '/order/20/coffee/40',
            headers: requestHeaders
          },
          willRespondWith: {
            status: 200,
            headers: responseHeaders,
            body: {
              id: 40,
              style: 'Latte',
              size: 'Large',
              path: '/order/20/coffee/40'
            }
          }
        })
      )

      it('', () => client.getDrink(20,{id:40})
        .then((body) => {
          expect(body.id).to.eql(40)
        })
        .catch(fail)
      )
    })

    const drink = {style:'Magic',size:'Regular'}
    describe('adds a coffee', () => {
      beforeEach(() =>
        provider.addInteraction({
          state: 'empty order 10',
          uponReceiving: 'request to add a regular magic',
          withRequest: {
            method: 'POST',
            path: '/order/10/coffee',
            headers: requestHeaders,
            body: drink
          },
          willRespondWith: {
            status: 200,
            headers: responseHeaders,
            body: {
              id: 27,
              style: drink.style,
              size: drink.size,
              path: '/order/10/coffee/27'
            }
          }
        })
      )

      it('', () => client.createDrink(10,drink)
        .then((body) => {
          expect(body.id).to.eql(27)
          expect(body.style).to.eql(drink.style)
          expect(body.size).to.eql(drink.size)
          expect(body.path).to.eql('/order/10/coffee/27')
        })
        .catch(fail)
      )
    })

    const cappuccino = {style:'Cappuccino',size:'Regular'}
    describe('fails to add a coffee to a non-existent order', () => {
      beforeEach(() =>
        provider.addInteraction({
          state: 'no orders',
          uponReceiving: 'request to add a cappuccino',
          withRequest: {
            method: 'POST',
            path: '/order/55/coffee',
            headers: requestHeaders,
            body: cappuccino
          },
          willRespondWith: {
            status: 404,
            headers: responseHeaders,
            body: {
              message: 'Order with id 55 not found',
              path: '/order/55/coffee'
            }
          }
        })
      )

      it('', () => client.createDrink(55,cappuccino)
        .catch(error => {
          expect(error.response.status).to.eql(404)
        })
      )
    })

    const wrongDrink = {style:'Rum',size:'Large'}
    describe('fails to add a coffee with invalid style', () => {
      beforeEach(() =>
        provider.addInteraction({
          state: 'empty order 15',
          uponReceiving: 'request to add a large rum',
          withRequest: {
            method: 'POST',
            path: '/order/15/coffee',
            headers: requestHeaders,
            body: wrongDrink
          },
          willRespondWith: {
            status: 400,
            headers: responseHeaders,
            body: {
              message: 'Braggadoccio is not a recognised style',
              path: '/order/15/coffee'
            }
          }
        })
      )

      it('', () => client.createDrink(15,wrongDrink)
        .catch(error => {
          expect(error.response.status).to.eql(400)
        })
      )
    })

    const modifiedDrink = {id:27,type:'coffee',style:'Latte',size:'Large'}
    describe('updates a coffee', () => {
      beforeEach(() =>
        provider.addInteraction({
          state: 'order 10 with coffee 27',
          uponReceiving: 'request to change coffee style and size',
          withRequest: {
            method: 'PATCH',
            path: '/order/10/coffee/27',
            headers: requestHeaders,
            body: {style:modifiedDrink.style,size:modifiedDrink.size}
          },
          willRespondWith: {
            status: 200,
            headers: responseHeaders,
            body: {
              id: modifiedDrink.id,
              style: modifiedDrink.style,
              size: modifiedDrink.size,
              path: '/order/10/'+modifiedDrink.type+'/'+modifiedDrink.id
            }
          }
        })
      )

      it('', () => client.updateDrink(10,modifiedDrink)
        .then((body) => {
          expect(body.id).to.eql(modifiedDrink.id)
          expect(body.style).to.eql(modifiedDrink.style)
          expect(body.size).to.eql(modifiedDrink.size)
          expect(body.path).to.eql('/order/10/'+modifiedDrink.type+'/'+modifiedDrink.id)
        })
        .catch(fail)
      )
    })

    const wrongModDrink = {id:27,type:'coffee',style:'Latte',size:''}
    describe('fails to update a coffee with empty size', () => {
      beforeEach(() =>
        provider.addInteraction({
          state: 'order 10 with coffee 27',
          uponReceiving: 'request to change coffee size for an empty field',
          withRequest: {
            method: 'PATCH',
            path: '/order/10/coffee/27',
            headers: requestHeaders,
            body: {style:wrongModDrink.style,size:wrongModDrink.size}
          },
          willRespondWith: {
            status: 400,
            headers: responseHeaders,
            body: {
              message: ' is not a recognised size',
              path: '/order/10/'+modifiedDrink.type+'/'+modifiedDrink.id
            }
          }
        })
      )

      it('', () => client.updateDrink(10,wrongModDrink)
        .catch(error => {
          expect(error.response.status).to.eql(400)
        })
      )
    })

    describe('deletes a coffee', () => {
      beforeEach(() =>
        provider.addInteraction({
          state: 'order 10 with coffee 27',
          uponReceiving: 'request to delete a coffee',
          withRequest: {
            method: 'DELETE',
            path: '/order/10/coffee/27',
            headers: requestHeaders
          },
          willRespondWith: {
            status: 200,
            headers: responseHeaders,
            body: {
              id: modifiedDrink.id,
              path: '/order/10/'+modifiedDrink.type+'/'+modifiedDrink.id
            }
          }
        })
      )

      it('', () => client.deleteDrink(10,modifiedDrink)
        .then((body) => {
          expect(body.id).to.eql(modifiedDrink.id)
          expect(body.path).to.eql('/order/10/'+modifiedDrink.type+'/'+modifiedDrink.id)
        })
        .catch(fail)
      )
    })




  })

  //Testing Menu
  describe('menu', () => {
    beforeEach(() => provider.removeInteractions())
    afterEach(() => provider.verify())

    describe('gets menu by type', () => {
      beforeEach(() =>
        provider.addInteraction({
          state: 'coffee menu with styles and sizes',
          uponReceiving: 'request to fetch the coffee menu',
          withRequest: {
            method: 'GET',
            path: '/menu/coffee',
            headers: requestHeaders
          },
          willRespondWith: {
            status: 200,
            headers: responseHeaders,
            body: {
              style: eachLike('Latte',{min: 5, max: 10}),
              size: eachLike('Regular',{min: 2, max: 6}),
              path: '/menu/coffee'
            }
          }
        })
      )

      it('', () => client.getDrinkMenu('coffee')
        .then((body) => {
          expect(body.path).to.eql('/menu/coffee')
        })
        .catch(fail)
      )
    })

  })
})
