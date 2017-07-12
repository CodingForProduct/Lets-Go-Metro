import React, { Component } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Image,
  Animated,
  Text
} from 'react-native';

// use Animated.event
// if not, use Animated.timing and state to activate it inside componentDidUpdate
const API_KEY = 'AIzaSyCdPnAPE-Kqy_VWKiFtX8Zm4b0T7wyyZ38';

const API_PLACES_ROOT = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?key=' + API_KEY + '&input=';

const API_GEOCODE_ROOT = 'https://maps.googleapis.com/maps/api/geocode/json?address=';

export default class DirectionsBar extends Component {
  constructor(props){
    super(props);
    this.state = {
      origin: {
        text: "",
        suggestion1: "",
        suggestion2: "",
        selection: ""
      },
      destination: {
        text: "",
        suggestion1: "",
        suggestion2: "",
        selection: ""
      },
      showPredictions: false,
      noHeight: new Animated.Value(0),
      someHeight: new Animated.Value(0.5)
    }
    this.setOriginText = this.setOriginText.bind(this);
    this.animateBar = this.animateBar.bind(this);
  }

  // componentDidMount(){
  //   console.log('THIS IS MOUNT');
  //   console.log(this.state.someHeight);
  // }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.origin.text != this.state.origin.text){
          console.log('THIS IS THE CURRENT TEXT');
          console.log(this.state.origin.text);
          var qs = this.state.origin.text.split(' ').join('+');

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
                origin: {
                  suggestion1: predictionsArr[0].description,
                  suggestion2: predictionsArr[1].description
                }
              });
            }

            // should only list first two predictions
            // predictions[0].description
          }).catch((err) => {
            console.log(err);
          });
    }
    if (prevState.showPredictions != this.state.showPredictions && this.state.showPredictions === true){
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
    }
  }

  setOriginText(text){
    console.log('INSIDE SET ORIGIN TEXT');
    console.log(text);
    this.setState({
      origin: {
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
            <TextInput style={styles.inputText} placeholder="Current Location" onChangeText={this.setOriginText} onFocus={this.animateBar} />
            <TextInput style={styles.inputText} placeholder="Destination" />
          </View>
        </View>
        <Animated.View style={{borderWidth: 0.5,
          borderColor: 'green',
          justifyContent: 'center',
          flex: this.state.noHeight}}>
          <View style={styles.prediction}>
            <Text>
              {this.state.origin.suggestion1}
            </Text>
          </View>
          <View style={styles.prediction}>
            <Text>
              {this.state.origin.suggestion2}
            </Text>
          </View>
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
