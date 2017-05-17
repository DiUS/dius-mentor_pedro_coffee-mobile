'use strict';

import React, { Component } from 'react';
import { View, ListView, Text, TouchableHighlight} from 'react-native';
import DynamicListView from '../components/DynamicListView';
import Options from '../components/Options';
import Style from '../style/style';

class Orders extends Component{

  renderSelectable(rowData){
    var coffeeSummaries=[];
    for(var i=0;i<rowData.coffeeSummaries.length;i++){
      coffeeSummaries.push(<Text key={i}>{rowData.coffeeSummaries[i]}</Text>)
    }
    return (
      <TouchableHighlight onPress={()=>this.props.onSelect(rowData.id)}>
        <View>
          <Text style={Style.titleText}>{rowData.name}</Text>
          {coffeeSummaries}
        </View>
      </TouchableHighlight>
    );
  }

  render(){
    return(
      <View style={Style.containerOrders}>
          <DynamicListView
            data={this.props.orders}
            willDelete={()=>{}}
            didDelete={(rowData)=>this.props.onDelete(rowData.id)}
            renderRow={this.renderSelectable.bind(this)}/>
          <Options
            onSaveTitle='Add Order'
            onSave={()=>this.props.onSelect()}/>
      </View>
    );
  }
}

export default Orders;
