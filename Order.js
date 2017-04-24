'use strict';

import React, { Component } from 'react';
import { View, ListView, Button, Text, TextInput, StyleSheet, ActivityIndicator } from 'react-native';
import OptionsListView from './OptionsListView';
import ProceedButton from './ProceedButton';
import ApiUtils from './ApiUtils';

class Order extends Component{
  constructor(props){
    super(props);
    this._initialName=this.props.order.name;
    this._initialDrinks=this.props.order.coffees;
    this._drinks = null;
    this.state = {
      name : this.props.order.name,
      order : this.props.order,
      drinks : null
    }
  }

  onCancel(){
    return fetch(ApiUtils.ENDPOINT+this.state.order.id,{
      method: 'DELETE',
      headers: {'Content-Type': 'application/json'}
    })
    .then(ApiUtils.checkStatus)
    .then((response) => response.json())
    .then((responseJson) => {
      this.props.onComplete();
    })
    .catch((error) => {
      console.error(error);
    })
  }

  onBack(){
    this.props.onComplete();
  }

  onSave(){
    return fetch(ApiUtils.ENDPOINT+this.state.order.id,{
      method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({name : this.state.name})
    })
    .then(ApiUtils.checkStatus)
    .then((response) => response.json())
    .then((responseJson) => {
      this.props.onComplete();
    })
    .catch((error) => {
      console.error(error);
    })
  }

  onSelectDrink(drink){
    this.props.onSelect(drink);
  }

  onDeleteDrink(drink){
    return fetch(ApiUtils.ENDPOINT+this.state.order.id+'/'+ApiUtils.COFFEE_PATH+drink.id,{
      method: 'DELETE',
      headers: {'Content-Type': 'application/json'}
    })
    .then(ApiUtils.checkStatus)
    .then((response) => response.json())
    .then((responseJson) => {
      var newDrinks = this._drinks.filter((item) =>{
        if(item.id !== drink.id){
          return item;
        }
      })
      this.updateState(newDrinks);
    })
    .catch((error) => {
      console.error(error);
    })
  }

  updateState(drinkList){
    var ds = new ListView.DataSource({rowHasChanged : (r1, r2) => r1 !== r2});
    this._drinks=drinkList;
    this.setState({
      drinks : ds.cloneWithRows(drinkList)
    });
  }

  componentDidMount(){
    var drinkList = [];
    var order = this.state.order;
    if(order.coffees?order.coffees.length===0:true){
      this.updateState(drinkList);
    }
    else{
      for(var i=0;i<order.coffees.length;i++){
        fetch(ApiUtils.ENDPOINT+order.id+'/'+ApiUtils.COFFEE_PATH+order.coffees[i].id)
        .then(ApiUtils.checkStatus)
        .then((response) => response.json())
        .then((responseJson) => {
          drinkList = [...drinkList,responseJson];
          if(drinkList.length===order.coffees.length){
            //TODO FIX THIS TO DO IT IN A CORRECT WAY... ASYNC? PROMISE?
              this.updateState(drinkList);
          }
        })
        .catch((error) => {
          console.error(error);
        })
      }
    }
  }

  _renderRowSelect(rowData){
    return (
      <View style={{flexDirection: 'row', justifyContent:'space-between'}}>
        <View style={{flex : 5}}>
          <Button title={rowData.size+' '+rowData.style} onPress={()=>this.onSelectDrink(rowData)}/>
        </View>
        <View style={{marginLeft: 4, flex : 1}}>
          <Button title={'X'} onPress={()=>this.onDeleteDrink(rowData)} color='#ff6666'/>
        </View>
      </View>
    );
  }

  render(){
    if(this.state.drinks){
      return(
        <View style={{flex: 1, padding: 10, justifyContent:'space-between'}}>

          <TextInput
            style={{height: 60, fontSize: 24, fontWeight:'bold'}}
            onChangeText={(name) => this.setState({name:name})}
            value={this.state.name}
          />

          <View style={{flexDirection:'row', justifyContent:'space-between', marginBottom:8}}>
              <View style={{flex : 5}}>
                <Text style={{fontSize: 24, fontWeight:'bold'}}>Drinks:</Text>
              </View>
              <View style={{marginLeft: 4, flex : 1}}>
                <Button title={'+'} onPress={()=>this.onSelectDrink(null)}/>
              </View>
          </View>

          <OptionsListView
            dataSource={this.state.drinks}
            renderRow={this._renderRowSelect.bind(this)}/>

          <View style={{flexDirection:'row', justifyContent:'space-between'}}>
            <View style={{flex : 1, marginRight:4}}>
              <Button title='<' onPress={()=>this.onBack()} disabled={!this.state.name || !this._initialName}/>
            </View>
            <View style={{flex : 4, marginLeft:4, marginRight:4}}>
              <Button title='Cancel Order' onPress={()=>this.onCancel()} color='#ff6666'/>
            </View>
            <View style={{flex : 4, marginLeft:4}}>
              <ProceedButton title='Save Order' onPress={()=>this.onSave()}
                disabled={(this.state.name===this._initialName) || (this.state.name==='')}/>
            </View>
          </View>

        </View>
      );
    }
    else {
      return(
        <View style={{flex: 1, padding: 10}}>
          <ActivityIndicator
            style={[styles.center, {height: 80}]}
            size="large"/>
        </View>
      );
    }
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

export default Order;
