'use strict';

import React, { Component } from 'react';
import Drink from './views/Drink';
import Orders from './views/Orders';
import Order from './views/Order';
import LoadingView from './components/LoadingView';
import Client from './client/Client';

const client = Client();

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
      drinkOptions: null,
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

  updateOrders(orders){
    this.setState({
      orders : orders,
      order: null,
      drink: null,
      viewId : VIEW_ORDERS
    });
  }

  updateOrder(order){
    this.setState({
      order : order,
      viewId : VIEW_ORDER
    });
  }

  updateDrink(drink){
    client.getDrinkMenu('coffee')
    .then((options) => {
      this.setState({
        drink: drink,
        drinkOptions: options,
        viewId : VIEW_DRINK
      });
    })
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
      client.createOrder()
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

  onUpdatedOrder(orderId,name){
    this.setState({
      viewId : LOADING
    });
    if(orderId && name){
      client.updateOrder(orderId,name)
      .then((responseJson) => {
        this.onInitialState();
      })
    }
    else{
      this.onInitialState();
    }
  }

  onSelectedDrink(drink){
    this.setState({
      viewId : LOADING
    });
    if(drink){
      client.getDrink(this.state.order.id,drink)
      .then((drink) => this.updateDrink(drink))
    }
    else{
      this.updateDrink()
    }
  }

  onCreatedDrink(drink){
    this.setState({
      viewId : LOADING
    });
    if (drink){
      client.createDrink(this.state.order.id,drink)
      .then((drink) => client.getOrder(this.state.order.id))
      .then((order) => this.updateOrder(order))
    }
    else{
      this.updateOrder(this.state.order);
    }
  }

  onUpdatedDrink(drink){
    this.setState({
      viewId : LOADING
    });
    client.updateDrink(this.state.order.id,drink)
    .then((drink) => client.getOrder(this.state.order.id))
    .then((order) => this.updateOrder(order))
  }

  onDeletedDrink(drink){
    this.setState({
      viewId : LOADING
    });
    client.deleteDrink(this.state.order.id,drink)
    .then((responseJson) => {
      var newCoffees = this.state.order.coffees.filter((coffee) =>{
        if(coffee.id !== drink.id) return coffee;
      })
      var newOrder = this.state.order;
      newOrder.coffees = newCoffees;
      this.updateOrder(newOrder);
    })
  }

  getMenu(drink){
    client.getDrinkMenu(drink)
  }

  render() {
    switch (this.state.viewId) {
      case LOADING:
        return (<LoadingView/>);
        break;
      case VIEW_ORDERS:
        return (<Orders onSelect={this.onSelectedOrder.bind(this)}
                        onDelete={this.onDeletedOrder.bind(this)}
                        orders={this.state.orders}/>);
        break;
      case VIEW_ORDER:
        return (<Order onSelectDrink={this.onSelectedDrink.bind(this)}
                       onDeleteDrink={this.onDeletedDrink.bind(this)}
                       onDeleteOrder={this.onDeletedOrder.bind(this)}
                       onUpdateOrder={this.onUpdatedOrder.bind(this)}
                       order={this.state.order} />);
        break;
      case VIEW_DRINK:
        return (<Drink onCreate={this.onCreatedDrink.bind(this)}
                       onUpdate={this.onUpdatedDrink.bind(this)}
                       options={this.state.drinkOptions}
                       drink={this.state.drink} />);
        break;
      default: return null;
        break;
    }
  }

}

export default CoffeeTodo;
