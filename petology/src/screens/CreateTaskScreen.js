import { Alert } from "react-native";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button } from "react-native-paper";
import PetologyDatePicker from "../components/common/input/PetologyDatePicker";

import { SelectList } from "react-native-dropdown-select-list";

import { Animated } from "react-native";

const CreateTaskScreen = ({ navigation }) => {
  /**********************************************************************************/
  // SelectList handlers
  const [dogList, setDogList] = useState([]);

  /**********************************************************************************/
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);

  // Chosen dog, ID will be used for task
  const [dog, setDog] = useState("");

  const [taskName, setTaskName] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [reminder, setReminder] = useState("");
  const [notes, setNotes] = useState("");

  /**********************************************************************************/
  const [startDate, setStartDate] = useState(new Date());

  /**********************************************************************************/
  const navigateToCalendar = () => {
    navigation.navigate("Calendar");
  };
  /**********************************************************************************/
  const handleDateTimeChange = (newDateTime, setDate) => {
    setDate(newDateTime); // Update the date with the new date-time
  };
  /**********************************************************************************/
  useEffect(() => {
    fetchDogs();
  }, []);
  /**********************************************************************************/
  const fetchDogs = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_DEV_URL}/api/dog/all/`,
        {
          headers: {
            Authorization: `JWT ${token}`,
          },
        },
      );
      const data = await response.json();
      console.log("Response data:", data);

      if (response.ok && Array.isArray(data.dogs)) {
        const formattedDogs = data.dogs.map((dog) => ({
          label: dog.name,
          value: dog.id.toString(),
        }));
        setItems(formattedDogs);

        setDogList(
          data.dogs.map((dogs) => ({ key: dogs.id, value: dogs.name })),
        );
        console.log("dogList ", dogList);
      } else {
        console.error("Failed to fetch dogs or dogs is not an array");
      }
    } catch (error) {
      console.error("Error fetching dogs:", error);
    }
  };
  /**********************************************************************************/
  // TODO: remove everything relating to TIME from API call, just do dates for now.
  const handleCreateTask = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      // Format the startDate to exclude the time component
      const startDateWithoutTime = startDate.toISOString().split("T")[0];
      console.log(value, taskName, location, startDateWithoutTime, notes);
      const response = await fetch(`http://localhost:8000/api/tasks/add/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${token}`,
        },
        body: JSON.stringify({
          dog: value, // Use the selected dog ID directly
          name: taskName,
          location: location,
          start_time: startDateWithoutTime, // Use the formatted date
          notes: notes,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        setTaskName("");
        setLocation("");
        setNotes("");
        setStartDate(new Date());

        Alert.alert("Success", "Task created successfully");
      } else {
        console.error("Failed to create task");
        Alert.alert("Error", "Failed to create task");
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "An error occurred while creating the task");
    }
  };

  /**********************************************************************************/
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.headerSection}>
          <Text style={styles.headerText}>Lägg till en aktivitet</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={navigateToCalendar}
          >
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.inputSection}>
          <View style={styles.dogList}>
            <SelectList
              placeholder="Välj hund"
              data={dogList}
              setSelected={setValue} // Use the function that updates the state with the selected item
              selectedValue={value} // Pass the selected value to SelectList
              // Other SelectList props as needed
              boxStyles={{
                borderRadius: 10,
                backgroundColor: "#b7dcd9",
                marginBottom: 18,
                width: "100%", // Adjust if necessary to match your design
              }}
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Titel"
              placeholderTextColor={'black'}
              value={taskName}
              onChangeText={setTaskName}
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Plats"
              placeholderTextColor={'black'}
              value={location}
              onChangeText={setLocation}
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Anteckningar"
              placeholderTextColor={'black'}
              value={notes}
              onChangeText={setNotes}
            />
          </View>
          <View style={styles.datePickerContainer}>
            {/* Used to say "startar but makes less sense without a stop date" */}
            <Text style={styles.datePickerHeader}t> Datum </Text>
            <PetologyDatePicker
              title={"Startar"}
              date={startDate}
              onDateTimeChange={(newDateTime) =>
                handleDateTimeChange(newDateTime, setStartDate)
              }
            />
          </View>
        </View>

        <View style={styles.submitButtonSection}>
          <Button
            mode="contained"
            onPress={handleCreateTask}
            style={styles.addButtonStyle}
          >
            Lägg till
          </Button>
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
    // backgroundColor: '#92cdca',
  },
  scrollView: {},
  /**********************************************************************************/
  adjustedContainer: {
    marginTop: 200,
    marginBottom: 200,
  },
  headerSection: {
    marginTop: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 25,
  },
  headerText: {
    fontSize: 28,
    fontFamily: "Cochin",
    paddingLeft: 70,
  },
  inputSection: {
    marginTop: 10,
    alignItems: "center",
  },
  dogList: {
    width: "40%",
  },
  inputContainer: {
    borderBottomWidth: 1, // Only underline
    borderColor: "gray", // Color of the underline
    flexDirection: "row", // Align label and input horizontally
    alignItems: "center", // Vertically align items in the middle
    marginBottom: 30, // Space between each input section
    width: "85%",
  },

  label: {
    fontSize: 16,
    color: "black",
  },
  input: {
    width: "70%", // Width of the input field
    fontSize: 16, // Font size of the input
    color: "black", // Color of the input text
  },
  closeButtonSection: {
    // Position this section as needed
    // Positioned through headerSection right now but might be used later
  },
  closeButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 30,
    height: 30,
    // borderRadius: 14, // Half of width/height to make it round
    // borderWidth: 1,
    // backgroundColor: '#92cdca', // Adjust color as needed
  },
  closeButtonText: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
  },
  datePickerContainer: {
    width: "88%",
  },
  datePickerHeader: {
    top: 25,
    fontSize: 16,
  },
  addButtonStyle: {
    width: "50%", // Adjust the width as needed
    height: 50,
    justifyContent: "center",
    backgroundColor: "#4a8483",
    // Add any other styling you want for the button
  },
  submitButtonSection: {
    alignItems: "center",
    marginTop: 80,
  },
});

export default CreateTaskScreen;
