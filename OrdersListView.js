'use strict';

import React, { Component } from 'react';
import { View, ListView, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import extras from './default_data/extras.json';
import ApiUtils from './ApiUtils';
var Promise = require('bluebird');

class OrdersListView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orders : this.props.orders,
      orderList : null
    }
  }

  async getOrder(order){
    let data = await fetch(ApiUtils.ENDPOINT+order.id)
      .then(ApiUtils.checkStatus)
      .then((response) => response.json())
      .catch((error) => {
        console.error(error);
      });
    return data;
  }

  componentDidMount(){
    var ds = new ListView.DataSource({rowHasChanged : (r1, r2) => r1 !== r2});
    const data = Promise.map(this.state.orders, async(order) =>{
      getOrder(order);
    });
    this.setState({
      orderList: ds.cloneWithRows(data)
    });
    Alert.alert('Sale DidMount');
  }

  render(){
    return (
      <View style={{flex: 1, padding: 10}}>
        {this.state.orderList &&
          <ListView
            enableEmptySections={true}
            dataSource={this.state.orderList}
            renderRow = {this.props.renderRow}
            renderSeparator={(sectionId, rowId) =>
              <View key={rowId} style={styles.separator}/>}>
          </ListView>}
        {!this.state.orderList &&
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

export default OrdersListView;
