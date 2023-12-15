import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LandingPage = ({ navigation }) => {
  const [selectedDogName, setSelectedDogName] = useState(null);

  useEffect(() => {
    // checkProtectedEndpoint();
    fetchSelectedDogDetails();
  }, []);

  const fetchSelectedDogDetails = async () => {
    try {
      const dogId = await AsyncStorage.getItem("selectedDogId");
      const token = await AsyncStorage.getItem("userToken");

      if (dogId && token) {
        const response = await fetch(
          `http://localhost:8000/api/dog/get/${dogId}/`,
          {
            method: "GET",
            headers: {
              Authorization: `JWT ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setSelectedDogName(data.name); // Assuming the API returns an object with a 'name' field
        }
      }
    } catch (error) {
      console.error("Error fetching dog details:", error);
    }
  };

  // ... rest of your code

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to the App!</Text>
      {selectedDogName && (
        <Text style={styles.dogText}>Selected Dog: {selectedDogName}</Text>
      )}
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
  dogText: {
    fontSize: 18,
    color: "gray",
    marginBottom: 20,
  },
});

export default LandingPage;
