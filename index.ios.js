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
  View,
  TextInput
} from 'react-native';
import MapView from 'react-native-maps';

const LATITUDE_DELTA = 0.5, LONGITUDE_DELTA = 0.45, LATITUDE_DELTA_ZOOM = 0.02, LONGITUDE_DELTA_ZOOM = 0.015


export default class letsGoMetro extends Component {
  constructor(props){
    super(props);
    this.state = {
      region: {
        latitude: 34.0498,
        longitude: -118.2389,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      }
    };
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(position => {
      console.log(position);
      this.setState({
        region: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: LATITUDE_DELTA_ZOOM,
          longitudeDelta: LONGITUDE_DELTA_ZOOM
        }
      })
    })
  }

  render() {
    return (
      <View style={{flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'stretch'}}>
        <View style={styles.information}>
          <View style={styles.informationImage}>
          </View>
          <View style={styles.informationText}>
            <Text>
              Hi, I'm Metro Driver. I will help you get where you need to go.
            </Text>
          </View>
        </View>
        <View style={styles.container}>
          <MapView
            style={styles.map}
            region={this.state.region}>
          </MapView>
        </View>
        <View style={styles.directionBar}>
          <View style={styles.directionImage}>
          </View>
          <View style={styles.directionInput}>
            <TextInput style={styles.inputText} placeholder="Current Location" />
            <TextInput style={styles.inputText} placeholder="Destination" />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  information: {
    // ...StyleSheet.absoluteFillObject,
    flex: 0.5,
    // height: 180,
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: 'red',
  },
  informationImage: {
    width: 80,
    height: 80,
    marginTop: 30,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: 'purple',
  },
  informationText: {
    width: 250,
    height: 80,
    marginTop: 30,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: 'orange',
    padding: 20,
  },
  container: {
    // ...StyleSheet.absoluteFillObject,
    flex: 2,
    // height: 400,
    // justifyContent: 'flex-end',
    // alignItems: 'center',
    // alignItems: 'stretch',
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: 'blue',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    borderColor: 'orange'
  },
  directionBar: {
    flex: 0.5,
    flexDirection: 'row',
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: 'green',
    justifyContent: 'center',
  },
  directionImage: {
    marginTop: 5,
    marginRight: 10,
    height: 100,
    width: 40,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: 'orange',
  },
  directionInput: {
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  inputText: {
    height: 40,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: 'black',
    width: 250
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
