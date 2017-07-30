import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  AppRegistry,
  View,

} from 'react-native';
import Information from './app/components/Information';
import MetroMap from './app/components/MetroMap';
import DirectionsBar from './app/components/DirectionsBar';


export default class letsGoMetro extends Component {

  constructor(){
    super();
    this.state = {
      polylineCoord: [{latitude: 0, longitude: 0}, {latitude: 0, longitude: 0}],
      transitDetails: [],
      stepsArr: [],
      lastPt: {latitude: 0, longitude: 0}
    };
    this.updatePolylineCoord = this.updatePolylineCoord.bind(this);
    this.setMarkers = this.setMarkers.bind(this);
  }

  componentDidUpdate(){
    console.log('THIS IS STATE INSIDE PARENT');
    console.log(this.state);
  }

  updatePolylineCoord(arr){
    this.setState({
      polylineCoord: arr
    });
  }

  setMarkers(arr, stepsArr, lastPt){
    this.setState({
      transitDetails: arr,
      stepsArr: stepsArr,
      lastPt: lastPt
    });
  }

  componentDidUpdate(){
    console.log('I AM IN PARENT COMPONENT');
    console.log(this.state);
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center'}}>
        <Information />
        <MetroMap polylineCoord={this.state.polylineCoord} transitDetails={this.state.transitDetails} stepsArr={this.state.stepsArr} lastPt={this.state.lastPt} />
        <DirectionsBar updatePolylineCoord={this.updatePolylineCoord} setMarkers={this.setMarkers} />
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
