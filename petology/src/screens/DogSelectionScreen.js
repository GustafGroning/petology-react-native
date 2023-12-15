import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DogSelectionScreen = ({ navigation }) => {
  const [dogs, setDogs] = useState([]);

  useEffect(() => {
    fetchDogs();
  }, []);

  const fetchDogs = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch("http://localhost:8000/api/dog/all/", {
        method: "GET",
        headers: {
          Authorization: `JWT ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setDogs(data.dogs);
      } else {
        console.error("Failed to fetch dogs");
      }
    } catch (error) {
      console.error("Error fetching dogs", error);
    }
  };

  const handleSelectDog = async (dogId) => {
    await AsyncStorage.setItem("selectedDogId", dogId.toString());
    navigation.navigate("Landing", { dogId: dogId });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Your Dog</Text>
      <FlatList
        data={dogs}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => handleSelectDog(item.id)}
          >
            <Text style={styles.itemText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  listItem: {
    padding: 15,
    backgroundColor: "#f8f8f8",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  itemText: {
    fontSize: 18,
  },
});

export default DogSelectionScreen;
