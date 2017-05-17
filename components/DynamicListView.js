'use strict';

import React, { Component } from 'react';
import { View, ListView, Text, TouchableHighlight, Button } from 'react-native';
import DynamicListViewRow from '../components/DynamicListViewRow';
import Style from '../style/style';

export default class DynamicListView extends Component {
  constructor(props){
    super(props);
    this._data=this.props.data;
    this.state = {
      dataSource : new ListView.DataSource({rowHasChanged : (r1, r2) => true}),
      rowToDelete : null
    }
  }

  componentDidMount() {
    let ds = this.state.dataSource.cloneWithRows(this._data);
    this.setState({
      dataSource : ds
    });
  }

  _renderRow(rowData, sectionID, rowId){
    return (
      <DynamicListViewRow
           willAnimateDelete={this.state.rowToDelete && rowData.id === this.state.rowToDelete.id}
           didAnimateDelete={this._didAnimateDelete.bind(this)}>
           <View style={{flexDirection: 'row', justifyContent:'space-between'}}>
             <View style={{flex : 5}}>
               {this.props.renderRow(rowData)}
             </View>
             <View style={{marginLeft: 4, flex : 1}}>
               <Button title={'X'} onPress={()=>this._willAnimateDelete(rowData)} color='#ff6666'/>
             </View>
           </View>
      </DynamicListViewRow>
    );
  }


  render(){
    return (
      <ListView
        enableEmptySections={true}
        dataSource={this.state.dataSource}
        renderRow = {this._renderRow.bind(this)}
        renderSeparator={(sectionId, rowId) =>
          <View key={rowId} style={Style.separator}/>
        }
      />
    );
  }

  componentWillUpdate(nexProps, nexState) {
      if (nexState.rowToDelete !== null) {
          this._data = this._data.filter((item) => {
              if (item.id !== nexState.rowToDelete.id) {
                  return item;
              }
          });
      }
  }

  _willAnimateDelete(data) {
      this.setState({
          rowToDelete : data
      });
      this.props.willDelete(data);
  }

  _didAnimateDelete() {
      var row = this.state.rowToDelete;
      this.setState({
          rowToDelete : null,
          dataSource  : this.state.dataSource.cloneWithRows(this._data)
      });
      this.props.didDelete(row);
  }

}
