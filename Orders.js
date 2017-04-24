'use strict';

import React, { Component } from 'react';
import { View, ListView, Button, Text, StyleSheet, ActivityIndicator } from 'react-native';
import OptionsListView from './OptionsListView';
import ProceedButton from './ProceedButton';
import ApiUtils from './ApiUtils';

class Orders extends Component{
  constructor(props){
    super(props);
    this._orders = null;
    this.state = {
      orders : this._orders
    }
  }

  onSelectOrder(order){
    //TODO PATH WILL CHANGE DEPENDING ON DRINK (IF THERE ARE DIFF DRINKS)
    if(order){
      this.props.onSelect(order);
    }
    else{
      return fetch(ApiUtils.ENDPOINT,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      .then(ApiUtils.checkStatus)
      .then((response) => response.json())
      .then((responseJson) => {
        this.props.onSelect(responseJson);
      })
      .catch((error) => {
        //TODO Reset to Initial View
        console.error(error);
      })
    }
  }

  onDeleteOrder(order){
    return fetch(ApiUtils.ENDPOINT+order.id,{
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(ApiUtils.checkStatus)
    .then((response) => response.json())
    .then((responseJson) => {
      var newOrders = this._orders.filter((item) =>{
        if(item.id !== order.id){
          return item;
        }
      })
      this.updateState(newOrders);
    })
    .catch((error) => {
      //TODO Reset to Initial View
      console.error(error);
    })
  }

  updateState(orderList){
    var ds = new ListView.DataSource({rowHasChanged : (r1, r2) => r1 !== r2});
    this._orders=orderList;
    this.setState({
      orders: ds.cloneWithRows(orderList)
    });
  }

  componentDidMount(){
    fetch(ApiUtils.ENDPOINT)
    .then(ApiUtils.checkStatus)
    .then((response) => response.json())
    .then((responseJson) => {
      var orders = responseJson.orders;
      var orderList = [];
      if(orders.length===0){
        this.updateState(orderList);
      }
      for(var i=0;i<orders.length;i++){
        fetch(ApiUtils.ENDPOINT+orders[i].id)
        .then(ApiUtils.checkStatus)
        .then((response) => response.json())
        .then((responseJson) => {
          orderList = [...orderList,responseJson];
          if(orderList.length===orders.length){
            //TODO FIX THIS TO DO IT IN A CORRECT WAY... ASYNC? PROMISE?
            this.updateState(orderList);
          }
        })
        .catch((error) => {
          console.error(error);
        })
      }
    })
    .catch((error) => {
      console.error(error);
    })
  }

  _renderRowSelect(rowData){
    return (
      <View style={{flexDirection: 'row', justifyContent:'space-between'}}>
        <View style={{flex : 5}}>
          <Button title={rowData.name} onPress={()=>this.onSelectOrder(rowData)}/>
        </View>
        <View style={{marginLeft: 4, flex : 1}}>
          <Button title={'X'} onPress={()=>this.onDeleteOrder(rowData)} color='#ff6666'/>
        </View>
      </View>
    );
  }

  render(){
    return(
      <View style={{flex: 1, padding: 10}}>
        {this.state.orders &&
          <OptionsListView
            dataSource={this.state.orders}
            renderRow={this._renderRowSelect.bind(this)}/>}
        {this.state.orders &&
          <ProceedButton title='Add Order' onPress={()=>this.onSelectOrder(null)}/>}
        {!this.state.orders &&
          <ActivityIndicator
            style={[styles.center, {height: 80}]}
            size="large"/>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    padding: 8,
  },
});

export default Orders;
