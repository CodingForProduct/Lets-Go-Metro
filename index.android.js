import React, { Component } from 'react';
import {
  AppRegistry,
  View,
} from 'react-native';
import Information from './app/components/Information';
import MetroMap from './app/components/MetroMap';
import DirectionsBar from './app/components/DirectionsBar';


export default class letsGoMetro extends Component {
  render() {
    return (
      <View style={{flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'stretch'}}>
        <Information />
        <MetroMap />
        <DirectionsBar />
      </View>
    );
  }
}

AppRegistry.registerComponent('letsGoMetro', () => letsGoMetro);
