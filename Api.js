'use strict';
import ApiUtil from './util/ApiUtil';

var ENDPOINT = 'http://b7f02e06.ngrok.io/';
var ORDER_PATH = 'order/';
var MENU_PATH = 'menu/';
var COFFEE_PATH = 'coffee/';

class Api{

  static listOrders(){
    return fetch(ENDPOINT+ORDER_PATH)
    .then(ApiUtil.checkStatus)
    .then((response) => response.json())
    .catch((error) => {
      console.error(error);
    })
  }

  static getOrder(order){
    return fetch(ENDPOINT+ORDER_PATH+order.id)
    .then(ApiUtil.checkStatus)
    .then((response) => response.json())
    .catch((error) => {
      console.error(error);
    })
  }

  static createOrder() {
    return fetch(ENDPOINT+ORDER_PATH,{
      method: 'POST',
      headers: {'Content-Type': 'application/json'}
    })
    .then(ApiUtil.checkStatus)
    .then((response) => response.json())
    .catch((error) => {
      console.error(error);
    })
  }

  static deleteOrder(order){
    return fetch(ENDPOINT+ORDER_PATH+order.id,{
      method: 'DELETE',
      headers: {'Content-Type': 'application/json'}
    })
    .then(ApiUtil.checkStatus)
    .then((response) => response.json())
    .catch((error) => {
      console.error(error);
    })
  }

  static updateOrder(order,name){
    return fetch(ENDPOINT+ORDER_PATH+order.id,{
      method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({name : name})
    })
    .then(ApiUtil.checkStatus)
    .then((response) => response.json())
    .catch((error) => {
      console.error(error);
    })
  }

  static getDrink(order,drink){
    //TODO Modify COFFEE_PATH for drink.type when enabled.
    return fetch(ENDPOINT+ORDER_PATH+order.id+'/'+COFFEE_PATH+drink.id)
    .then(ApiUtil.checkStatus)
    .then((response) => response.json())
    .catch((error) => {
      console.error(error);
    })
  }

  static createDrink(order,drink){
    //TODO Modify COFFEE_PATH for drink.type when enabled.
    return fetch(ENDPOINT+ORDER_PATH+order.id+'/'+COFFEE_PATH,{
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        style : drink.style,
        size : drink.size,
      })
    })
    .then(ApiUtil.checkStatus)
    .then((response) => response.json())
    .catch((error) => {
      console.error(error);
    })
  }

  static deleteDrink(order,drink){
    //TODO Modify COFFEE_PATH for drink.type when enabled.
    return fetch(ENDPOINT+ORDER_PATH+order.id+'/'+COFFEE_PATH+drink.id,{
      method: 'DELETE',
      headers: {'Content-Type': 'application/json'}
    })
    .then(ApiUtil.checkStatus)
    .then((response) => response.json())
    .catch((error) => {
      console.error(error);
    })
  }

  static getDrinkOptions(drink){
    return fetch(ENDPOINT+MENU_PATH+drink)
    .then(ApiUtil.checkStatus)
    .then((response) => response.json())
    .catch((error) => {
      console.error(error);
    })
  }

}

export default Api;
