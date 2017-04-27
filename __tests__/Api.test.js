import Api from '../Api';
import 'isomorphic-fetch';

describe("Api", function () {

  it("listOrders", async function() {
    global.fetch = jest.fn().mockImplementation(() => {
      var fake = new Promise((resolve, reject) => {
        resolve({
          status: 200,
          json: function() {
            return {
              "orders": [
                {"id": 1,"path": "/order/1"},
                {"id": 3,"path": "/order/3"}
              ]
            }
          }
        });
      });
      return fake;
    });
    const responseJson = await Api.listOrders();
    expect(responseJson.orders.length).toBe(2);
    expect(responseJson.orders[1].id).toBe(3);
  });

  it("getOrder", async function() {
    var order = {
      "id": 1080,
      "coffees": [{"id": 890},{"id": 901}],
      "name": "test_coffee",
      "path": "/order/1080"
    };
    global.fetch = jest.fn().mockImplementation(() => {
      var fake = new Promise((resolve, reject) => {
        resolve({
          status: 200,
          json: function() {
            return order;
          }
        });
      });
      return fake;
    });
    const responseJson = await Api.getOrder(order);
    expect(responseJson.id).toBe(1080);
    expect(responseJson.name).toBe("test_coffee");
    expect(responseJson.coffees.length).toBe(2);
    expect(responseJson.coffees[0].id).toBe(890);
  });

  it("createOrder", async function() {
    global.fetch = jest.fn().mockImplementation(() => {
      var fake = new Promise((resolve, reject) => {
        resolve({
          status: 201,
          json: function() {
            return {id:2};
          }
        });
      });
      return fake;
    });
    const responseJson = await Api.createOrder();
    expect(responseJson.id).toBe(2);
  });

});
