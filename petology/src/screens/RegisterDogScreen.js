import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Button } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
// import { Picker } from "@react-native-picker/picker"; Fix this for hane/tik
import AsyncStorage from "@react-native-async-storage/async-storage";

const RegisterDogScreen = () => {
  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [birthday, setBirthday] = useState(new Date());
  const [sex, setSex] = useState("Hane");
  const [showDatePicker, setShowDatePicker] = useState(false);
  /**************************************************************/

  const handleCreateDog = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch("http://localhost:8000/api/dog/add/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${token}`, // Adjust based on your token format
        },
        body: JSON.stringify({
          name: name,
          breed: breed,
          birthday: birthday.toISOString().split("T")[0], // Format date to YYYY-MM-DD
          sex: sex,
        }),
      });

      if (response.ok) {
        // Handle successful dog registration
        Alert.alert("Success", "Dog created successfully");
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
  /**************************************************************/

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || birthday;
    setShowDatePicker(Platform.OS === "ios");
    setBirthday(currentDate);
  };
  /**************************************************************/

  return (
    <View style={styles.container}>
      <Text>Petology</Text>
      <TextInput placeholder="Fido" value={name} onChangeText={setName} />
      <TextInput placeholder="Labrador" value={breed} onChangeText={setBreed} />
      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        <Text>{birthday.toLocaleDateString()}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={birthday}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}
      <TextInput placeholder="Tik" value={sex} onChangeText={setSex} />
      {/* TODO: turn into ENUM, 1 = hane, 2 = tik */}
      <Button onPress={handleCreateDog}>Lägg till hund</Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});

export default RegisterDogScreen;
