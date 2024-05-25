import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ImageBackground } from 'react-native';

import DogImage from '../../../assets/doggo.jpg';

const DogListItem = ({ name, breed, birthday, onPress }) => {
    const navigateToScreen = (screenName) => {
      navigation.navigate(screenName);
    };
  
    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
          <ImageBackground   
              style={styles.dogImage}
              imageStyle={{ borderRadius: 90 }}
              source={DogImage}
          />
          <View style={styles.textBox}> 
              <Text style={styles.textStyle}>{name}</Text>
              <Text style={styles.textStyle}>{breed}</Text>
              <Text style={styles.textStyle}>{birthday}</Text>
          </View>
      </TouchableOpacity>
    );
  };
  

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        height: 120,
        width: '90%',
        alignItems: 'center',
        marginBottom: 25,
    },
    dogImage: {
        height: 120,
        width: 120,
        backgroundColor: 'red',
        borderRadius: 90,
        position: 'absolute', // add this
        left: 0, // adjust as needed
        zIndex: 1, // add this
      },
      textBox: {
        height: 80,
        width: '80%',
        borderRadius: 25,
        backgroundColor: '#ebf9f8',
        marginLeft: 70, // adjust as needed
        zIndex: 0, // add this
        justifyContent: 'center',
      },
      textStyle: {
        marginLeft: 70,
        marginBottom: 6,
        fontSize: 15,

      },
});

export default DogListItem;
