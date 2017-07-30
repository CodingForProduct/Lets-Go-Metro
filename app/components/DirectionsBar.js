import React, { Component } from 'react';
import helper from '../utils/directionsHelper';

import {
  View,
  ScrollView,
  TextInput,
  StyleSheet,
  Image,
  Animated,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  TouchableHighlight
} from 'react-native';
import { List, ListItem } from "react-native-elements";

const API_KEY = 'AIzaSyCdPnAPE-Kqy_VWKiFtX8Zm4b0T7wyyZ38',
  API_GEOCODE_ROOT = 'https://maps.googleapis.com/maps/api/geocode/json?key=' + API_KEY;

// Refactor: dont need originSelection or destinationSelection
export default class DirectionsBar extends Component {
  constructor(props){
    super(props);
    this.state = {
      currentPosition: {
        latitude: "",
        longitude: ""
      },
      originText: "",
      destinationText: "",
      suggestion1: "",
      suggestion2: "",
      originSuggestion1: "",
      originSuggestion2: "",
      destinationSuggestion1: "",
      destinationSuggestion2: "",
      originSelection: "",
      destinationSelection: "",
      showPredictions: false,
      showInput: true,
      showDirections: false,
      noHeight: new Animated.Value(0),
      noHeightBtn: new Animated.Value(0),
      componentHeight: new Animated.Value(100),
      directionsHeight: new Animated.Value(0),
      inputHeight: new Animated.Value(100),
      textBoxHeight: 40,
      directionsArr: [],
      inputFocus: '',
      triggerSearch: false,
      modalVisible: false,
      departureTimes: [],
      currentMilliseconds: new Date().getTime(),
      timeBeforeNotification: 300000
    }
    this.setOriginText = this.setOriginText.bind(this);
    this.setDestinationText = this.setDestinationText.bind(this);
    this.chooseAddress1 = this.chooseAddress1.bind(this);
    this.chooseAddress2 = this.chooseAddress2.bind(this);
    this.setA = this.setA.bind(this);
    this.setB = this.setB.bind(this);
    this.setModalVisible = this.setModalVisible.bind(this);
    this.resetDirections = this.resetDirections.bind(this);
    }

  resetDirections(){
    // this.props.setMarkers({
    //   // transitDetails: null,
    //   stepsArr: [],
    //   lastPt: {latitude: 0, longitude: 0}
    // });
    this.setState({
      destinationText: "",
      suggestion1: "",
      suggestion2: "",
      originSuggestion1: "",
      originSuggestion2: "",
      destinationSuggestion1: "",
      destinationSuggestion2: "",
      originSelection: "",
      destinationSelection: "",
      showPredictions: false,
      showInput: true,
      showDirections: false,
      directionsArr: [],
      departureTimes: [],
      modalVisible: false
    });
    this.props.updatePolylineCoord([{latitude: 0, longitude: 0}, {latitude: 0, longitude: 0}]);
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(position => {
      let endpt = API_GEOCODE_ROOT + '&latlng=' + position.coords.latitude + ',' + position.coords.longitude;
      fetch(endpt, {
        method: 'GET'
      }).then(response => {
        this.setState({
          originText: JSON.parse(response._bodyInit).results[0].formatted_address,
          originSelection: JSON.parse(response._bodyInit).results[0].formatted_address,
          currentPosition: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }
        });
      }).catch(err => {
        console.log(err);
      })
    })

