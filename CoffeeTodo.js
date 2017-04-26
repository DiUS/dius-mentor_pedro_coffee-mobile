'use strict';

import React, { Component } from 'react';
import Drink from './views/Drink';
import Orders from './views/Orders';
import Order from './views/Order';

//3 Steps detected in this view
var VIEW_ORDERS = 0;
var VIEW_ORDER = 1;
var VIEW_DRINK = 2;

class CoffeeTodo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      order: null,
      drink: null,
      viewId: VIEW_ORDERS
    };
  }

  onInitialState(){
    this.setState({
      order: null,
      drink: null,
      viewId: VIEW_ORDERS
    });
  }

  onSelectedOrder(order){
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
      case VIEW_ORDERS:
        return (<Orders onSelect={this.onSelectedOrder.bind(this)}/>);
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
