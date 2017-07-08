/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  View,
  // StyleSheet,
  // Text,
  // View,
  // TextInput,
  // TouchableOpacity
} from 'react-native';
// import MapView from 'react-native-maps';
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

// const styles = StyleSheet.create({
//   welcome: {
//     fontSize: 20,
//     textAlign: 'center',
//     margin: 10,
//   },
// });

AppRegistry.registerComponent('letsGoMetro', () => letsGoMetro);
