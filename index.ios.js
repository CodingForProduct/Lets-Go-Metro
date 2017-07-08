/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';
import MapView from 'react-native-maps';

export default class letsGoMetro extends Component {
  constructor(props){
    super(props);
    this.state = {
      region: {
        latitude: 34.0498,
        longitude: -118.2389,
        latitudeDelta: 0.5,
        longitudeDelta: 0.45
      }
    };
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(position => {
      console.log(position);
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          region={this.state.region}>
        </MapView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: 400,
    width: 400,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('letsGoMetro', () => letsGoMetro);
