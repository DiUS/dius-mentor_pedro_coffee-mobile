'use strict';

import React, { Component } from 'react';
import { View, ListView, Button, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Options from '../components/Options';
import hotDrinks from '../default_data/hotDrinks.json';
import ExtrasListView from '../components/ExtrasListView';
import OptionsListView from '../components/OptionsListView';
import Style from '../style/style';

//4 Steps (States) detected in this view
var STEP_INITIAL = 0;
var STEP_STYLE = 1;
var STEP_SIZE = 2;
var STEP_EXTRAS = 3; //This is actually a ghost STEP as is not currently enabled

var ds = new ListView.DataSource({rowHasChanged : (r1, r2) => r1 !== r2});

class Drink extends Component {
  constructor(props) {
    super(props);
    this._initialDrink = this.props.drink;
    this.state = {
      //TODO: Modify when API accepts other drinks for drink:this.props.drink
      drink: {
        id:this.props.drink?this.props.drink.id:null,
        type:this.props.drink?'Coffee':null, //Only coffee accepted right now
        style:this.props.drink?this.props.drink.style:null,
        size:this.props.drink?this.props.drink.size:null
      },
      step: this.props.drink?STEP_EXTRAS:STEP_INITIAL,
      drinkOptions:this.props.options,
      //TODO FETCH DATA FROM API IN componentDidMount
      optionsList: ds.cloneWithRows(hotDrinks)
    };
  }

  componentDidMount(){
    //FETCH MENU WHEN MORE DRINKS AVAILABLE --> NOW HOTDRINKS DEFAULT DATA
  }

  onBack(){
    this.props.onCreate();
  }

  onSelectType(type){//Called on Initial Step. Initial Step is mandatory
    var currentDrink = this.state.drink;
    currentDrink.type=type;
    currentDrink.style=null;
    currentDrink.size=null;
    this.onStep(currentDrink);
  }

  onSelectStyle(style){
    var currentDrink = this.state.drink;
    currentDrink.style = style;
    currentDrink.size=null;
    this.onStep(currentDrink);
  }

  onSelectSize(size){
    var currentDrink = this.state.drink;
    currentDrink.size = size;
    this.onStep(currentDrink);
  }

  onStep(drink){
    var currentOptions = null;
    var step=STEP_INITIAL;
    if(!drink.type) {
      step=STEP_INITIAL;
    }
    else if (!drink.style && this.state.drinkOptions.style) {
      step=STEP_STYLE;
    }
    else if (!drink.size && this.state.drinkOptions.size) {
      step=STEP_SIZE;
    }
    else {
      step=STEP_EXTRAS;
    }
    switch (step) {
      case STEP_INITIAL: //initial
        currentOptions=ds.cloneWithRows(hotDrinks);
        break;
      case STEP_STYLE: //choose style
        currentOptions=ds.cloneWithRows(this.state.drinkOptions.style);
        break;
      case STEP_SIZE: //choose size
        currentOptions=ds.cloneWithRows(this.state.drinkOptions.size);
        break;
      default:break;
    }
    this.setState({
      drink: drink,
      optionsList : currentOptions,
      step: step
    });
  }

  renderRowSelect(rowData){
    switch (this.state.step) {
      case STEP_INITIAL:
        return (<Button title={rowData} onPress={()=>this.onSelectType(rowData)}/>);
        break;
      case STEP_STYLE:
        return (<Button title={rowData} onPress={()=>this.onSelectStyle(rowData)}/>);
        break;
      case STEP_SIZE:
        return (<Button title={rowData} onPress={()=>this.onSelectSize(rowData)}/>);
        break;
      default:break;
    }
  }

  renderSelectedValues(){
    return(
      <View style={Style.containerSelectedDrink}>
        <View style={Style.containerDrink}>
          {this.state.drink.type &&
            <View style={Style.margin}>
              <Button
                title={this.state.drink.type}
                onPress={()=>this.onSelectType()}
                color='#c8dcf4'/>
            </View>}
          {this.state.drink.style &&
            <View style={Style.margin}>
             <Button
               title={this.state.drink.style}
               onPress={()=>this.onSelectStyle()}
               color='#c8dcf4'/>
            </View>}
          {this.state.drink.size &&
            <View style={Style.margin}>
              <Button
                title={this.state.drink.size}
                onPress={()=>this.onSelectSize()}
                color='#c8dcf4'/>
            </View>}
        </View>
      </View>
    );
  }

  renderOptions(){
    if(this.state.step>2){
      return <ExtrasListView/>;
    }
    else{
      return <OptionsListView
        renderRow={this.renderRowSelect.bind(this)}
        dataSource={this.state.optionsList}/>;
    }
  }

  render() {
    return (
      <View style={{flex: 1, padding: 10}}>
        <Text>Current Selection:</Text>
        {this.renderSelectedValues()}
        <Text>Choose your {this.state.step>STEP_SIZE?"extras":"drink options"}:</Text>
        {this.renderOptions()}
        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
          <View style={{flex : 1, marginRight:4}}>
            <Button title='<' onPress={()=>this.onBack()} />
          </View>
          <View style={{flex : 8, marginLeft:4}}>
            {this._initialDrink &&
              <Options onSaveTitle='Update Drink' onSave={()=>this.props.onUpdate(this.state.drink)}
                onSaveDisabled={!(this.state.step>STEP_SIZE) ||
                  (this.state.drink.style===this._initialDrink.style &&
                    this.state.drink.size===this._initialDrink.size)}/>}
            {!this._initialDrink &&
              <Options onSaveTitle='Add Drink' onSave={()=>this.props.onCreate(this.state.drink)}
                onSaveDisabled={!(this.state.step>STEP_SIZE)}/>}
          </View>
        </View>
      </View>
    );
  }

}

export default Drink;
