import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ImageBackground, Image } from 'react-native';

const DogListItem = ({ name, breed, birthday, imageUri, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {imageUri ? (
        <Image   
          style={styles.dogImage}
          source={{ uri: `${process.env.EXPO_PUBLIC_DEV_URL}${imageUri}` }}
        />
      ) : (
        <ImageBackground   
          style={styles.dogImage}
          imageStyle={{ borderRadius: 90 }}
          source={require('../../../assets/doggo.jpg')}
        />
      )}
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
    position: 'absolute',
    left: 0,
    zIndex: 1,
  },
  textBox: {
    height: 80,
    width: '80%',
    borderRadius: 25,
    backgroundColor: '#ebf9f8',
    marginLeft: 70,
    zIndex: 0,
    justifyContent: 'center',
  },
  textStyle: {
    marginLeft: 70,
    marginBottom: 6,
    fontSize: 15,
  },
});

export default DogListItem;
