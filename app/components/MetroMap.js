import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  TouchableHighlight,
  Text,
  Modal,
  StyleSheet
} from 'react-native';
import MapView from 'react-native-maps';


const LATITUDE_DELTA = 0.5,
  LONGITUDE_DELTA = 0.45,
  LATITUDE_DELTA_ZOOM = 0.02,
  LONGITUDE_DELTA_ZOOM = 0.015,
  ZOOM_IN_FACTOR = 0.005,
  ZOOM_OUT_FACTOR = 0.01

export default class MetroMap extends Component {
  constructor(props){
    super(props);
    this.state = {
      region: {
        latitude: 34.0498,
        longitude: -118.2389,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      },
      polylineCoord: [{latitude: 0, longitude: 0}, {latitude: 0, longitude: 0}]
    };
    this.zoomIn = this.zoomIn.bind(this);
    this.zoomOut = this.zoomOut.bind(this);
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(position => {
      console.log('this is the position ', position);
      console.log('this is MapView ', MapView)
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
          latitudeDelta: this.state.region.latitudeDelta - ZOOM_IN_FACTOR,
          longitudeDelta: this.state.region.longitudeDelta - ZOOM_IN_FACTOR
        }
      });
      console.log(this.state.region.latitudeDelta);
      console.log(this.state.region.longitudeDelta);
    }
  }

  zoomOut(){
    console.log('CONSOLE LOG PRESS ZOOM OUT');
    if (this.state.region.latitudeDelta < 1){
      console.log('INSIDE IF ZOOMOUT STATEMENT');
      this.setState({
        region: {
          latitude: this.state.region.latitude,
          longitude: this.state.region.longitude,
          latitudeDelta: this.state.region.latitudeDelta + ZOOM_OUT_FACTOR,
          longitudeDelta: this.state.region.longitudeDelta + ZOOM_OUT_FACTOR
        }
      });
    }
  }

  render(){
    var arrivalPoints = this.props.transitDetails.map((el, idx) =>{
      return(
        <MapView.Marker
        key={idx}
        coordinate={{latitude: el.arrival_stop.location.lat, longitude: el.arrival_stop.location.lng}}
        title={el.line.name + ', '+ el.arrival_stop.name}
        description={el.arrival_time.text}
        pinColor="blue"
        />
      );
    });

    var departurePoints = this.props.transitDetails.map((el, idx) =>{
      return(
        <MapView.Marker
        key={idx}
        coordinate={{latitude: el.departure_stop.location.lat, longitude: el.departure_stop.location.lng}}
        title={el.line.name + ', '+el.departure_stop.name}
        description={el.departure_time.text}
        pinColor="green"
        />
      );
    });

    return(
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
          <MapView.Marker coordinate={{latitude: this.state.region.latitude, longitude: this.state.region.longitude}} />
          {arrivalPoints}
          {departurePoints}
        <MapView.Marker coordinate={{
              latitude: this.props.lastPt.latitude, longitude: this.props.lastPt.longitude
            }} pinColor="red" />
          <MapView.Polyline
            coordinates={this.props.polylineCoord}
            strokeColor='#FF530D'
            lineCap='round'
            strokeWidth={3}
          />
        </MapView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // ...StyleSheet.absoluteFillObject,
    // flex: 2,
    // height: 400,
    // justifyContent: 'flex-end',
    // alignItems: 'center',
    // alignItems: 'stretch',
    // position: 'relative'
    // borderRadius: 4,
    // borderWidth: 0.5,
    // borderColor: 'blue',
    position: 'relative',
    height: '100%',
    width: '100%',
    paddingTop: 100,
    paddingBottom: 100,
    backgroundColor: 'green'
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    borderColor: 'orange'
  },
  leftButton: {
    // marginBottom: 30,
    // padding: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    position: 'absolute',
    zIndex: 999,
    top: 140,
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
    top: 140,
    right: 18,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#AEACBA'
  },
  buttonText: {
    // padding: 20,
    color: 'black',
  },
});
