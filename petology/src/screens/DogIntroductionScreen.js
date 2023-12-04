import React from "react";
import { View, StyleSheet } from "react-native";
import { Button, Text } from "react-native-paper";

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
      <View style={styles.headerBox}>
        <View style={styles.headerContainer}>
          <Text variant="headlineLarge" style={styles.header}>
            Petology
          </Text>
        </View>
      </View>
      <View style={styles.textBox}>
        <Text variant="headlineSmall" style={styles.textLarge}>
          Hundägare
        </Text>
        <Text style={styles.textSmall}>Har du en hund i nuläget eller</Text>
        <Text style={styles.textSmall}>ska du skaffa en hund?</Text>
      </View>
      <View style={styles.buttonBox}>
        <Button
          mode="contained"
          onPress={handleHasDog}
          style={{ width: "44%" }}
          buttonColor="#4a8483"
        >
          Har en hund
        </Button>
        <Button
          mode="contained"
          onPress={() => console.log("Pressed")}
          style={{ width: "44%" }}
          buttonColor="#4a8483"
        >
          Ska skaffa hund
        </Button>
      </View>
      <View style={styles.boxThree}></View>

      {/* <Button title="Already Have a Dog" onPress={handleHasDog} />
      <Button title="Will Get a Dog Later" onPress={handleFutureDog} /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#92cdca",
    flex: 1, // makes the container take up the full screen?
    // flexDirection: "row", // default column
    justifyContent: "space-around", // default flex-start
    // alignItems: "flex-end", // controls cross-axis, aka the one not being controlled by justfiyContent
    paddingTop: 40,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  headerBox: {
    flex: 1,
    backgroundColor: "#92cdca",
    // alignItems: "center",
    padding: 10,
  },
  header: {
    fontFamily: "Cochin",
  },
  headerContainer: {
    alignItems: "center",
    paddingTop: 20,
  },
  textBox: {
    flex: 1,
    // backgroundColor: "#92cdca",
    // backgroundColor: "green",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  textSmall: {
    fontSize: 16,
    fontWeight: "300",
  },
  buttonBox: {
    flex: 1,
    flexDirection: "row", // Set flexDirection to row to align items horizontally
    justifyContent: "space-evenly", // This will distribute space evenly around the buttons
    alignItems: "center", // Align items vertically in the center
    // backgroundColor: "red",
    paddingHorizontal: 10, // Add horizontal padding for spacing from the screen edges
  },
  // buttonStyle: {
  //   width: 80,
  //   height: 80,
  // },
  boxThree: {
    flex: 1,
    // backgroundColor: "blue",
  },
  // Add additional styles here
});

export default DogIntroductionScreen;
