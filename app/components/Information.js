import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image
} from 'react-native';

export default class Information extends Component {
  render(){
    return (
      <View style={styles.information}>
        <View style={styles.informationImage}>
          <Image style={styles.driverImage} source={require('../images/driver.png')} />
        </View>
        <View style={styles.informationText}>
          <Text>
            Hi, I'm Metro Driver. I will help you get where you need to go. Tap me whenever you want to set the directions.
          </Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  driverImage: {
    width: 70,
    height: 74
  },
  information: {
    // ...StyleSheet.absoluteFillObject,
    // flex: 0.5,
    // height: 180,
    flexDirection: 'row',
    // justifyContent: 'center',
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: 'red',
    position: 'absolute',
    left: 0,
    top: 0,
    height: 130,
    width: '100%',
    backgroundColor: '#fff',
    zIndex: 100,
    //top padding to account for the iphone status bar
    paddingTop: 15
  },
  informationImage: {
    width: 80,
    height: 80,
    marginTop: 30,
    // borderRadius: 4,
    // borderWidth: 0.5,
    // borderColor: 'purple',
  },
  informationText: {
    width: 250,
    height: 80,
    marginTop: 30,
    padding: 15,
    // borderRadius: 4,
    // borderWidth: 0.5,
    // borderColor: 'orange',
  },
});
