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
  TextInput,
  TouchableOpacity
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
    this.zoomIn = this.zoomIn.bind(this);
    this.zoomOut = this.zoomOut.bind(this);
  }

  // componentDidUpdate
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

  zoomIn(){
    if (this.state.region.latitudeDelta > 0.01){
      console.log('INSIDE IF STATEMENT');
      this.setState({
        region: {
          latitude: this.state.region.latitude,
          longitude: this.state.region.longitude,
          latitudeDelta: this.state.region.latitudeDelta - 0.005,
          longitudeDelta: this.state.region.longitudeDelta - 0.005
        }
      });
    }
  }

  zoomOut(){
    if (this.state.region.latitudeDelta < 1){
      this.setState({
        region: {
          latitude: this.state.region.latitude,
          longitude: this.state.region.longitude,
          latitudeDelta: this.state.region.latitudeDelta + 0.01,
          longitudeDelta: this.state.region.longitudeDelta + 0.01
        }
      });
    }
    console.log(this.state.region.latitudeDelta);
    console.log(this.state.region.longitudeDelta);
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
          <View>

          </View>
        </View>
        <View style={styles.container}>
          <TouchableOpacity onPress={this.zoomIn} style={styles.leftButton}>
              <View >
                <Text style={styles.buttonText}>+</Text>
              </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.zoomOut} style={styles.rightButton}>
              <View >
                <Text style={styles.buttonText}>-</Text>
              </View>
          </TouchableOpacity>
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
  leftButton: {
    // marginBottom: 30,
    // padding: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    position: 'absolute',
    zIndex: 999,
    top: 10,
    right: 40,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#AEACBA'
  },
  rightButton: {
    // marginBottom: 30,
    // padding: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    position: 'absolute',
    zIndex: 999,
    top: 10,
    right: 18,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#AEACBA'
  },
  buttonText: {
    // padding: 20,
    color: 'black',
  },
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
    position: 'relative'
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
