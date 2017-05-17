'use strict';

import React, { Component } from 'react';
import { View, ListView, StyleSheet } from 'react-native';
import Style from '../style/style';

export default class OptionsListView extends Component {
  render(){
    return (
      <ListView
        enableEmptySections={true}
        dataSource={this.props.dataSource}
        renderRow = {this.props.renderRow}
        renderSeparator={(sectionId, rowId) =>
          <View key={rowId} style={Style.separator}/>
        }
      />
    );
  }
}
