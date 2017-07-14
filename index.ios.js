import React, { Component } from 'react';
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
      polylineCoord: [{latitude: 0, longitude: 0}, {latitude: 0, longitude: 0}]
    };
    this.updatePolylineCoord = this.updatePolylineCoord.bind(this);
  }

  updatePolylineCoord(arr){
    this.setState({
      polylineCoord: arr
    });
  }

  componentDidUpdate(){
    console.log('I AM IN PARENT COMPONENT');
    console.log(this.state);
  }

  render() {
    return (
      <View style={{flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'stretch'}}>
        <Information />
        <MetroMap polylineCoord={this.state.polylineCoord} />
        <DirectionsBar updatePolylineCoord={this.updatePolylineCoord}/>
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
