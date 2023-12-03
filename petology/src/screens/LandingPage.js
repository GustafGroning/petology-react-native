import React, { useEffect } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LandingPage = ({ navigation }) => {
  useEffect(() => {
    checkProtectedEndpoint();
  }, []);

  const checkProtectedEndpoint = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      console.log("Retrieved token from AsyncStorage:", token); // Log the retrieved token

      if (token) {
        console.log("Sending request to protected endpoint with token:", token);
        const response = await fetch(
          "http://localhost:8000/api/users/protected/",
          {
            method: "GET",
            headers: {
              Authorization: `JWT ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Response status:", response.status); // Log the response status

        const data = await response.json();
        console.log("Response data:", data); // Log the response data

        if (response.ok) {
          console.log("Protected data:", data);
        } else {
          console.log("Error accessing protected data:", data);
        }
      } else {
        console.log("No token found in AsyncStorage");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to the App!</Text>
      <Button title="Log Out" onPress={() => navigation.navigate("Login")} />
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
