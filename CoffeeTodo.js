'use strict';

import React, { Component } from 'react';
import Drink from './views/Drink';
import Orders from './views/Orders';
import Order from './views/Order';
import LoadingView from './components/LoadingView';
import { baseUrl } from './config.js'
import Client from './client/Client';

const client = Client(baseUrl);

//3 views detected in this application
const LOADING = 0;
const VIEW_ORDERS = 1;
const VIEW_ORDER = 2;
const VIEW_DRINK = 3;

/**
This class works as controller between the different views
**/
class CoffeeTodo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: null,
      order: null,
      drink: null,
      viewId: LOADING
    };
  }

  componentDidMount(){
    this.onInitialState();
  }

  onInitialState(){
    client.listOrders()
    .then((responseJson) => {
      var orders = responseJson.orders;
      this.updateOrders(orders);
    })
  }

  //ORDERS
  updateOrders(orders){
    this.setState({
      orders : orders,
      order: null,
      drink: null,
      viewId : VIEW_ORDERS
    });
  }

  onSelectedOrder(orderId){
    this.setState({
      viewId : LOADING
    });
    if(orderId){
      client.getOrder(orderId)
      .then((order) => this.updateOrder(order))
    }
    else{
      client.createOrder(orderId)
      .then((order) => this.updateOrder(order))
    }
  }

  onDeletedOrder(orderId){
    this.setState({
      viewId : LOADING
    });
    client.deleteOrder(orderId)
    .then((responseJson) => {
      var newOrders = this.state.orders.filter((order) =>{
        if(order.id !== orderId) return order;
      })
      this.updateOrders(newOrders);
    })
  }

  updateOrder(order){
    this.setState({
      order : order,
      viewId : VIEW_ORDER
    });
  }

  onSelectedDrink(drink){
    this.setState({
      drink : drink,
      viewId : VIEW_DRINK
    });
  }

  render() {
    switch (this.state.viewId) {
      case LOADING:
        return (<LoadingView/>);
        break;
      case VIEW_ORDERS:
        return (<Orders onSelect={this.onSelectedOrder.bind(this)} onDelete={this.onDeletedOrder.bind(this)} orders={this.state.orders}/>);
        break;
      case VIEW_ORDER:
        return (<Order onSelect={this.onSelectedDrink.bind(this)} order={this.state.order} onComplete={this.onInitialState.bind(this)}/>);
        break;
      case VIEW_DRINK:
        return (<Drink order={this.state.order} drink={this.state.drink} onComplete={this.onSelectedOrder.bind(this)}/>);
        break;
      default: return null;
        break;
    }
  }

}

export default CoffeeTodo;
