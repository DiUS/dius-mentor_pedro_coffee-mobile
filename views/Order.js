'use strict';

import React, { Component } from 'react';
import { View, ListView, Button, Text, TextInput, StyleSheet, ActivityIndicator } from 'react-native';
import OptionsListView from '../components/OptionsListView';
import Options from '../components/Options';

class Order extends Component{
  constructor(props){
    super(props);
    var ds = new ListView.DataSource({rowHasChanged : (r1, r2) => r1 !== r2});
    //Initial values needed to toggle action buttons
    this._initialName=this.props.order.name;
    this._drinks=this.props.order.coffees?this.props.order.coffees:[]
    this.state = {
      name : this.props.order.name,
      order : this.props.order,
      drinks : ds.cloneWithRows(this._drinks)
    }
  }

  onBack(){
    this.props.onUpdateOrder();
  }

  renderRowSelect(rowData){
    return (
      <View style={{flexDirection: 'row', justifyContent:'space-between'}}>
        <View style={{flex : 5}}>
          <Button title={rowData.summary} onPress={()=>this.props.onSelectDrink(rowData)}/>
        </View>
        <View style={{marginLeft: 4, flex : 1}}>
          <Button title={'X'} onPress={()=>this.props.onDeleteDrink(rowData)} color='#ff6666'/>
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
              <Button title={'+'} onPress={()=>this.props.onSelectDrink()}/>
            </View>
        </View>

        <OptionsListView
          dataSource={this.state.drinks}
          renderRow={this.renderRowSelect.bind(this)}/>

        <Options
          onBack={this.onBack.bind(this)}
          onBackDisabled={!this.state.name || !this._initialName}
          onCancel={()=>this.props.onDeleteOrder(this.state.order.id)}
          onSave={()=>this.props.onUpdateOrder(this.state.order.id,this.state.name)}
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
