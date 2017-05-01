'use strict';

import React, { Component } from 'react';
import { View, ListView, Button, Text, StyleSheet, ActivityIndicator } from 'react-native';
import OptionsListView from '../components/OptionsListView';
import Options from '../components/Options';
import Api from '../Api';

class Orders extends Component{
  constructor(props){
    super(props);
    this._orders = null;
    this.state = {
      orders : this._orders
    }
  }

  updateState(orderList){
    var ds = new ListView.DataSource({rowHasChanged : (r1, r2) => r1 !== r2});
    this._orders=orderList;
    this.setState({
      orders: ds.cloneWithRows(orderList)
    });
  }

  onSelectOrder(order){
    if(order){
      this.props.onSelect(order);
    }
    else{
      this.createOrder();
    }
  }

  componentDidMount(){
    this.fetchData();
  }

  renderRowSelect(rowData){
    return (
      <View style={{flexDirection: 'row', justifyContent:'space-between'}}>
        <View style={{flex : 5}}>
          <Button title={rowData.name} onPress={()=>this.onSelectOrder(rowData)}/>
        </View>
        <View style={{marginLeft: 4, flex : 1}}>
          <Button title={'X'} onPress={()=>this.deleteOrder(rowData)} color='#ff6666'/>
        </View>
      </View>
    );
  }

  render(){
    return(
      <View style={styles.container}>
        {this.state.orders &&
          <OptionsListView
            dataSource={this.state.orders}
            renderRow={this.renderRowSelect.bind(this)}/>}
        {this.state.orders &&
          <Options
            onSaveTitle='Add Order'
            onSave={this.createOrder.bind(this)}/>}
        {!this.state.orders &&
          <ActivityIndicator
            style={styles.spinner}
            size="large"/>}
      </View>
    );
  }

  //API CALLS
  createOrder(){
    Api.createOrder()
    .then((responseJson) => {
      this.props.onSelect(responseJson);
    })
  }

  deleteOrder(order){
    Api.deleteOrder(order)
    .then((responseJson) => {
      var newOrders = this._orders.filter((item) =>{
        if(item.id !== order.id) return item;
      })
      this.updateState(newOrders);
    })
  }

  fetchData(){
    Api.listOrders()
    .then((responseJson) => {
      var orders = responseJson.orders;
      var orderList = [];
      if(orders.length===0){
        this.updateState(orderList);
      }
      else {
        for(var i=0;i<orders.length;i++){
          Api.getOrder(orders[i])
          .then((responseJson) => {
            orderList = [...orderList,responseJson];
            if(orderList.length===orders.length){
              //TODO FIX THIS TO DO IT IN A CORRECT WAY... ASYNC? PROMISE?
              this.updateState(orderList);
            }
          })
        }
      }
    })
  }

}

const styles = StyleSheet.create({
  spinner: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: 80,
    padding: 8,
  },
  container: {
    flex: 1,
    padding: 10
  }
});

export default Orders;
