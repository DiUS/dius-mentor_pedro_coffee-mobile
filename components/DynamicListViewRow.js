import React, { Component } from 'react';
import { Animated } from 'react-native';


export default class DynamicListViewRow extends Component {

   _defaultHeightValue = 45;
   _defaultTransition  = 500;
   state = {
       _rowHeight  : new Animated.Value(this._defaultHeightValue),
       _rowOpacity : new Animated.Value(0)
   };

   componentDidMount() {
       Animated.timing(this.state._rowOpacity, {
           toValue  : 1,
           duration : this._defaultTransition
       }).start()
   }

   componentWillReceiveProps(nextProps) {
       if (nextProps.willAnimateDelete) {
           this.deleteAnimation(nextProps.didAnimateDelete);
       } else {
  // we need this for iOS because iOS does not reset list row style properties
           this.resetHeight()
       }
   }

   deleteAnimation(callback) {
       Animated.timing(this.state._rowHeight, {
           toValue  : 0,
           duration : this._defaultTransition
       }).start(callback);
   }

   resetHeight() {
       Animated.timing(this.state._rowHeight, {
           toValue  : this._defaultHeightValue,
           duration : 0
       }).start();
   }

   render() {
       return (
           <Animated.View
               style={{height: this.state._rowHeight, opacity: this.state._rowOpacity}}>
               {this.props.children}
           </Animated.View>
       );
   }

}
