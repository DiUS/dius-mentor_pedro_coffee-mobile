'use strict';

import React, { Component } from 'react';
import { View, ListView, Button, Text, StyleSheet, ActivityIndicator, TouchableHighlight} from 'react-native';
import OptionsListView from '../components/OptionsListView';
import Options from '../components/Options';

class Orders extends Component{
  constructor(props){
    super(props);
    var ds = new ListView.DataSource({rowHasChanged : (r1, r2) => r1 !== r2});
    this.state = {
      orders : ds.cloneWithRows(this.props.orders)
    }
  }

  renderRowSelect(rowData){
    var coffeeSummaries=[];
    for(var i=0;i<rowData.coffeeSummaries.length;i++){
      coffeeSummaries.push(<Text key={i}>{rowData.coffeeSummaries[i]}</Text>)
    }
    return (
      <View style={{flexDirection: 'row', justifyContent:'space-between'}}>
        <View style={{flex : 5}}>
          <TouchableHighlight onPress={()=>this.props.onSelect(rowData.id)}>
            <View>
              <Text style={styles.titleText}>{rowData.name}</Text>
              {coffeeSummaries}
            </View>
          </TouchableHighlight>
        </View>
        <View style={{marginLeft: 4, flex : 1}}>
          <Button title={'X'} onPress={()=>this.props.onDelete(rowData.id)} color='#ff6666'/>
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
            onSave={()=>this.props.onSelect()}/>}
        {!this.state.orders &&
          <ActivityIndicator
            style={styles.spinner}
            size="large"/>}
      </View>
    );
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
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
  }
});

export default Orders;
