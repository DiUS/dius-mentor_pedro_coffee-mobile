'use strict';

import React, { Component } from 'react';
import { View, ListView, Button, Text, TextInput, StyleSheet, ActivityIndicator } from 'react-native';
import OptionsListView from '../components/OptionsListView';
import Options from '../components/Options';
import ApiUtil from '../util/ApiUtil';

class Order extends Component{
  constructor(props){
    super(props);
    //Initial values needed to toggle action buttons
    this._initialName=this.props.order.name;
    this._drinks = null;
    this.state = {
      name : this.props.order.name,
      order : this.props.order,
      drinks : null
    }
  }

  updateState(drinkList){
    var ds = new ListView.DataSource({rowHasChanged : (r1, r2) => r1 !== r2});
    this._drinks=drinkList;
    var newOrder = this.state.order;
    newOrder.coffees = drinkList;
    this.setState({
      drinks : ds.cloneWithRows(drinkList),
      order : newOrder
    });
  }

  onBack(){
    this.props.onComplete();
  }

  onSelectDrink(drink){
    this.props.onSelect(drink);
  }

  componentDidMount(){
    var order = this.state.order;
    if(order.coffees?order.coffees.length===0:true){
      this.updateState([]);
    }
    else{
      this.fetchData();
    }
  }

  renderRowSelect(rowData){
    return (
      <View style={{flexDirection: 'row', justifyContent:'space-between'}}>
        <View style={{flex : 5}}>
          <Button title={rowData.size+' '+rowData.style} onPress={()=>this.onSelectDrink(rowData)}/>
        </View>
        <View style={{marginLeft: 4, flex : 1}}>
          <Button title={'X'} onPress={()=>this.deleteDrink(rowData)} color='#ff6666'/>
        </View>
      </View>
    );
  }

  renderLoading(){
    return(
      <View style={{flex:1}}>
        <ActivityIndicator
          style={styles.spinner}
          size="large"/>
      </View>
    );
  }

  renderOrder(){
    return(
      <View style={{flex:1}}>
        <TextInput
          style={[styles.text,{height: 60}]}
          onChangeText={(name) => this.setState({name:name})}
          value={this.state.name}
        />

        <View style={styles.containerRow}>
            <View style={{flex : 5}}>
              <Text style={styles.text}>Drinks:</Text>
            </View>
            <View style={{marginLeft: 4, flex : 1}}>
              <Button title={'+'} onPress={()=>this.onSelectDrink(null)}/>
            </View>
        </View>

        <OptionsListView
          dataSource={this.state.drinks}
          renderRow={this.renderRowSelect.bind(this)}/>

        <Options
          onBack={this.onBack.bind(this)}
          onBackDisabled={!this.state.name || !this._initialName}
          onCancel={this.deleteOrder.bind(this)}
          onSave={this.updateOrder.bind(this)}
          onSaveDisabled={(this.state.name===this._initialName) || (this.state.name==='')}/>
      </View>
    );
  }

  render(){
    return (
      <View style={styles.container}>
        {this.state.drinks && this.renderOrder()}
        {!this.state.drinks && this.renderLoading()}
      </View>
    );
  }


  /*
  * API CALLS
  * TODO: PATH SHOULD CHANGE DEPENDING ON DRINK (IF THERE ARE DIFF DRINKS)
  */
  deleteOrder(){
    return fetch(ApiUtil.ENDPOINT+ApiUtil.ORDER_PATH+this.state.order.id,{
      method: 'DELETE',
      headers: {'Content-Type': 'application/json'}
    })
    .then(ApiUtil.checkStatus)
    .then((response) => response.json())
    .then((responseJson) => {
      this.props.onComplete();
    })
    .catch((error) => {
      console.error(error);
    })
  }

  updateOrder(){
    return fetch(ApiUtil.ENDPOINT+this.state.order.id,{
      method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({name : this.state.name})
    })
    .then(ApiUtil.checkStatus)
    .then((response) => response.json())
    .then((responseJson) => {
      this.props.onComplete();
    })
    .catch((error) => {
      console.error(error);
    })
  }

  deleteDrink(drink){
    return fetch(ApiUtil.ENDPOINT+ApiUtil.ORDER_PATH+this.state.order.id+'/'+ApiUtil.COFFEE_PATH+drink.id,{
      method: 'DELETE',
      headers: {'Content-Type': 'application/json'}
    })
    .then(ApiUtil.checkStatus)
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

  fetchData(){
    var drinkList = [];
    for(var i=0;i<this.state.order.coffees.length;i++){
      fetch(ApiUtil.ENDPOINT+ApiUtil.ORDER_PATH+this.state.order.id+'/'+ApiUtil.COFFEE_PATH+this.state.order.coffees[i].id)
      .then(ApiUtil.checkStatus)
      .then((response) => response.json())
      .then((responseJson) => {
        drinkList = [...drinkList,responseJson];
        if(drinkList.length===this.state.order.coffees.length){
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

const styles = StyleSheet.create({
  spinner: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
    flex: 1,
    padding: 8,
  },
  text:{
    fontSize: 24,
    fontWeight:'bold'
  },
  containerRow:{
    flexDirection:'row',
    justifyContent:'space-between',
    marginBottom:8
  },
  container:{
    flex: 1,
    padding: 10,
    justifyContent:'space-between'}
});

export default Order;
