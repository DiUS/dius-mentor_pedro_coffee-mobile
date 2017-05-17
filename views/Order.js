'use strict';

import React, { Component } from 'react';
import { View, ListView, Button, Text, TextInput } from 'react-native';
import DynamicListView from '../components/DynamicListView';
import Options from '../components/Options';
import Style from '../style/style';

class Order extends Component{
  constructor(props){
    super(props);
    var ds = new ListView.DataSource({rowHasChanged : (r1, r2) => r1 !== r2});
    this._initialName=this.props.order.name;
    this._drinks=this.props.order.coffees?this.props.order.coffees:{}
    this.state = {
      name : this.props.order.name
    }
  }

  onBack(){
    this.props.onUpdateOrder();
  }

  renderSelectable(rowData){
    return (
      <Button title={rowData.summary} onPress={(rowData)=>this.props.onSelectDrink(rowData)}/>
    );
  }

  render(){
    return(
      <View style={Style.containerOrder}>
        <View style={{flex:1}}>
          <TextInput
            style={[Style.textOrder,{height: 60}]}
            placeholder='Name'
            onChangeText={(name) => this.setState({name:name})}
            value={this.state.name}
          />

          <View style={Style.containerRowOrder}>
              <View style={{flex : 5}}>
                <Text style={Style.textOrder}>Drinks:</Text>
              </View>
              <View style={{marginLeft: 4, flex : 1}}>
                <Button title={'+'} onPress={()=>this.props.onSelectDrink()}/>
              </View>
          </View>

          <DynamicListView
            data={this._drinks}
            willDelete={()=>{}}
            didDelete={(rowData)=>this.props.onDeleteDrink(rowData)}
            renderRow={this.renderSelectable.bind(this)}/>

          <Options
            onBack={this.onBack.bind(this)}
            onBackDisabled={!this.state.name || !this._initialName}
            onCancel={()=>this.props.onDeleteOrder(this.props.order.id)}
            onSave={()=>this.props.onUpdateOrder(this.props.order.id,this.state.name)}
            onSaveDisabled={(this.state.name===this._initialName) || (this.state.name==='')}/>
        </View>
      </View>
    );
  }

}

export default Order;
