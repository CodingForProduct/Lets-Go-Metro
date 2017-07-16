import React, { Component } from 'react';
const decodePolyline = require('decode-google-map-polyline');
import {
  View,
  TextInput,
  StyleSheet,
  Image,
  Animated,
  Text,
  TouchableOpacity
} from 'react-native';

// use Animated.event
// if not, use Animated.timing and state to activate it inside componentDidUpdate
const API_KEY = 'AIzaSyCdPnAPE-Kqy_VWKiFtX8Zm4b0T7wyyZ38',
  API_PLACES_ROOT = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?key=' + API_KEY,
  API_GEOCODE_ROOT = 'https://maps.googleapis.com/maps/api/geocode/json?key=' + API_KEY,
  API_DIRECTIONS_ROOT = 'https://maps.googleapis.com/maps/api/directions/json?key=' + API_KEY + '&mode=transit&unit=imperial';



export default class DirectionsBar extends Component {
  constructor(props){
    super(props);
    this.state = {
      originSelectionAddress: "",
      originSelectionCoord: {
        latitude: "",
        longitude: ""
      },
      destinationText: "",
      destinationSuggestion1: "",
      destinationSuggestion2: "",
      destinationSelection: "",
      showPredictions: false,
      showInput: true,
      showDirections: false,
      noHeight: new Animated.Value(0),
      noHeightBtn: new Animated.Value(0),
      componentHeight: new Animated.Value(100),
      directionsHeight: 0,
      inputHeight: 100,
      directions: []
    }
    this.setOriginText = this.setOriginText.bind(this);
    this.animateBar = this.animateBar.bind(this);
    this.chooseAddress1 = this.chooseAddress1.bind(this);
    this.chooseAddress2 = this.chooseAddress2.bind(this);
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(position => {
      let endpt = API_GEOCODE_ROOT + '&latlng=' + position.coords.latitude + ',' + position.coords.longitude;
      fetch(endpt, {
        method: 'GET'
      }).then(response => {
        this.setState({
          originSelectionAddress: JSON.parse(response._bodyInit).results[0].formatted_address,
          originSelectionCoord: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
          }
        });
      }).catch(err => {
        console.log(err);
      })
    })
  }

  componentDidUpdate(prevProps, prevState) {

    // making the call for directions
    if (prevState.destinationSelection != this.state.destinationSelection && (this.state.destinationSelection && this.state.originSelectionAddress)){

      if (this.state.destinationSelection == 'suggestion1'){
        var qsDestination = this.state.destinationSuggestion1.split(' ').join('+');
        var qsOrigin = this.state.originSelectionAddress.split(' ').join('+')
        let endpt = API_DIRECTIONS_ROOT + '&origin=' + qsOrigin + '&destination=' + qsDestination;
        console.log('THIS IS THE ENDPT');
        console.log(endpt);

        fetch(endpt, {
          method: 'GET'
        }).then(response => {
          console.log('THESE ARE DIRECTIONS WE ARE GETTING BACK FROM SERVER');
          // console.log(response);
          let responseData = JSON.parse(response._bodyInit);

          let legs = responseData.routes[0].legs[0].steps;
          let stepsArr = [];
          let directionsArr = [];
          let transitDetails = [];

          legs.forEach(el => {
            if (el.travel_mode === 'TRANSIT'){
              stepsArr.push({
                latitude: el.start_location.lat,
                longitude: el.start_location.lng
              });
              stepsArr.push({
                latitude: el.end_location.lat,
                longitude: el.end_location.lng
              })
              directionsArr.push(el.html_instructions);
              transitDetails.push(el.transit_details);
            } else if (el.travel_mode === 'WALKING'){
              directionsArr.push(el.html_instructions);
              el.steps.forEach(step => {
                stepsArr.push({
                  latitude: step.start_location.lat,
                  longitude: step.start_location.lng
                });
                stepsArr.push({
                  latitude: step.end_location.lat,
                  longitude: step.end_location.lng
                });
                if (step.html_instructions){
                  directionsArr.push(step.html_instructions);
                }
              });
            }
          });

          console.log(transitDetails);

          console.log(directionsArr);
          this.props.updatePolylineCoord(stepsArr);

        });

      } else if (this.state.destinationSelection == 'suggestion2'){

      }
    } // closes prevState & thisState


    // make call for suggestions
    if (prevState.destinationText != this.state.destinationText){
      // console.log('THIS IS THE CURRENT TEXT');
      // console.log(this.state.destinationText);
      // console.log('MAKING A FETCH');
      var qs = this.state.destinationText.split(' ').join('+');

      fetch(API_PLACES_ROOT + '&input=' + qs, {
        method: 'GET'
      }).then((response) => {
        var predictionsArr = JSON.parse(response._bodyInit).predictions;
        if (predictionsArr.length > 1){
          this.setState({
            destinationSuggestion1: predictionsArr[0].description,
            destinationSuggestion2: predictionsArr[1].description
          });
        }
      }).catch((err) => {
        console.log(err);
      });
    }

    // expand bar
    if (prevState.showPredictions != this.state.showPredictions){
      if (this.state.showPredictions === true){
        this.setState({
          noHeightBtn: 40
        });
        Animated.timing(
          this.state.componentHeight,
          {
            toValue: 200,
            duration: 500,
          }
        ).start();
        Animated.timing(
          this.state.noHeight,
          {
            toValue: 100,
            duration: 500,
          }
        ).start();

      }
      else {
        this.setState({
          noHeightBtn: 0
        });
        Animated.timing(
          this.state.componentHeight,
          {
            toValue: 100,
            duration: 500,
          }
        ).start();
        Animated.timing(
          this.state.noHeight,
          {
            toValue: 1,
            duration: 500,
          }
        ).start();
      }
    }

    if (prevState.showDirections != this.state.showDirections){
        if (this.state.showDirections === true){
          this.setState({
            inputHeight: 0,
            directionsHeight: 100,
            noHeightBtn: 0
          });
        }
    }
  }

  setOriginText(text){
    console.log('INSIDE SET ORIGIN TEXT');
    console.log(text);
    this.setState({
      destinationText: text
    });
  }

  animateBar(){
    console.log('ANIMATEBAR CONSOLE LOG');
    this.setState({
      showPredictions: true
    })
  }

  chooseAddress1(){
    console.log('CHOSE ADDRESS');
    this.setState({
      destinationSelection: "suggestion1",
      showPredictions: false,
      showDirections: true
      // showDirections
      // showInput
    });
  }

  chooseAddress2(){
    console.log('CHOSE ADDRESS');
    this.setState({
      destinationSelection: "suggestion2",
      showPredictions: false,
      showDirections: true
    });
  }

  render(){
    return(
      <Animated.View style={{
        flexDirection: 'column',
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: '100%',
        backgroundColor: '#fff',
        zIndex: 100,
        // paddingBottom: 15,
        borderRadius: 4,
        borderWidth: 0.5,
        borderColor: 'red',
        height: this.state.componentHeight}}>
        <View style={{
          height: this.state.directionsHeight,
          flexDirection: 'row',
          borderRadius: 4,
          borderWidth: 0.5,
          borderColor: 'green',
          justifyContent: 'center',
        }}>
        </View>
        <View style={{
          height: this.state.inputHeight,
          flexDirection: 'row',
          borderRadius: 4,
          borderWidth: 0.5,
          borderColor: 'green',
          justifyContent: 'center',
        }}>
          <View style={styles.directionImage}>
            <Image style={styles.markerImage} source={require('../images/direction_image.png')} />
          </View>
          <View style={styles.directionInput}>
            <TextInput style={styles.inputText} placeholder="Current Location" value={this.state.originSelectionAddress} />
            <TextInput style={styles.inputText} placeholder="Destination" onFocus={this.animateBar} onChangeText={this.setOriginText} />
          </View>
        </View>
        <Animated.View style={{
          borderRadius: 4,
          borderWidth: 0.5,
          borderColor: 'blue',
          justifyContent: 'center',
          height: this.state.noHeight}}>
            <TouchableOpacity onPress={this.chooseAddress1} style={{    borderWidth: 0.5,
                  borderColor: 'purple',
                  justifyContent: 'center',
                  height: this.state.noHeightBtn
              }}>
              <View>
                <Text>
                  {this.state.destinationSuggestion1}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.chooseAddress2} style={{    borderWidth: 0.5,
                  borderColor: 'purple',
                  justifyContent: 'center',
                  height: this.state.noHeightBtn
              }}>
              <View>
                <Text>
                  {this.state.destinationSuggestion2}
                </Text>
              </View>
            </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    )
  }
}

const styles = StyleSheet.create({
  // predictionsBar: {
  //   borderWidth: 0.5,
  //   borderColor: 'green',
  //   justifyContent: 'center',
  //   flex: 0.5,
  // },
  prediction: {
    height: 0,
    borderWidth: 0.5,
    borderColor: 'black',
    justifyContent: 'center',
  },
  markerImage: {
    height: 90,
    width: 22,
    margin: 5
  },
  directionBar: {
    // flex: 0.5,
    height: 100,
    flexDirection: 'row',
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: 'green',
    justifyContent: 'center',
  },
  directionImage: {
    marginTop: 5,
    // marginRight: 10,
    height: 100,
    width: 40,
    // borderRadius: 4,
    // borderWidth: 0.5,
    // borderColor: 'orange',
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
    width: 250,
    paddingLeft: 10,
  },
});
