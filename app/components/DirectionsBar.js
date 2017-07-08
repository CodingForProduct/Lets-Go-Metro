import React, { Component } from 'react';
import {
  View,
  TextInput,
  StyleSheet
} from 'react-native';

export default class DirectionsBar extends Component {
  render(){
    return(
      <View style={styles.directionBar}>
        <View style={styles.directionImage}>
        </View>
        <View style={styles.directionInput}>
          <TextInput style={styles.inputText} placeholder="Current Location" />
          <TextInput style={styles.inputText} placeholder="Destination" />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
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
});
