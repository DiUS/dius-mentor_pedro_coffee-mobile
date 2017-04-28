import Api from '../Api';
import 'isomorphic-fetch';

const firstOrder = {
  id: 4,
  coffees: [
    {
      id: 11,
      style: "Latte",
      size: "3/4",
      path: "/order/4/coffee/11"
    }
  ],
  name: "hey",
  path: "/order/4"
};

const secondOrder = {
  id: 6,
  coffees: [
    {
      id: 13,
      style: "Long Macchiatto",
      size: "1/2",
      path: "/order/6/coffee/13"
    },
    {
      id: 14,
      style: "Long Black",
      size: "Regular",
      path: "/order/6/coffee/14"
    }
  ],
  name: "test",
  path: "/order/6"
};

const newOrder= {
  id: 7,
  path: "/order/7"
};

const newCoffee= {
  id: 15,
  style: "Cappuccino",
  size: "Large",
  path: "/order/6/coffee/15"
}

var orders = {"orders": [firstOrder,secondOrder]};

const menu = {
  "style": [
    "Latte",
    "Flat White",
    "Cappuccino",
    "Long Macchiatto",
    "Short Macchiatto",
    "Long Black",
    "Short Black",
    "Magic"
  ],
  "size": [
    "Large",
    "Regular",
    "3/4",
    "1/2",
    "Piccolo"
  ],
  "path": "/menu/coffee"
};

const newName = "test_newName";

describe("Api", function () {

  it("list all orders", async function() {
    global.fetch = jest.fn().mockImplementation(() => {
      var fake = new Promise((resolve, reject) => {
        resolve({
          status: 200,
          json: function() {
            return orders;
          }
        });
      });
      return fake;
    });
    const responseJson = await Api.listOrders();
    expect(responseJson.orders.length).toBe(2);
    expect(responseJson.orders[0].id).toBe(4);
  });

  it("get order with id 6", async function() {
    global.fetch = jest.fn().mockImplementation(() => {
      var fake = new Promise((resolve, reject) => {
        resolve({
          status: 200,
          json: function() {
            var result;
            for(i=0;i<orders.orders.length;i++){
              result = orders.orders[i];
              if(secondOrder.id===result.id){
                break;
              }
            }
            return result;
          }
        });
      });
      return fake;
    });
    const responseJson = await Api.getOrder(secondOrder);
    expect(responseJson.id).toBe(6);
    expect(responseJson.name).toBe("test");
    expect(responseJson.coffees.length).toBe(2);
    expect(responseJson.coffees[0].id).toBe(13);
  });

  it("create new order", async function() {
    global.fetch = jest.fn().mockImplementation(() => {
      var fake = new Promise((resolve, reject) => {
        resolve({
          status: 201,
          json: function() {
            var length = orders.orders.length;
            orders.orders = [...orders.orders,newOrder];
            return orders.orders[length];
          }
        });
      });
      return fake;
    });
    const responseJson = await Api.createOrder();
    expect(responseJson.id).toBe(7);
  });

  it("delete order with id 4", async function() {
    global.fetch = jest.fn().mockImplementation(() => {
      var fake = new Promise((resolve, reject) => {
        resolve({
          status: 200,
          json: function() {
            var resultOrders = orders.orders.filter((item) =>{
              if(item.id !== firstOrder.id){
                return item;
              }
            });
            return firstOrder;
          }
        });
      });
      return fake;
    });
    const responseJson = await Api.deleteOrder(firstOrder);
    expect(responseJson.id).toBe(4);
  });

  it("set test_newName name in order with id 6", async function() {
    global.fetch = jest.fn().mockImplementation(() => {
      var fake = new Promise((resolve, reject) => {
        resolve({
          status: 200,
          json: function() {
            var newOrders=[];
            var result;
            for(i=0;i<orders.orders.length;i++){
              var order = orders.orders[i];
              if(secondOrder.id===order.id){
                result = order;
                result.name = newName;
                order = result;
              }
              newOrders = [...newOrders,order];
            }
            orders.orders=newOrders;
            return result;
          }
        });
      });
      return fake;
    });
    const responseJson = await Api.updateOrder(secondOrder,newName);
    expect(responseJson.id).toBe(6);
    expect(responseJson.name).toBe(newName);
  });

});
