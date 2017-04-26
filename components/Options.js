'use strict';

import React, { Component } from 'react';
import { Button, View } from 'react-native';
import BackButton from './BackButton';
import CancelButton from './CancelButton';
import SaveButton from './SaveButton';

class Options extends Component {
    render(){
      return(
        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
          {this.props.onBack &&
            <View style={{flex : 1, marginRight:4}}>
              <BackButton onPress={this.props.onBack}
                title={this.props.onBackTitle}
                disabled={this.props.onBackDisabled}/>
            </View>}
          {this.props.onCancel &&
            <View style={{flex : 4, marginLeft:4, marginRight:4}}>
              <CancelButton onPress={this.props.onCancel}
                title={this.props.onCancelTitle}
                disabled={this.props.onCancelDisabled}/>
            </View>}
          {this.props.onSave &&
            <View style={{flex : 4, marginLeft:4}}>
              <SaveButton onPress={this.props.onSave}
                title={this.props.onSaveTitle}
                disabled={this.props.onSaveDisabled}/>
            </View>}
        </View>
      );
    }
}

export default Options;
