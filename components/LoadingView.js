'use strict';

import React, { Component } from 'react';
import { View, ActivityIndicator, StyleSheet  } from 'react-native';

class LoadingView extends Component {

    render(){
      return(
        <View style={styles.container}>
          <ActivityIndicator
            style={styles.spinner}
            size="large"/>
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
  }
});

export default LoadingView;
