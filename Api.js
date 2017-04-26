'use strict';

import React, { Component } from 'react';
import ApiUtils from './ApiUtils';
import { Alert } from 'react-native';
var ENDPOINT = 'http://19df5c7f.ngrok.io/order/';
var COFFEE_PATH = 'coffee/';

class Api extends Component {
  listOrders(){
    return fetch(ENDPOINT)
      .then(ApiUtils.checkStatus)
      .then((response) => response.json())
      .catch((error) => {
        Alert.alert(error);
      })
  }

  getOrder(order){
    return fetch(ENDPOINT+order.id)
      .then(ApiUtils.checkStatus)
      .then((response) => response.json())
      .catch((error) => {
        Alert.alert(error);
      })
  }

  createOrder() {
    return fetch(ENDPOINT,{
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
      .then(ApiUtils.checkStatus)
      .then((response) => response.json())
      .then((responseJson) => {
        //Returning Created Order Id
        return responseJson.id;
      })
      .catch((error) => {
        Alert.alert(error);
      })
  }

  updateOrder(orderId,drink){
    return fetch(ENDPOINT+orderId,{
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
      //TODO ADD Body Params
    })
      .then(ApiUtils.checkStatus)
      .then((response) => response.json())
      .then((responseJson) => {
        //TODO Return all orders
      })
      .catch((error) => {
        Alert.alert(error);
      })
  }

  cancelOrder(orderId, callback){
    return fetch(ENDPOINT+orderId,{
      method: 'DELETE',
      headers: {'Content-Type': 'application/json'}
    })
    .then(ApiUtils.checkStatus)
    .then((response) => response.json())
    .then((responseJson) => {
      callback();
    })
    .catch((error) => {
      console.error(error);
    })
  }

  addCoffee(orderId,drink){
    return fetch(ENDPOINT+orderId+'/'+COFFEE_PATH,{
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(drink)
    })
      .then(ApiUtils.checkStatus)
      .then((response) => {
        return true;
      })
      .catch((error) => {
        Alert.alert(error);
      })
  }

}

export default Api;