    setInterval(function(){
      this.setState({
        currentMilliseconds: new Date().getTime()
      })
    }.bind(this), 60000)
  }

  componentDidUpdate(prevProps, prevState) {
    console.log(this.state.currentMilliseconds);
    // need to fix below later
    if ((prevState.destinationSelection != this.state.destinationSelection || prevState.originSelection != this.state.originSelection) && (this.state.originText && this.state.destinationSelection)){
      console.log('INSIDE GET ADDRESS IF');
      var destinationStr = this.state.destinationSelection == 'suggestion1' ? this.state.destinationSuggestion1 : this.state.destinationSuggestion2;
      var originStr = this.state.originSelection == 'suggestion1' ? this.state.originSuggestion1 : this.state.originSelection == 'suggestion2' ? this.state.originSuggestion2 : this.state.originText

      helper.getDirections(destinationStr, originStr)
      .then(objArrs => {
        console.log(objArrs);
        var departureTimes = [];
        for (let i = 0; i < objArrs.transitDetails.length; i++){
          departureTimes.push(objArrs.transitDetails[i].departure_time.text);
          departureTimes.push(objArrs.transitDetails[i].arrival_time.text);
        }

        // FOR DEMO ONLY: set departureTime to five minutes after current time string, in 'H:mmam' format
        // departureTimes = ['12:17pm'];

        this.setState({
          directionsArr: objArrs.directionsArr,
          showDirections: true,
          showPredictions: false,
          showInput: false,
          originText: '',
          destinationText: '',
          departureTimes: departureTimes
        });

        this.setModalVisible(true, departureTimes);

        this.props.updatePolylineCoord(objArrs.stepsArr);
        this.props.setMarkers(objArrs.transitDetails, objArrs.stepsArr, objArrs.stepsArr[objArrs.stepsArr.length - 1]);
      });
    }

    // make call for suggestions -- change data
    if (prevState.destinationText != this.state.destinationText){
      helper.getPredictions(this.state.destinationText).then(predictionsArr => {
        if (predictionsArr.length > 1){
          this.setState({
            destinationSuggestion1: predictionsArr[0].description,
            destinationSuggestion2: predictionsArr[1].description,
            suggestion1: predictionsArr[0].description,
            suggestion2: predictionsArr[1].description
          });
        }
      }).catch(err => {
        console.log(err);
      });
    }

    if (prevState.originText != this.state.originText){
      helper.getPredictions(this.state.originText).then(predictionsArr => {
        if (predictionsArr.length > 1){
          this.setState({
            originSuggestion1: predictionsArr[0].description,
            originSuggestion2: predictionsArr[1].description,
            suggestion1: predictionsArr[0].description,
            suggestion2: predictionsArr[1].description
          });
        }
      }).catch(err => {
        console.log(err);
      });
    }

    // expand bar -- change view
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

      } else {
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
            toValue: 0,
            duration: 500,
          }
        ).start();
      }
    }

    if (prevState.showDirections != this.state.showDirections){
      if (this.state.showDirections === true){
        this.setState({
          textBoxHeight: 0,
        });
        Animated.timing(
          this.state.inputHeight,
          {
            toValue: 0,
            duration: 500
          }
        ).start();
        Animated.timing(
          this.state.directionsHeight,
          {
            toValue: 100,
            duration: 500
          }
        ).start();
      } else {
          this.setState({
          textBoxHeight: 40,
        });
        Animated.timing(
          this.state.inputHeight,
          {
            toValue: 100,
            duration: 500
          }
        ).start();
        Animated.timing(
          this.state.directionsHeight,
          {
            toValue: 0,
            duration: 500
          }
        ).start();
      }
    }
  }

  setOriginText(text){
    console.log('INSIDE SET ORIGIN TEXT');
    this.setState({
      originText: text,
      showPredictions: true,
      showInput: true,
      showDirections: false
    });
  }

  setDestinationText(text){
    this.setState({
      destinationText: text,
      showPredictions: true,
      showInput: true,
      showDirections: false
    });
  }

  setA(){
    this.setState({
      inputFocus: 'origin'
    });
  }

  setB(){
    this.setState({
      inputFocus: 'destination'
    });
  }

  chooseAddress1(){
    if (this.state.inputFocus == 'origin'){
      this.setState({
        originSelection: "suggestion1",
        originText: this.state.originSuggestion1,
        showPredictions: false,
        showInput: true,
        triggerSearch: true
      });
      console.log(this.state.originText);
    } else if (this.state.inputFocus == 'destination'){
      this.setState({
        destinationSelection: "suggestion1",
        destinationText: this.state.destinationSuggestion1,
        showPredictions: false,
        showInput: true,
        triggerSearch: true
      });
    }
  }

  chooseAddress2(){
    if (this.state.inputFocus == 'origin'){
      this.setState({
        originSelection: "suggestion2",
        originText: this.state.originSuggestion2,
        showPredictions: false,
        showInput: true,
        triggerSearch: true
      });
    } else if (this.state.inputFocus == 'destination'){
      this.setState({
        destinationSelection: "suggestion2",
        destinationText: this.state.destinationSuggestion2,
        showPredictions: false,
        showInput: true,
        triggerSearch: true
      });
    }
  }

  setModalVisible(visible, departureTimes){

    let departureMs = departureTimes.map(time => {
      var timeArr = time.split(':');
      if (timeArr[1].includes('pm') && parseInt(timeArr[0]) != 12){
        timeArr[0] = parseInt(timeArr[0]) + 12;
      } else if (timeArr[1].includes('am') && parseInt(timeArr[0]) === 12){
        timeArr[0] = 0;
      } else {
        timeArr[0] = parseInt(timeArr[0]);
      }
      timeArr[1] = timeArr[1].replace(/[A-Za-z]/g, '');
      let rightNow = new Date();
      // later can change settings to make it more or less time before notification
      let differenceInTime = new Date(rightNow.getFullYear(), rightNow.getMonth(), rightNow.getDate(), timeArr[0], timeArr[1], 0).getTime() - this.state.currentMilliseconds;

      if (differenceInTime < 300000){
        return 3000;
      } else {
        return differenceInTime + this.state.timeBeforeNotification
      }
    });

    console.log(departureMs);

    for (let i = 0; i < departureMs.length; i++){
      setTimeout(() => {
        this.setState({modalVisible: true});
      }, departureMs[i]);
    }
  }

  render(){

    return(

      <Animated.View style={{
        flexDirection: 'column',
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: '100%',
        backgroundColor: 'rgb(42, 88, 189)',
        zIndex: 100,
        // paddingBottom: 15,
        borderRadius: 4,
        borderWidth: 0.5,
        borderColor: 'rgb(42, 88, 189)',
        height: this.state.componentHeight}}>

        <Animated.View style={{
         height: this.state.directionsHeight,
         flexDirection: 'column',
         borderRadius: 4,
         borderWidth: 0.5,

         justifyContent: 'center',
         backgroundColor: '#fff'
       }}>

       <ScrollView>
         <List containerStyle={{marginBottom: 10}}>
         {
           this.state.directionsArr.map((item, i) =>(
            <ListItem
            key ={i}
            title ={item.key}
            />
           ))
         }
         </List>
        </ScrollView>
        <TouchableOpacity style={{height: '30%', borderRadius: 1, borderWidth: 0.5, borderColor: 'black', backgroundColor: 'lightgray', justifyContent: 'center', flexDirection: 'row'}} onPress={this.resetDirections}>
          <Text>
            Cancel
          </Text>
        </TouchableOpacity>
       </Animated.View>

       <Animated.View style={{
         height: this.state.inputHeight,
         flexDirection: 'row',
         borderRadius: 4,
         borderWidth: 0.5,
         justifyContent: 'center',
       }}>
         <View style={styles.directionImage}>
           <Image style={styles.markerImage} source={require('../images/direction_image.png')} />
         </View>
         <View style={styles.directionInput}>
           <TextInput style={{
             height: this.state.textBoxHeight,
             borderRadius: 0,
             borderWidth: 0,
             backgroundColor: "rgba(255, 255, 255, 0.1)",
             width: 250,
             paddingLeft: 10,
             color: "rgba(255, 255, 255, 0.7)"
           }} placeholder="Current Location"
            placeholderTextColor ="rgba(255, 255, 255, 0.7)"
           value={this.state.originText}
           onFocus={this.setA}
           onChangeText={this.setOriginText}
           />
           <TextInput style={{
             height: this.state.textBoxHeight,
             borderRadius: 0,
             borderWidth: 0,
             backgroundColor: "rgba(255, 255, 255, 0.1)",
             width: 250,
             paddingLeft: 10,
             color: "rgba(255, 255, 255, 0.7)"
           }} placeholder="Destination"
           placeholderTextColor ="rgba(255, 255, 255, 0.7)"
           value={this.state.destinationText}
           onFocus={this.setB}
           onChangeText={this.setDestinationText}
           />
         </View>
       </Animated.View>
       <Animated.View style={{
         borderRadius: 0,
         borderWidth: 0,
         borderColor: 'blue',
         justifyContent: 'center',
         height: this.state.noHeight}}>
           <TouchableOpacity onPress={this.chooseAddress1} style={{borderWidth: 0,
              justifyContent: 'center',
              height: this.state.noHeightBtn
             }}>
             <View>
               <Text style={{color: "rgba(255, 255, 255, 0.7)"}}>
                 {this.state.suggestion1}
               </Text>
             </View>
           </TouchableOpacity>
           <TouchableOpacity onPress={this.chooseAddress2} style={{
               justifyContent: 'center',
               height: this.state.noHeightBtn
             }}>
             <View>
               <Text style={{color: "rgba(255, 255, 255, 0.7)"}}>
                 {this.state.suggestion2}
               </Text>
             </View>
           </TouchableOpacity>
       </Animated.View>


        <View style={{marginTop:40, height: '20%', paddingTop: 40}}>
          <Modal
          animationType={"slide"}
          transparent={true}
          visible={this.state.modalVisible}
          >
          <View style={{marginTop:40, paddingTop: 10, backgroundColor: 'white', height: '14%'}}>
            <View style={{flexDirection: 'column', alignItems: 'center', backgroundColor: 'white'}}>
              <Text>
                Heads up! Your bus will be arriving in {Math.floor(this.state.timeBeforeNotification / 60000)} minutes or less.
              </Text>
              <TouchableHighlight style={
                {backgroundColor:'#008800',
                  marginTop: 20,
                  width: '30%',
                  height: 24,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center'
                  }} onPress={()=>{ this.setState({modalVisible: false})}}>
                <Text style={{color: 'white'}}> OK
                </Text>
              </TouchableHighlight>
            </View>
            </View>
          </Modal>
        </View>
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
