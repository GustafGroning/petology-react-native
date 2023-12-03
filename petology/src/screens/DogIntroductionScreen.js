import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";

const DogIntroductionScreen = ({ navigation }) => {
  // Function to handle "Already Have a Dog" button press
  const handleAlreadyHaveDog = () => {
    // Navigate to the next screen or perform an action
    // navigation.navigate('NextScreenName');
  };

  // Function to handle "Will Get a Dog Later" button press
  const handleWillGetDogLater = () => {
    // Perform actions for this choice
    // For now, this does nothing
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Do you already have a dog, or will you get one later?
      </Text>
      <Button title="Already Have a Dog" onPress={handleAlreadyHaveDog} />
      <Button title="Will Get a Dog Later" onPress={handleWillGetDogLater} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  // Add additional styles here
});

export default DogIntroductionScreen;
