import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const Footer = ({ navigation }) => {
  const navigateToScreen = (screenName) => {
    navigation.navigate(screenName);
    // console.log("Navigate to:", screenName); // Replace with actual navigation
  };

  return (
    // onPress={() => navigation.navigate("Login")}
    <View style={styles.footer}>
      <TouchableOpacity onPress={() => navigateToScreen('Landing')}>
      <FontAwesome name="home" size={20} color="#000" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigateToScreen('Screen2')}>
      <FontAwesome name="calendar" size={20} color="#000" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigateToScreen('DogSelection')}>
      <FontAwesome name="paw" size={20} color="#000" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigateToScreen('Screen4')}>
      <FontAwesome name="heart" size={20} color="#000" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigateToScreen('Screen5')}>
      <FontAwesome name="exclamation-circle" size={20} color="#000" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 90,
    width: '100%',
    backgroundColor: '#508785',
  },
  // Add additional styles if needed
});

export default Footer;