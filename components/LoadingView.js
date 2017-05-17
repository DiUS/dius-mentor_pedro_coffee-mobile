'use strict';

import React, { Component } from 'react';
import { View, ActivityIndicator, StyleSheet  } from 'react-native';
import Style from '../style/style';

export default class LoadingView extends Component {

    render(){
      return(
        <View style={Style.container}>
          <ActivityIndicator
            style={Style.spinner}
            size="large"/>
        </View>
      );
    }
}
