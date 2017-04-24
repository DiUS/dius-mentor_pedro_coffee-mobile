'use strict';

import React, { Component } from 'react';
import { View, ListView, Button, Text, StyleSheet } from 'react-native';
import ProceedButton from './ProceedButton';
import hotDrinks from './default_data/hotDrinks.json';
import ExtrasListView from './ExtrasListView';
import OptionsListView from './OptionsListView';
import ApiUtils from './ApiUtils';

//4 Steps detected in this view
var STEP_INITIAL = 0;
var STEP_STYLE = 1;
var STEP_SIZE = 2;
var STEP_EXTRAS = 3;

var ds = new ListView.DataSource({rowHasChanged : (r1, r2) => r1 !== r2});

class Drink extends Component {
  constructor(props) {
    super(props);
    this._isNew = this.props.drink?false:true;
    this.state = {
      order: this.props.order,
      drink: {
        type:null,
        style:this.props.drink?this.props.drink.style:null,
        size:this.props.drink?this.props.drink.size:null
      },
      step: this.props.drink?STEP_EXTRAS:STEP_INITIAL,
      //Visible Options
      drinkOptions: {
        styleOptions:null,
        sizeOptions:null
      },
      //TODO FETCH DATA FROM API && SAME WITH EXTRAS LIST
      optionsList: ds.cloneWithRows(hotDrinks)
    };
  }

  onBack(){
    this.props.onComplete(this.state.order);
  }

  onAddDrink(){
    //TODO PATH WILL CHANGE DEPENDING ON DRINK (IF THERE ARE DIFF DRINKS)
    return fetch(ApiUtils.ENDPOINT+this.state.order.id+'/'+ApiUtils.COFFEE_PATH,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        style : this.state.drink.style,
        size : this.state.drink.size,
      })
    })
    .then(ApiUtils.checkStatus)
    .then((response) => response.json())
    .then((responseJson) => {
      var newDrinks = this.state.order.coffees;
      if(!newDrinks){
        newDrinks = [responseJson];
      }
      else{
        newDrinks = [...newDrinks,responseJson];
      }
      var newOrder = this.state.order;
      newOrder.coffees = newDrinks;
      this.props.onComplete(newOrder);
    })
    .catch((error) => {
      //TODO Reset to Initial View
      console.error(error);
    })
  }

  onSelectType(value){//Called on Initial Step. Initial Step is mandatory
    var currentDrink = this.state.drink;
    var currentDrinkOptions = this.state.drinkOptions;
    currentDrink.type=value.title;
    currentDrinkOptions.styleOptions=value.type;
    currentDrinkOptions.sizeOptions=value.size;
    var step=STEP_INITIAL;
    if (value.type)       {step=STEP_STYLE;}
    else if (value.size)  {step=STEP_SIZE;}
    else                  {step=STEP_EXTRAS;}
    this.setState({
      drinkOptions: currentDrinkOptions
    });
    this.onStep(step,currentDrink);
  }

  onSelectStyle(style){
    var currentDrink = this.state.drink;
    currentDrink.style = style.title;
    var step=this.state.step;
    if(this.state.drinkOptions.sizeOptions) {step=STEP_SIZE;}
    else                                    {step=STEP_EXTRAS;}
    this.onStep(step,currentDrink);
  }

  onSelectSize(size){
    var currentDrink = this.state.drink;
    currentDrink.size = size.title;
    this.onStep(STEP_EXTRAS,currentDrink);
  }

  onStep(step,drink){
    var currentDrink = drink?drink:this.state.drink;
    var currentOptions = null;
    switch (step) {
      case STEP_INITIAL: //initial
        currentDrink.type = null;
        currentDrink.style = null;
        currentDrink.size = null;
        currentOptions=ds.cloneWithRows(hotDrinks);
        break;
      case STEP_STYLE: //choose style
        currentDrink.style = null;
        currentDrink.size = null;
        currentOptions=ds.cloneWithRows(this.state.drinkOptions.styleOptions);
        break;
      case STEP_SIZE: //choose size
        currentDrink.size = null;
        currentOptions=ds.cloneWithRows(this.state.drinkOptions.sizeOptions);
        break;
      default:break;
    }
    this.setState({
      drink : currentDrink,
      optionsList : currentOptions,
      step: step
    });
  }

  _renderRowSelect(rowData){
    switch (this.state.step) {
      case STEP_INITIAL:
        return (<Button title={rowData.title} onPress={()=>this.onSelectType(rowData)}/>);
        break;
      case STEP_STYLE:
        return (<Button title={rowData.title} onPress={()=>this.onSelectStyle(rowData)}/>);
        break;
      case STEP_SIZE:
        return (<Button title={rowData.title} onPress={()=>this.onSelectSize(rowData)}/>);
        break;
      default:break;
    }
  }

  _renderSelectedValues(){
    return(
      <View style={{
        flex: 0.45,
        alignItems: 'flex-start',
        alignSelf:'stretch',
      }}>
        <View style={styles.container}>
          {this.state.drink.type &&
            <View style={styles.margin}>
              <Button title={this.state.drink.type} onPress={()=>this.onStep(STEP_INITIAL)} color='#c8dcf4'/>
            </View>
          }
          {this.state.drink.style &&
            <View style={styles.margin}>
             <Button title={this.state.drink.style} onPress={()=>this.onStep(STEP_STYLE)} color='#c8dcf4'/>
            </View>
          }
          {this.state.drink.size &&
            <View style={styles.margin}>
              <Button title={this.state.drink.size} onPress={()=>this.onStep(STEP_SIZE)} color='#c8dcf4'/>
            </View>
          }
        </View>
      </View>
    );
  }

  _renderOptions(){
    if(this.state.step>2){
      return <ExtrasListView/>;
    }
    else{
      return <OptionsListView
        renderRow={this._renderRowSelect.bind(this)}
        dataSource={this.state.optionsList}/>;
    }
  }

  render() {
    return (
      <View style={{flex: 1, padding: 10}}>
        <Text>Current Selection:</Text>
        {this._renderSelectedValues()}
        <Text>Choose your {this.state.step>STEP_SIZE?"extras":"drink"}:</Text>
        {this._renderOptions()}
        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
          <View style={{flex : 1, marginRight:4}}>
            <Button title='<' onPress={()=>this.onBack()} />
          </View>
          <View style={{flex : 8, marginLeft:4}}>
            <ProceedButton title='Add Coffee' onPress={()=>this.onAddDrink()} disabled={!(this.state.step>STEP_SIZE) || !this._isNew}/>
          </View>
        </View>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container:{
    flex:1,
    alignItems:'stretch',
    alignSelf:'stretch',
  },
  margin:{
    marginTop: 8,
  }
});

export default Drink;
