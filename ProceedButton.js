'use strict';

import React, { Component } from 'react';
import { View, Button } from 'react-native';

class ProceedButton extends Component {
    render(){
      return(
        <Button title={this.props.title} onPress={this.props.onPress} disabled={this.props.disabled?this.props.disabled:false} color='#79d279'/>
      );
    }
}

export default ProceedButton;
