'use strict';

import React, { Component } from 'react';
import { Button } from 'react-native';

class BackButton extends Component {
    render(){
      return(
        <Button title={this.props.title?this.props.title:'<'} onPress={this.props.onPress} disabled={this.props.disabled?this.props.disabled:false}/>
      );
    }
}

export default BackButton;
