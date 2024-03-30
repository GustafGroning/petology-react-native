import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DogMainScreen = () => {
  const [selectedDog, setSelectedDog] = useState(null);

  useEffect(() => {
    fetchSelectedDog();
  }, []);

  const fetchSelectedDog = async () => {
    try {
      const selectedDogId = await AsyncStorage.getItem("selectedDogId");
      // Fetch the dog details using the selectedDogId
      // Replace the following line with your logic to fetch dog details
      const dogDetails = { id: selectedDogId, name: "Max", breed: "Labrador", age: "5 years" };
      setSelectedDog(dogDetails);
    } catch (error) {
      console.error("Error fetching selected dog:", error);
    }
  };

  return (
    <View style={styles.container}>
      {selectedDog ? (
        <View style={styles.dogInfoContainer}>
          <Text style={styles.dogInfoText}>Dog Name: {selectedDog.name}</Text>
          <Text style={styles.dogInfoText}>Breed: {selectedDog.breed}</Text>
          <Text style={styles.dogInfoText}>Age: {selectedDog.age}</Text>
          {/* Add more dog info here as needed */}
        </View>
      ) : (
        <Text>Loading dog info...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#92cdca",
  },
  dogInfoContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
  },
  dogInfoText: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default DogMainScreen;
