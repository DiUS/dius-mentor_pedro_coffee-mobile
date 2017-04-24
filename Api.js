import ApiUtils from './ApiUtils';
import { Alert } from 'react-native';
var ENDPOINT = 'http://580e81ff.ngrok.io/order/';
var COFFEE_PATH = 'coffee/';

var Api = {
  listOrders: function(){
    return fetch(ENDPOINT)
      .then(ApiUtils.checkStatus)
      .then((response) => response.json())
      .catch((error) => {
        Alert.alert(error);
      })
  },
  getOrder: function(order){
    return fetch(ENDPOINT+order.id)
      .then(ApiUtils.checkStatus)
      .then((response) => response.json())
      .catch((error) => {
        Alert.alert(error);
      })
  },
  createOrder: function() {
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
  },
  updateOrder: function(orderId,drink){
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
  },
  cancelOrder: function(orderId){
    return fetch(ENDPOINT+orderId,{
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
      .then(ApiUtils.checkStatus)
      .then((response) => {
        return true;
      })
      .catch((error) => {
        Alert.alert(error);
      })
  },
  addCoffee: function(orderId,drink){
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
