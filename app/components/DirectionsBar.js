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
      noHeight: new Animated.Value(0),
      someHeight: new Animated.Value(0.5),
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

          legs.forEach(el => {
            stepsArr.push({
              latitude: el.start_location.lat,
              longitude: el.start_location.lng
            });
            stepsArr.push({
              latitude: el.end_location.lat,
              longitude: el.end_location.lng
            })
          });

          // console.log('THIS IS STEPS ARR');
          // console.log(stepsArr);
          this.props.updatePolylineCoord(stepsArr);
          // let polylineEncoded = responseData.routes[0].overview_polyline;
          // let polylineDecoded = decodePolyline(''+polylineEncoded);

          // console.log('THIS IS THE POLYLINE DECODED');
          // console.log(decodePolyline(''+polylineEncoded));

          // steps.forEach(el => {
          //   if (!el.transit_details || el.travel_mode != 'TRANSIT'){
          //     // it\'s walking
          //   }

          //   // TRANSIT steps have the property transit_details, the travel_mode = 'TRANSIT', there is no steps prop

          //   // walking STEPs have WALKING and have steps arr
          // });

        });

      } else if (this.state.destinationSelection == 'suggestion2'){

      }
    } // closes prevState & thisState

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

    if (prevState.showPredictions != this.state.showPredictions){
      if (this.state.showPredictions === true){
        Animated.timing(
          this.state.someHeight,
          {
            toValue: 1.5,
            duration: 800,
          }
        ).start();
        Animated.timing(
          this.state.noHeight,
          {
            toValue: 0.5,
            duration: 1,
          }
        ).start();
      } else {
        Animated.timing(
          this.state.someHeight,
          {
            toValue: 0.5,
            duration: 800,
          }
        ).start();
        Animated.timing(
          this.state.noHeight,
          {
            toValue: 0,
            duration: 1,
          }
        ).start();
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
      destinationSelection: "suggestion1"
    });
  }

  chooseAddress2(){
    console.log('CHOSE ADDRESS');
    this.setState({
      destinationSelection: "suggestion2"
    });
  }

  // <View style={{flexDirection: 'column', flex: 1.5}}>

  // <View style={{borderWidth: 0.5,
  //   borderColor: 'green',
  //   justifyContent: 'center',
  //   flex: 0.5}}>
  // </View>

  render(){
    // let { someHeight } = this.state.someHeight;
    // let { noHeight } = this.state.noHeight;
    // console.log('RENDERING AGAIN');

    return(
      <Animated.View style={{flexDirection: 'column', flex: this.state.someHeight}}>
        <View style={styles.directionBar}>
          <View style={styles.directionImage}>
            <Image style={styles.markerImage} source={require('../images/direction_image.png')} />
          </View>
          <View style={styles.directionInput}>
            <TextInput style={styles.inputText} placeholder="Current Location" value={this.state.originSelectionAddress} />
            <TextInput style={styles.inputText} placeholder="Destination" onFocus={this.animateBar} onChangeText={this.setOriginText} />
          </View>
        </View>
        <Animated.View style={{borderWidth: 0.5,
          borderColor: 'green',
          justifyContent: 'center',
          flex: this.state.noHeight}}>
            <TouchableOpacity onPress={this.chooseAddress1} style={styles.prediction}>
              <View>
                <Text>
                  {this.state.destinationSuggestion1}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.chooseAddress2} style={styles.prediction}>
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
  predictionsBar: {
    borderWidth: 0.5,
    borderColor: 'green',
    justifyContent: 'center',
    flex: 0.5,
  },
  prediction: {
    flex: 0.5,
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
    flex: 0.5,
    flexDirection: 'row',
    borderRadius: 4,
    // borderWidth: 0.5,
    // borderColor: 'green',
    // justifyContent: 'center',
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
