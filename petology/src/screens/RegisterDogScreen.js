import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Button, Text } from "react-native-paper";
// import { Picker } from "@react-native-picker/picker"; Fix this for hane/tik
import AsyncStorage from "@react-native-async-storage/async-storage";
import DropDownPicker from 'react-native-dropdown-picker';


const RegisterDogScreen = () => {
  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [birthday, setBirthday] = useState(new Date());
  const [sex, setSex] = useState("Hane");
  const [showDatePicker, setShowDatePicker] = useState(false);



  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    {label: 'Apple', value: 'apple'},
    {label: 'Banana', value: 'banana'}
  ]);
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

  // return (
    // <View style={styles.container}>
    //   <Text>Petology</Text>
    //   <TextInput placeholder="Fido" value={name} onChangeText={setName} />
    //   <TextInput placeholder="Labrador" value={breed} onChangeText={setBreed} />
    //   <TouchableOpacity onPress={() => setShowDatePicker(true)}>
    //     <Text>{birthday.toLocaleDateString()}</Text>
    //   </TouchableOpacity>
    //   {showDatePicker && (
    //     <DateTimePicker
    //       value={birthday}
    //       mode="date"
    //       display="default"
    //       onChange={onDateChange}
    //     />
    //   )}
    //   <TextInput placeholder="Tik" value={sex} onChangeText={setSex} />
    //   {/* TODO: turn into ENUM, 1 = hane, 2 = tik */}
    //   <Button onPress={handleCreateDog}>Lägg till hund</Button>
    // </View>

  // );
  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <View style={styles.section1}> 
        <Text variant="headlineLarge" style={styles.header}>
            Petology
          </Text>
        </View> 
        <View style={styles.section2}> 
        <Text variant="headlineMedium" style={styles.headerSmall}>
            Skapa hund
        </Text>
        <TextInput style={styles.FormInput} placeholder="Namn" placeholderTextColor={'black'}/>
        <DropDownPicker
      open={open}
      value={value}
      items={items}
      setOpen={setOpen}
      setValue={setValue}
      setItems={setItems}
    />
        <TextInput style={styles.FormInput} placeholder="Namn" placeholderTextColor={'black'}/>
        <TextInput style={styles.FormInput} placeholder="Namn" placeholderTextColor={'black'}/>
        </View>
        <View style={styles.section} />
        <View style={styles.section} />
        {/* Add more sections as needed */}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#92cdca",
  },
  container: {
    // flex: 1,
  },
  section1: {
    height: 150,
    borderWidth: 1,
    borderColor: 'black', 
    alignItems: "center",
    paddingTop: 20,
  },
  section2: {
    height: 400,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black',
    paddingTop: 10,
  },
  section: {
    height: 300,
    borderWidth: 1,
    borderColor: 'black',
  },
  header: {
    fontFamily: "Cochin",
  },
  headerSmall: {
    fontFamily: "Cochin",
    marginBottom: 15,
  },
  formButtons: {
    width: '80%',
    backgroundColor: '#e8f5f5',
    borderColor: 'black',  
    marginBottom: 10,
  },
  FormInput: {
    width: '80%',
    height: '10%',
    backgroundColor: '#e8f5f5',
    borderColor: 'grey',  
    borderWidth: 1,
    borderRadius: 90,
    marginBottom: 10,
    textAlign: 'center',
  }
  
});

export default RegisterDogScreen;
