import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  ScrollView,
  ImageBackground,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PieChart from "react-native-pie-chart";
import DogImage from "../../assets/doggo.jpg"; // Adjust the path to where your image is located

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
  useEffect(() => {
    fetchSelectedDogDetails();
  }, []);

  /**********************************************************************************/
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
  /**********************************************************************************/

  return (
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
  );
};

/**********************************************************************************/
const styles = StyleSheet.create({
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
    fontSize: 24,
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
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  activeDogPictureSection: {
    flex: 1,
    height: 120,
    borderColor: "black",
    borderWidth: 1,
  },
  dogImageStyle: {
    width: "100%", // Container width
    height: "100%", // Container height, adjust as needed
    justifyContent: "center",
    alignItems: "center",
  },

  tasksListSection: {},

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
