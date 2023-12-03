import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";

const DogIntroductionScreen = ({ navigation }) => {
  // Function to handle "Already Have a Dog" button press
  const handleHasDog = () => {
    navigation.navigate("RegisterDog");
  };

  // Function to handle "Will Get a Dog Later" button press
  const handleFutureDog = () => {
    // Perform actions for this choice
    // For now, this does nothing
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Do you already have a dog, or will you get one later?
      </Text>
      <Button title="Already Have a Dog" onPress={handleHasDog} />
      <Button title="Will Get a Dog Later" onPress={handleFutureDog} />
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
