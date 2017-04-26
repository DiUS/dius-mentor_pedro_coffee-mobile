'use strict';

import React, { Component } from 'react';
import { View, ListView, Button, StyleSheet } from 'react-native';
import extras from '../default_data/extras.json';
// import PopupDialog from 'react-native-popup-dialog';
//TODO: ADD Dialogs for extras selection && filter extras depending on menu

class ExtrasListView extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
        rowHasChanged : (r1, r2) => r1 !== r2
    });

    this.state = {
      totalPrice: 0,
      selectedValues: [],
      extrasList: ds.cloneWithRows(extras)
    };
  }

  onPopupDialog(value){
    // this.popupDialog.show();
  }

  renderRow(rowData){
    return(
        <Button title={rowData.title+(rowData.default?": "+rowData.default:"")} onPress={()=>this.onPopupDialog(rowData)}/>
    )
  }

  render(){
    return (
      <View>
        <ListView
          enableEmptySections={true}
          dataSource={this.state.extrasList}
          renderRow = {this.renderRow.bind(this)}
          renderSeparator={(sectionId, rowId) =>
            <View key={rowId} style={styles.separator}/>
          }
        />
      </View>
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

export default ExtrasListView;
