import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from "react-native";
import getDogById from "../../api_calls/dog/getDogById";
import { partialUpdateDog } from "../../api_calls/dog/updateDogDetails";
import { SelectList } from 'react-native-dropdown-select-list';
import AsyncStorage from "@react-native-async-storage/async-storage";

const UpdateDogDetailsScreen = ({ route, navigation }) => {
  const { dogId } = route.params;
  const [selectedDog, setSelectedDog] = useState(null);
  const [dogInfo, setDogInfo] = useState({
    pedigree_name: { current: "", original: "" },
    breed: { current: "", original: "" },
    birthday: { current: "", original: "" },
    sex: { current: "", original: "" },
    color: { current: "", original: "" },
    id_number: { current: "", original: "" },
    registration_number: { current: "", original: "" },
    passport_number: { current: "", original: "" },
    insurance_company: { current: "", original: "" },
    insurance_number: { current: "", original: "" },
    feed: { current: "", original: "" },
    possible_feed_intolerance: { current: "", original: "" }
  });
  const [breeds, setBreeds] = useState([]);
  const [changedFields, setChangedFields] = useState([]);

  useEffect(() => {
    fetchSelectedDog();
    fetchBreeds();
  }, []);
  
  const fetchSelectedDog = async () => {
    try {
      const dogDetails = await getDogById(dogId);
      setSelectedDog(dogDetails);
      // Set initial values and original values for dogInfo
      setDogInfo(prevState => {
        return {
          ...prevState,
          pedigree_name: { current: dogDetails.pedigree_name, original: dogDetails.pedigree_name },
          breed: { current: dogDetails.breed, original: dogDetails.breed },
          birthday: { current: dogDetails.birthday, original: dogDetails.birthday },
          sex: { current: dogDetails.sex, original: dogDetails.sex },
          color: { current: dogDetails.color, original: dogDetails.color },
          id_number: { current: dogDetails.id_number, original: dogDetails.id_number },
          registration_number: { current: dogDetails.registration_number, original: dogDetails.registration_number },
          passport_number: { current: dogDetails.passport_number, original: dogDetails.passport_number },
          insurance_company: { current: dogDetails.insurance_company, original: dogDetails.insurance_company },
          insurance_number: { current: dogDetails.insurance_number, original: dogDetails.insurance_number },
          feed: { current: dogDetails.feed, original: dogDetails.feed },
          possible_feed_intolerance: { current: dogDetails.possible_feed_intolerance, original: dogDetails.possible_feed_intolerance }
        };
      });
    } catch (error) {
      console.error("Error fetching selected dog:", error);
    }
  };

  const fetchBreeds = async () => {
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
        setBreeds(
          data.breeds.map((breed) => ({ key: breed.id, value: breed.name }))
        );
      } else {
        console.error("Failed to fetch breeds", data);
      }
    } catch (error) {
      console.error("Error fetching breeds", error);
    }
  };

  const handleChange = (name, value) => {
    setDogInfo(prevState => {
      return {
        ...prevState,
        [name]: { current: value, original: prevState[name].original }
      };
    });
    // Add the field to changedFields array if it's not already there
    if (!changedFields.includes(name)) {
      setChangedFields(prevState => [...prevState, name]);
    }
  };

  const handleSubmit = async () => {
    console.log('inside handleSubmit: ', dogInfo);
    try {
      // Filter out unchanged fields from dogInfo
      const updatedDogInfo = Object.fromEntries(
        Object.entries(dogInfo)
          .filter(([key]) => changedFields.includes(key))
          .map(([key, value]) => [key, value.current])
      );
      console.log('updatedDogInfo:', updatedDogInfo);
      const success = await partialUpdateDog(dogId, updatedDogInfo);
      if (success) {
        navigation.goBack();
      } else {
        console.error("Failed to update dog information");
      }
    } catch (error) {
      console.error("Error updating dog information:", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.formLabel}>Stamtavlenamn:</Text>
        <TextInput
          style={styles.input}
          value={dogInfo.pedigree_name.current}
          onChangeText={(text) => handleChange("pedigree_name", text)}
        />
        <Text style={styles.formLabel}>Breed:</Text>
        <SelectList
          setSelected={(value) => handleChange("breed", value)}
          placeholder="Select Breed"
          data={breeds}
          defaultValue={dogInfo.breed.current}
          style={styles.input}
        />
        <Text style={styles.formLabel}>Birthday:</Text>
        <TextInput
          style={styles.input}
          value={dogInfo.birthday.current}
          onChangeText={(text) => handleChange("birthday", text)}
        />
        <Text style={styles.formLabel}>Sex:</Text>
        <TextInput
          style={styles.input}
          value={dogInfo.sex.current}
          onChangeText={(text) => handleChange("sex", text)}
        />
        <Text style={styles.formLabel}>Color:</Text>
        <TextInput
          style={styles.input}
          value={dogInfo.color.current}
          onChangeText={(text) => handleChange("color", text)}
        />
        <Text style={styles.formLabel}>ID Number:</Text>
        <TextInput
          style={styles.input}
          value={dogInfo.id_number.current}
          onChangeText={(text) => handleChange("id_number", text)}
        />
        <Text style={styles.formLabel}>Registration Number:</Text>
        <TextInput
          style={styles.input}
          value={dogInfo.registration_number.current}
          onChangeText={(text) => handleChange("registration_number", text)}
        />
        <Text style={styles.formLabel}>Passport Number:</Text>
        <TextInput
          style={styles.input}
          value={dogInfo.passport_number.current}
          onChangeText={(text) => handleChange("passport_number", text)}
        />
        <Text style={styles.formLabel}>Insurance Company:</Text>
        <TextInput
          style={styles.input}
          value={dogInfo.insurance_company.current}
          onChangeText={(text) => handleChange("insurance_company", text)}
        />
        <Text style={styles.formLabel}>Insurance Number:</Text>
        <TextInput
          style={styles.input}
          value={dogInfo.insurance_number.current}
          onChangeText={(text) => handleChange("insurance_number", text)}
        />
        <Text style={styles.formLabel}>Feed:</Text>
        <TextInput
          style={styles.input}
          value={dogInfo.feed.current}
          onChangeText={(text) => handleChange("feed", text)}
        />
        <Text style={styles.formLabel}>Possible Feed Intolerance:</Text>
        <TextInput
          style={styles.input}
          value={dogInfo.possible_feed_intolerance.current}
          onChangeText={(text) => handleChange("possible_feed_intolerance", text)}
        />
      </View>
      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
      >
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#92cdca",
    padding: 20,
  },
  formContainer: {
    marginTop: 100,
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 18,
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: "#007bff",
    padding: 15,
    alignItems: "center",
    borderRadius: 5,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
  },
});

export default UpdateDogDetailsScreen;
