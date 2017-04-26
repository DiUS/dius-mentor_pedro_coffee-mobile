'use strict';

import React, { Component } from 'react';
import { Button } from 'react-native';

class SaveButton extends Component {
    render(){
      return(
        <Button title={this.props.title?this.props.title:'Save'} onPress={this.props.onPress} disabled={this.props.disabled?this.props.disabled:false} color='#79d279'/>
      );
    }
}

export default SaveButton;
