import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Footer from '../../components/common/Footer';



const AboutUsScreen = ({ navigation }) => {
  const navigateToScreen = (screenName) => {
    navigation.navigate(screenName);
  };

  return (
    <View style={styles.container}>
      <Text>Here you can find information about us.</Text>
      <TouchableOpacity onPress={() => navigateToScreen('AboutUsScreen')}>
        <Text>About Us</Text>
      </TouchableOpacity>
      <Footer navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AboutUsScreen;