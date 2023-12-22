import React, { useState } from "react";
import { useFocusEffect } from '@react-navigation/native';

import {
  View,
  Text,
  StyleSheet,
  Button,
  ScrollView,
  ImageBackground, TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PieChart from "react-native-pie-chart";
import DogImage from "../../assets/doggo.jpg"; // TODO: fix real imports instead
import Footer from '../components/common/Footer';


const LandingPage = ({ navigation }) => {
  /**********************************************************************************/
  // Pie chart vars
  // TODO: actually get the values from DB
  // TODO: add percentage as text in the middle of diagram
  const widthAndHeight = 120;
  // const series = [123, 321, 123, 789, 537];
  const series = [150, 50];
  // const sliceColor = ["#fbd203", "#ffb300", "#ff9100", "#ff6c00", "#ff3c00"];
  const sliceColor = ["#eff8f7", "#a55671"];

  /**********************************************************************************/
  const [selectedDogName, setSelectedDogName] = useState(null);

  /**********************************************************************************/
  useFocusEffect(
    React.useCallback(() => {
      fetchSelectedDogDetails();
    }, [])
  );
  

  /**********************************************************************************/
  // CUSTOM CHECKBOX IMPLEMENTATION
  //TODO: just a placeholder for now, build the function
  const CustomCheckbox = () => {
    const [isChecked, setIsChecked] = useState(false);
  
    const toggleCheck = () => {
      setIsChecked(!isChecked);
    };
  
    return (
      <TouchableOpacity onPress={toggleCheck} style={[
        styles.checkboxBase,
        isChecked && styles.checkboxChecked
      ]} />
    );
  };

  const mockTasks = [
    { id: '1', description: 'Task 1' },
    { id: '2', description: 'Task 2' },
    { id: '3', description: 'Task 3' },
    { id: '4', description: 'Task 4' },
    { id: '5', description: 'Task 5' },
  ];

  /**********************************************************************************/
  



  const fetchSelectedDogDetails = async () => {
    try {
      const dogId = await AsyncStorage.getItem("selectedDogId");
      const token = await AsyncStorage.getItem("userToken");
      console.log('BACK IN LANDING!');
      console.log(AsyncStorage.getItem("selectedDogId"));
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
  /**********************************************************************************/

  return (
    <View style={styles.container}> 
    <ScrollView style={styles.scrollView}>
      <View style={styles.headerSection}>
        <Text style={styles.headerText}> Petology </Text>
      </View>
      <View style={styles.dayStatSection}>
        <View style={styles.tasksDoneToday}>
          <Text style={styles.taskNumber}>8</Text>
          <Text style={styles.taskText}>uppgifter kvar</Text>
          <Text style={styles.taskText}>idag</Text>
        </View>
        <View style={styles.tasksDoneGraph}>
          <PieChart
            widthAndHeight={widthAndHeight}
            series={series}
            sliceColor={sliceColor}
            coverRadius={0.9}
            coverFill={"#92cdca"}
          />
        </View>

        <View style={styles.tasksLeftToday}>
          <Text style={styles.taskNumber}>2</Text>
          <Text style={styles.taskText}>uppgifter</Text>
          <Text style={styles.taskText}>avklarade</Text>
        </View>
      </View>
      <View style={styles.motivationTextSection}>
        <Text> God morgon! </Text>
        <Text> Pepp Pepp Hurra </Text>
      </View>
      <View style={styles.activeDogPictureSection}>
        <ImageBackground source={DogImage} style={styles.dogImageStyle}>
          {/* Add content here if needed */}
        </ImageBackground>
      </View>
      <View style={styles.tasksListSection}>
  <View style={styles.taskListBox}>
    <Text style={styles.taskListBoxHeader}> Uppgifter </Text>
    {mockTasks.map(task => (
  <View key={task.id} style={styles.taskItem}>
    <CustomCheckbox />
    <Text>{task.description}</Text>
  </View>
))}

  </View>
</View>


      {selectedDogName && (
        <View style={styles.dogDetailsSection}>
          <Text style={styles.dogText}>Selected Dog: {selectedDogName}</Text>
        </View>
      )}

      <View style={styles.buttonSection}>
        <Button title="Log Out" onPress={() => navigation.navigate("Login")} />
      </View>

      {/* Additional sections can be added here */}
      

    </ScrollView>
    <Footer navigation={navigation} />
    </View>
  );
};

/**********************************************************************************/
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    backgroundColor: "#92cdca",
  },
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
  dayStatSection: {
    flex: 1,
    padding: 10,
    flexDirection: "row",
    height: 150,
    justifyContent: "space-around",
  },
  tasksDoneToday: {
    width: "27%",
    justifyContent: "center",
    alignItems: "center",
  },
  taskNumber: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: "2%",
  },
  taskText: {
    fontSize: 13,
  },
  tasksDoneGraph: {
    width: "46%",
    justifyContent: "center",
    alignItems: "center",
  },
  tasksLeftToday: {
    width: "27%",
    justifyContent: "center",
    alignItems: "center",
  },
  motivationTextSection: {
    flex: 1,
    height: 90,
    justifyContent: "center",
    alignItems: "center",
  },
  activeDogPictureSection: {
    // TODO: finish up image, weird as hell right now
    flex: 1,
    height: 120,
    // borderColor: "black",
    // borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  dogImageStyle: {
    width: "95%", // Container width
    height: "95%", // Container height, adjust as needed
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    overflow: 'hidden',
  },
  tasksListSection: {
    flex: 1,
    height: 225,
    // backgroundColor: 'gold',
    // borderColor: "black",
    // borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  taskListBox: {
    backgroundColor: '#afe0de',
    height: '90%',
    width: '80%',
    borderRadius: 20,
    // alignItems: 'center',
    // overflow: 'hidden',
  },
  taskListBoxHeader: {
    marginTop: 14,
    marginLeft: 120,
    fontSize: 24,
    fontFamily: "Cochin",
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },

  /**********************************************************************************/
  // CHECKBOX STYLES
  checkboxBase: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: 'transparent',
  },
  checkboxChecked: {
    backgroundColor: 'black',
  },

  /**********************************************************************************/
  dogDetailsSection: {
    flex: 1,
    borderColor: "black",
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    height: 100,
  },
  dogText: {
    fontSize: 18,
    color: "gray",
  },
  buttonSection: {
    flex: 1,
    borderColor: "black",
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    height: 100,
  },
});

export default LandingPage;
