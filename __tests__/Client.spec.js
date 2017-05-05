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
              orders: eachLike({
                id: like(29),
                path: like('/order/29'),
                name: like('Jeff'),
                coffeeSummaries: eachLike('Large Magic',{min:2})
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
              id:like(1),
              path:like('/order/1')
            }
          }
        })
      )

      it('', () => client.createOrder()
        .then((body) => {
          expect(body.path).to.eql('/order/'+body.id)
        })
        .catch(fail)
      )
    })

    describe('gets one order', () => {
      beforeEach(() =>
        provider.addInteraction({
          state: 'order 23',
          uponReceiving: 'request to get a specific order',
          withRequest: {
            method: 'GET',
            path: '/order/23',
            headers: requestHeaders
          },
          willRespondWith: {
            status: 200,
            headers: responseHeaders,
            body: {
              id: 23,
              coffees: eachLike({id:like(66), summary: like('Flat White'), path: like('order/23/coffee/66')},{min:2}),
              name: 'Jimothy',
              path: '/order/23'
            }
          }
        })
      )

      it('', () => client.getOrder(23)
        .then((body) => {
          expect(body.id).to.eql(23)
          body.coffees.forEach((it) => {
            expect(it.id).to.eql(66)
          })
          expect(body.name).to.eql('Jimothy')
          expect(body.path).to.eql('/order/23')
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
            path: '/order/999',
            headers: requestHeaders
          },
          willRespondWith: {
            status: 404,
            headers: responseHeaders,
            body: {
              message: 'Order with id 999 not found',
              path: '/order/999'
            }
          }
        })
      )

      it('', () => client.getOrder(999)
        .catch(error => {
          expect(error.response.status).to.eql(404)
        })
      )
    })

    describe('names an order', () => {
      beforeEach(() =>
        provider.addInteraction({
          state: 'empty order 19',
          uponReceiving: 'request to change order name',
          withRequest: {
            method: 'PATCH',
            path: '/order/19',
            headers: requestHeaders,
            body: {
              name: 'Jimbo'
            }
          },
          willRespondWith: {
            status: 200,
            headers: responseHeaders,
            body: {
              id: 19,
              path: '/order/19'
            }
          }
        })
      )

      it('', () => client.updateOrder(19,'Jimbo')
        .then((body) => {
          expect(body.id).to.eql(19)
          expect(body.path).to.eql('/order/19')
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
            path: '/order/777',
            headers: requestHeaders,
            body: {
              name: 'No Face'
            }
          },
          willRespondWith: {
            status: 404,
            headers: responseHeaders,
            body: {
              message: 'Order with id 777 not found',
              path: '/order/777'
            }
          }
        })
      )

      it('', () => client.updateOrder(777,'No Face')
        .catch(error => {
          expect(error.response.status).to.eql(404)
        })
      )
    })

    describe('cancels an order', () => {
      beforeEach(() =>
        provider.addInteraction({
          state: 'empty order 19',
          uponReceiving: 'request to cancel the order',
          withRequest: {
            method: 'DELETE',
            path: '/order/19',
            headers: requestHeaders
          },
          willRespondWith: {
            status: 200,
            headers: responseHeaders,
            body: {
              id: 19,
              path: '/order/19'
            }
          }
        })
      )

      it('', () => client.deleteOrder(19)
        .then((body) => {
          expect(body.id).to.eql(19)
          expect(body.path).to.eql('/order/19')
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
            path: '/order/13',
            headers: requestHeaders
          },
          willRespondWith: {
            status: 404,
            headers: responseHeaders,
            body: {
              message: 'Order with id 13 not found',
              path: '/order/13'
            }
          }
        })
      )

      it('', () => client.deleteOrder(13)
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
          state: 'order 43 with coffee 59',
          uponReceiving: 'request to fetch a coffee',
          withRequest: {
            method: 'GET',
            path: '/order/43/coffee/59',
            headers: requestHeaders
          },
          willRespondWith: {
            status: 200,
            headers: responseHeaders,
            body: {
              id: 59,
              style: 'Magic',
              size: 'Regular',
              path: '/order/43/coffee/59'
            }
          }
        })
      )

      it('', () => client.getDrink(43,{id:59})
        .then((body) => {
          expect(body.id).to.eql(59)
        })
        .catch(fail)
      )
    })

    const drink = {style:'Magic',size:'Regular'}
    describe('adds a coffee', () => {
      beforeEach(() =>
        provider.addInteraction({
          state: 'empty order 19',
          uponReceiving: 'request to add a magic',
          withRequest: {
            method: 'POST',
            path: '/order/19/coffee',
            headers: requestHeaders,
            body: drink
          },
          willRespondWith: {
            status: 201,
            headers: responseHeaders,
            body: {
              id: 0,
              path: '/order/19/coffee/0'
            }
          }
        })
      )

      it('', () => client.createDrink(19,drink)
        .then((body) => {
          expect(body.path).to.eql('/order/19/coffee/'+body.id)
        })
        .catch(fail)
      )
    })

    const braggadoccio = {style:'Braggadoccio',size:'Large'}
    describe('fails to add a coffee with invalid style', () => {
      beforeEach(() =>
        provider.addInteraction({
          state: 'empty order 19',
          uponReceiving: 'request to add a large braggadoccio',
          withRequest: {
            method: 'POST',
            path: '/order/19/coffee',
            headers: requestHeaders,
            body: braggadoccio
          },
          willRespondWith: {
            status: 400,
            headers: responseHeaders,
            body: {
              message: 'Braggadoccio is not a recognised style',
              path: '/order/19/coffee'
            }
          }
        })
      )

      it('', () => client.createDrink(19,braggadoccio)
        .catch(error => {
          expect(error.response.status).to.eql(400)
        })
      )
    })

    const wrongDrink = {style:'Cappuccino',size:'Tiny'}
    describe('fails to add a coffee with invalid size', () => {
      beforeEach(() =>
        provider.addInteraction({
          state: 'empty order 19',
          uponReceiving: 'request to add a tinyccino',
          withRequest: {
            method: 'POST',
            path: '/order/19/coffee',
            headers: requestHeaders,
            body: wrongDrink
          },
          willRespondWith: {
            status: 400,
            headers: responseHeaders,
            body: {
              message: 'Tiny is not a recognised size',
              path: '/order/19/coffee'
            }
          }
        })
      )

      it('', () => client.createDrink(19,wrongDrink)
        .catch(error => {
          expect(error.response.status).to.eql(400)
        })
      )
    })

    const cappuccino = {style:'Cappuccino',size:'Regular'}
    describe('fails to add a coffee to non-existent order', () => {
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

    const modifiedDrink = {id:59,type:'coffee',style:'Latte',size:'Piccolo'}
    describe('updates a coffee', () => {
      beforeEach(() =>
        provider.addInteraction({
          state: 'order 43 with coffee 59',
          uponReceiving: 'request to change coffee style and size',
          withRequest: {
            method: 'PATCH',
            path: '/order/43/coffee/59',
            headers: requestHeaders,
            body: {style:modifiedDrink.style,size:modifiedDrink.size}
          },
          willRespondWith: {
            status: 200,
            headers: responseHeaders,
            body: {
              id: modifiedDrink.id,
              path: '/order/43/'+modifiedDrink.type+'/'+modifiedDrink.id
            }
          }
        })
      )

      it('', () => client.updateDrink(43,modifiedDrink)
        .then((body) => {
          expect(body.id).to.eql(modifiedDrink.id)
          expect(body.path).to.eql('/order/43/'+modifiedDrink.type+'/'+modifiedDrink.id)
        })
        .catch(fail)
      )
    })

    const wrongModDrink = {id:59,type:'coffee',style:'Latte',size:'Huge'}
    describe('fails to update a coffee with incorrect size', () => {
      beforeEach(() =>
        provider.addInteraction({
          state: 'order 43 with coffee 59',
          uponReceiving: 'request to change coffee size for huge',
          withRequest: {
            method: 'PATCH',
            path: '/order/43/coffee/59',
            headers: requestHeaders,
            body: {style:wrongModDrink.style,size:wrongModDrink.size}
          },
          willRespondWith: {
            status: 400,
            headers: responseHeaders,
            body: {
              message: 'Huge is not a recognised size',
              path: '/order/43/'+modifiedDrink.type+'/'+modifiedDrink.id
            }
          }
        })
      )

      it('', () => client.updateDrink(43,wrongModDrink)
        .catch(error => {
          expect(error.response.status).to.eql(400)
        })
      )
    })

    describe('cancels a coffee', () => {
      beforeEach(() =>
        provider.addInteraction({
          state: 'order 43 with coffee 59',
          uponReceiving: 'request to cancel coffee',
          withRequest: {
            method: 'DELETE',
            path: '/order/43/coffee/59',
            headers: requestHeaders
          },
          willRespondWith: {
            status: 200,
            headers: responseHeaders,
            body: {
              id: modifiedDrink.id,
              path: '/order/43/'+modifiedDrink.type+'/'+modifiedDrink.id
            }
          }
        })
      )

      it('', () => client.deleteDrink(43,modifiedDrink)
        .then((body) => {
          expect(body.id).to.eql(modifiedDrink.id)
          expect(body.path).to.eql('/order/43/'+modifiedDrink.type+'/'+modifiedDrink.id)
        })
        .catch(fail)
      )
    })




  })

  //Testing Menu
  describe('menu', () => {
    beforeEach(() => provider.removeInteractions())
    afterEach(() => provider.verify())

    describe('gets the base menu', () => {
      beforeEach(() =>
        provider.addInteraction({
          state: 'no orders',
          uponReceiving: 'request to fetch the menu',
          withRequest: {
            method: 'GET',
            path: '/menu',
            headers: requestHeaders
          },
          willRespondWith: {
            status: 200,
            headers: responseHeaders,
            body: {
              coffee:'/menu/coffee',
              path: '/menu'
            }
          }
        })
      )

      it('', () => client.getMenu()
        .then((body) => {
          expect(body.coffee).to.eql('/menu/coffee')
          expect(body.path).to.eql('/menu')
        })
        .catch(fail)
      )
    })

    describe('gets the coffee menu', () => {
      beforeEach(() =>
        provider.addInteraction({
          state: 'no orders',
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
              style: eachLike('Latte',{min: 7, max: 10}),
              size: eachLike('Regular',{min: 5, max: 10}),
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
