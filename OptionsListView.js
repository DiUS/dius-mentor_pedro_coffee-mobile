'use strict';

import React, { Component } from 'react';
import { View, ListView, Button, StyleSheet } from 'react-native';
import extras from './default_data/extras.json';

class OptionsListView extends Component {
  render(){
    return (
      <ListView
        enableEmptySections={true}
        dataSource={this.props.dataSource}
        renderRow = {this.props.renderRow}
        renderSeparator={(sectionId, rowId) =>
          <View key={rowId} style={styles.separator}/>
        }
      />
    );
  }
}

const styles = StyleSheet.create({
  separator: {
    flex: 1,
    height: 6,
    backgroundColor: '#FFFFFF',
  }
});

export default OptionsListView;
