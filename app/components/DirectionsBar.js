import React, { Component } from 'react';
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
const API_KEY = 'AIzaSyCdPnAPE-Kqy_VWKiFtX8Zm4b0T7wyyZ38';

const API_PLACES_ROOT = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?key=' + API_KEY + '&input=';

const API_GEOCODE_ROOT = 'https://maps.googleapis.com/maps/api/geocode/json?key=' + API_KEY + '&latlng=';



export default class DirectionsBar extends Component {
  constructor(props){
    super(props);
    this.state = {
      origin: {
        text: "",
        suggestion1: "",
        suggestion2: "",
        selection: "",
        selectionAddress: "",
        selectionCoord : {
          latitude: "",
          longitude: ""
        }
      },
      destination: {
        text: "",
        suggestion1: "",
        suggestion2: "",
        selection: "",
        selectionAddress: "",
        selectionCoord : {
          latitude: "",
          longitude: ""
        }
      },
      showPredictions: false,
      noHeight: new Animated.Value(0),
      someHeight: new Animated.Value(0.5)
    }
    this.setOriginText = this.setOriginText.bind(this);
    this.animateBar = this.animateBar.bind(this);
    this.chooseAddress1 = this.chooseAddress1.bind(this);
    this.chooseAddress2 = this.chooseAddress2.bind(this);
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(position => {
      let endpt = API_GEOCODE_ROOT + position.coords.latitude + ',' + position.coords.longitude;
      console.log('THIS IS THE ENDPT');
      console.log(endpt);
      fetch(endpt, {
        method: 'GET'
      }).then(response => {
        console.log('THIS IS THE RESPONSE');
        // console.log(response);
        console.log(JSON.parse(response._bodyInit).results[0].formatted_address);
        this.setState({
          origin: {
            selectionAddress: JSON.parse(response._bodyInit).results[0].formatted_address,
            selectionCoord: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            }
          }
        });
      }).catch(err => {
        console.log(err);
      })
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.destination.selection != this.state.destination.selection){
      console.log('THIS IS ORIGIN AND DESTINATION');
      console.log(this.state.origin);
      console.log(this.state.destination);

      if (this.state.origin.selectionAddress && this.state.destination.selection){


        if (this.state.destination.selection == 'suggestion1'){
          console.log('THIS IS THE FIRST SUGGESTION');
          console.log(this.state.destination.suggestion1);
        // TODO: make call to directions api w/ this.state.origin.selectionAddress & this.state.destination.suggestion1

        } else if (this.state.destination.selection == 'suggestion2'){
          console.log('THIS IS THE SECOND SUGGESTION');
          console.log(this.state.destination.suggestion2);
        }
      } // closes checking for valid values
    } // closes prevState & thisState
    if (prevState.destination.text != this.state.destination.text){
      console.log('THIS IS THE CURRENT TEXT');
      console.log(this.state.destination.text);
      if (this.state.destination.text && !this.state.destination.selection){
        console.log('MAKING A FETCH');
        var qs = this.state.destination.text.split(' ').join('+');

        console.log('THIS IS THE ENDPT');
        console.log(API_PLACES_ROOT + qs);
        fetch(API_PLACES_ROOT + qs, {
          method: 'GET'
        }).then((response) => {
          var predictionsArr = JSON.parse(response._bodyInit).predictions;
          console.log('this is length');
          console.log(predictionsArr.length);

          if (predictionsArr.length > 1){
            this.setState({
              destination: {
                suggestion1: predictionsArr[0].description,
                suggestion2: predictionsArr[1].description
              }
            });
          }
        }).catch((err) => {
          console.log(err);
        });
      }
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
      destination: {
        text: text
      }
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
      destination: {
        suggestion1: this.state.destination.suggestion1,
        suggestion2: this.state.destination.suggestion2,
        selection: "suggestion1"
      }
    })
  }

  chooseAddress2(){
    console.log('CHOSE ADDRESS');
    this.setState({
      destination: {
        suggestion1: this.state.destination.suggestion1,
        suggestion1: this.state.destination.suggestion1,
        selection: "suggestion2"
      }
    })
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
            <TextInput style={styles.inputText} placeholder="Current Location" value={this.state.origin.selectionAddress} />
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
                  {this.state.destination.suggestion1}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.chooseAddress2} style={styles.prediction}>
              <View>
                <Text>
                  {this.state.destination.suggestion2}
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
