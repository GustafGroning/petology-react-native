import { Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button } from "react-native-paper";
import DatePicker from '../components/CreateTaskScreenComponents/DatePicker';
import DropDownPicker from 'react-native-dropdown-picker';




const CreateTaskScreen = ({ navigation }) => {
/**********************************************************************************/
    
    const [items, setItems] = useState([]);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);



    // List of all user dogs, used for dropdown
    const [dogList, setDogList] = useState([]);

    // Chosen dog, ID will be used for task
    const [dog, setDog] = useState('');

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const [taskName, setTaskName] = useState('');
    const [location, setLocation] = useState('');
    const [category, setCategory] = useState('');
    const [reminder, setReminder] = useState('');
    const [notes, setNotes] = useState('');

/**********************************************************************************/
const [startDate, setStartDate] = useState(new Date());
const [startTime, setStartTime] = useState(new Date(new Date().setHours(0, 0, 0, 0)))

const [stopDate, setStopDate] = useState(new Date()); 
const [stopTime, setStopTime] = useState(new Date(new Date().setHours(0, 0, 0, 0)))

/**********************************************************************************/
    const navigateToCalendar = () => {
        navigation.navigate('Calendar');
    };
/**********************************************************************************/
useEffect(() => {
    fetchDogs();
  }, []);
/**********************************************************************************/
const fetchDogs = async () => {
    try {
        const token = await AsyncStorage.getItem("userToken");
        const response = await fetch("http://localhost:8000/api/dog/all/", {
            headers: {
                Authorization: `JWT ${token}`,
            },
        });
        const data = await response.json();
        console.log("Response data:", data);

        if (response.ok && Array.isArray(data.dogs)) {
            const formattedDogs = data.dogs.map(dog => ({
                label: dog.name,
                value: dog.id.toString()
            }));
            setItems(formattedDogs);
        } else {
            console.error("Failed to fetch dogs or 'dogs' is not an array");
        }
    } catch (error) {
        console.error("Error fetching dogs:", error);
    }
};


/**********************************************************************************/
const handleCreateTask = async () => {
    try {
        const token = await AsyncStorage.getItem("userToken");

        // Format the dates and times
        const formattedStartTime = `${startDate.toISOString().split('T')[0]}T${startTime.toISOString().split('T')[1]}`;
        const formattedEndTime = `${stopDate.toISOString().split('T')[0]}T${stopTime.toISOString().split('T')[1]}`;

        const response = await fetch("http://localhost:8000/api/tasks/add/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `JWT ${token}`,
            },
            body: JSON.stringify({
                dog: dog, // Use the selected dog ID
                name: taskName,
                location: location,
                start_time: formattedStartTime,
                end_time: formattedEndTime,
                // category, reminder, and notes can be added similarly
            }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Task created:", data);
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
    <View style={open ? styles.adjustedContainer : styles.container}>
        {/* WORKING ON THIS RIGHT NOW */}
            <View style={styles.headerSection}>
                <Text style={styles.headerText}>Lägg till en aktivitet</Text>
                <View style={styles.closeButtonSection}>
                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={navigateToCalendar}
                >
                    <Text style={styles.closeButtonText}>X</Text>
                </TouchableOpacity>
            </View>
            </View>

            <View style={styles.inputSection}>
            <View style={styles.dogList}> 
            {/* <SelectList
                onOpen={() => setIsDropdownOpen(true)}
                onClose={() => setIsDropdownOpen(false)}
                setSelected={setDog}
                data={dogList}
                placeholder='hund'
                boxStyles={{
                    borderRadius: 20,
                    backgroundColor: '#b7dbd9',
                    backfaceVisibility: 'hidden',
                    opacity: 1,
                }}
                inputStyles={{
                    color: 'black',
                    fontSize: 16,
                }}
                dropdownStyles={{
                    backgroundColor: '#e6e6e6',
                    backfaceVisibility: 'hidden',
                    opacity: 1,
                }}
                dropdownItemStyles={{
                    padding: 500,
                    zIndex: 1,
                    opacity: 1,
                }}
                dropdownTextStyles={{

                }}
            /> */}
                  <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
      />
            
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}></Text>
                <TextInput
                    editable={!open}
                    style={styles.input}
                    placeholder="Titel"
                    value={taskName}
                    onChangeText={setTaskName}
                />
            </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        editable={!open}
                        style={styles.input}
                        placeholder="Plats"
                        value={location}
                        onChangeText={setLocation}
                    />
                </View>
                <View style={styles.datePickerContainer}>
                <DatePicker
                    title={"start"}
                    date={startDate}
                    time={startTime}
                    onDateChange={setStartDate}
                    onTimeChange={setStartTime}
                />
                <DatePicker
                    title={"end"}
                    date={stopDate}
                    time={stopTime}
                    onDateChange={setStopDate}
                    onTimeChange={setStopTime}
                />

                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="anteckningar"
                        value={location}
                        onChangeText={setNotes}
                    />
                </View>
            </View>
            
            {/* <View style={styles.section}>
                <Text style={styles.label}>Category</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Category"
                    value={category}
                    onChangeText={setCategory}
                />
            </View> */}

            {/* <View style={styles.section}>
                <Text style={styles.label}>Reminder</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Reminder"
                    value={reminder}
                    onChangeText={setReminder}
                />
            </View> */}



            <View style={styles.submitButtonSecion}>
                <Button
                    mode="contained"
                    onPress={handleCreateTask}
                    style={styles.addButtonStyle}
                    buttonColor="#4a8483"
                >
                    Lägg till
                </Button>
            </View>

        </View>
);
};

const styles = StyleSheet.create({
container: {
    flex: 1,
},
adjustedContainer: {
    marginTop: 200,
},
headerSection: {
    marginTop: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%', 
    paddingHorizontal: 25, 
  },
headerText: {
    fontSize: 28,
    fontFamily: "Cochin",
    paddingLeft: 70,
},
inputSection: {
    marginTop: 10,
    alignItems: 'center',
    // borderWidth: 1,
    // borderColor: 'black',
},
dogList: {
    width: '40%',
    height: 100,
},
inputContainer: {
    borderBottomWidth: 1, // Only underline
    borderColor: 'gray', // Color of the underline
    flexDirection: 'row', // Align label and input horizontally
    alignItems: 'center', // Vertically align items in the middle
    marginBottom: 30, // Space between each input section
    width: '85%',
  },
  
  label: {
    fontSize: 16,
    color: 'black',
  },
  input: {
    width: '70%', // Width of the input field
    fontSize: 16, // Font size of the input
    color: 'black', // Color of the input text
  },
closeButtonSection: {
    // Position this section as needed
    // Positioned through headerSection right now but might be used later
},
closeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 30,
    // borderRadius: 14, // Half of width/height to make it round
    // borderWidth: 1,
    // backgroundColor: '#92cdca', // Adjust color as needed
},
closeButtonText: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
},
datePickerContainer: {
    width: '88%',
    // alignItems: 'center',
    // borderWidth: 1,
    // borderColor: 'black',
},
addButtonStyle: {
    width: '50%', // Adjust the width as needed
    height: 50,
    justifyContent: 'center',
    // Add any other styling you want for the button
},
submitButtonSecion: {
    alignItems: 'center',
    marginTop: 80,
},
});

export default CreateTaskScreen;