import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Button, Text } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SelectList } from "react-native-dropdown-select-list";

/**********************************************************************************/
const RegisterDogScreen = ({ navigation }) => {
  // State for form fields
  const [name, setName] = useState("");
  const [selectedBreed, setSelectedBreed] = useState(null); // State for selected breed
  const [birthday, setBirthday] = useState(new Date());
  const [selectedSex, setSelectedSex] = useState(""); // State for selected sex

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: "Apple", value: "apple" },
    { label: "Banana", value: "banana" },
  ]);
  /**********************************************************************************/
  // NEW TRY AT DROPDOWN
  const data = [
    { key: "1", value: "Hane" },
    { key: "2", value: "Tik" },
  ];

  /**********************************************************************************/
  const handleCreateDog = async () => {
    // Ensure all fields are filled
    if (!name || !selectedBreed || !birthday || !selectedSex) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("userToken");
      const formattedDate = `${birthday.getFullYear()}-${
        birthday.getMonth() + 1
      }-${birthday.getDate()}`;

      const response = await fetch("http://localhost:8000/api/dog/add/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${token}`,
        },
        body: JSON.stringify({
          name: name,
          breed: selectedBreed, // Use the selected breed's ID
          birthday: formattedDate, // Format date to YYYY-MM-DD
          sex: selectedSex === "Hane" ? 1 : 2, // Convert to integer value if required
        }),
      });

      if (response.ok) {
        // Handle successful dog registration
        const jsonResponse = await response.json();
        const newDogId = jsonResponse.dog_id;
        await AsyncStorage.setItem("selectedDogId", newDogId.toString()); // Store the new dog's ID
        navigation.navigate("Landing");
      } else {
        // Handle error in dog registration
        const errorData = await response.json();
        Alert.alert("Error", errorData.message || "Failed to create dog");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An error occurred while creating the dog");
    }
  };
  /**********************************************************************************/

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || birthday;
    setShowDatePicker(Platform.OS === "ios");
    setBirthday(currentDate);
  };
  /**********************************************************************************/
  const [breedData, setBreedData] = useState([]);

  const fetchBreeds = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch("http://localhost:8000/api/dog/breeds/", {
        method: "GET",
        headers: {
          Authorization: `JWT ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setBreedData(
          data.breeds.map((breed) => ({ key: breed.id, value: breed.name }))
        );
      } else {
        // Handle errors
        console.error("Failed to fetch breeds", data);
      }
    } catch (error) {
      console.error("Error fetching breeds", error);
    }
  }, []);

  useEffect(() => {
    fetchBreeds();
  }, [fetchBreeds]);
/**********************************************************************************/
  const navigateToDogSelection = () => {
    navigation.navigate('DogSelection');
};
/**********************************************************************************/

  return (
    <View style={styles.container}>
    <ScrollView style={styles.scrollView}>
        <View style={styles.headerSection}>
          <Text variant="headlineLarge" style={styles.header}>
            Petology
          </Text>
          <View style={styles.closeButtonContainer}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={navigateToDogSelection}
            >
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section2}>
          <Text variant="headlineMedium" style={styles.headerSmall}>
            Skapa hund
          </Text>
          <TextInput
            style={styles.FormInput}
            placeholder="Namn"
            placeholderTextColor={"black"}
            onChangeText={setName}
          />
          <View style={styles.dropdownContainer}>
            <SelectList
              setSelected={setSelectedBreed}
              placeholder="Ras"
              data={breedData}
              save="value"
              boxStyles={{
                borderRadius: 90,
                backgroundColor: "#e8f5f5",
                marginBottom: 18,
                width: "100%",
              }}
            />
          </View>
          <View style={styles.dropdownContainer}>
            <SelectList
              setSelected={setSelectedSex}
              placeholder="Kön"
              data={data}
              save="value"
              boxStyles={{
                borderRadius: 90,
                backgroundColor: "#e8f5f5",
                marginBottom: 18,
              }}
            />
          </View>
          {/* TODO: fix birthday, hardcoded for now.
          Also needs a better field for handling this instead of
          pure text. */}
          <TextInput
            style={styles.FormInput}
            placeholder="Födelsedatum: YYYYMMDD"
            placeholderTextColor={"black"}
          />
          
          <View style={styles.submitSection}>
            <Button
              mode="contained"
              onPress={handleCreateDog}
              style={{ width: "80%", height: "30%" }}
              buttonColor="#4a8483"
            > Skapa hund </Button>
          </View>
        </View>  
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
/**********************************************************************************/
container: {
  flex: 1,
  paddingTop: 40,
  backgroundColor: "#92cdca",
},
scrollView: {},
/**********************************************************************************/
headerSection: {
  flex: 1,
  alignItems: "center",
  height: 80,
  padding: 20,
},
headerText: {
  fontSize: 36,
  fontFamily: "Cochin",
  opacity: 0.7,
},
/**********************************************************************************/
  section2: {
    height: 400,
    alignItems: "center",
    paddingTop: 10,
  },
  header: {
    fontFamily: "Cochin",
  },
  headerSmall: {
    fontFamily: "Cochin",
    marginBottom: 15,
  },
  FormInput: {
    width: "80%",
    height: "12%",
    backgroundColor: "#e8f5f5",
    borderColor: "grey",
    borderWidth: 1,
    borderRadius: 90,
    marginBottom: 18,
    textAlign: "center",
  },
  dropdownContainer: {
    width: "80%",
  },
  submitSection: {
    height: 150,
    width: '75%',

    alignItems: "center",
  },
  closeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 30,
},
closeButtonText: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
},
closeButtonContainer: {
  position: 'absolute',
  // backgroundColor: 'gold',
  top: 28,
  left: 320,
},
});

export default RegisterDogScreen;
