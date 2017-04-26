'use strict';

import React, { Component } from 'react';
import { Button } from 'react-native';

class CancelButton extends Component {
    render(){
      return(
        <Button title={this.props.title?this.props.title:'Cancel'} onPress={this.props.onPress} disabled={this.props.disabled?this.props.disabled:false} color='#ff6666'/>
      );
    }
}

export default CancelButton;
