import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";

const LandingPage = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to the App!</Text>
      {/* Add more features or navigation options here */}
      <Button
        title="Log Out"
        onPress={() => navigation.navigate("Login")} // Navigate back to Login on logout
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  text: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default LandingPage;
