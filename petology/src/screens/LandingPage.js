import React, { useState, useEffect } from "react";
import { useFocusEffect } from '@react-navigation/native';
import Config from 'react-native-config';
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

import offeringImage from "../../assets/offering.jpg";
import Footer from '../components/common/Footer';
import Header  from '../components/common/Header';
import Task from '../components/common/task/Task';
import SubHeader from "../components/common/SubHeader";

const LandingPage = ({ navigation }) => {
/**********************************************************************************/
  const [selectedDogName, setSelectedDogName] = useState(null);

  // Initialize tasksToday as an empty array and completedTasksToday as 0
const [tasksToday, setTasksToday] = useState([]);
const [completedTasksToday, setCompletedTasksToday] = useState(0);

/**********************************************************************************/
  // Pie chart vars
  const widthAndHeight = 120;
  // const series = [123, 321, 123, 789, 537];
  // const series = [(tasksToday.length - completedTasksToday), completedTasksToday];
  // const series = [1, 5]
  // const sliceColor = ["#fbd203", "#ffb300", "#ff9100", "#ff6c00", "#ff3c00"];
  const sliceColor = ["#eff8f7", "#a55671"];
/**********************************************************************************/
// TODO: this seems to be getting more tasks than just today, fix.
  const fetchAndFilterTasksForToday = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) throw new Error("User token not found.");
  
      const response = await fetch(`${process.env.EXPO_PUBLIC_DEV_URL}/api/tasks/all/`, {
        method: "GET",
        headers: {
          Authorization: `JWT ${token}`,
        },
      });
  
      if (!response.ok) throw new Error("Error fetching user tasks.");
  
      const tasks = await response.json();
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);
  
      const tasksForToday = tasks.filter(task => {
        const taskStartTime = new Date(task.start_time);
        return taskStartTime >= todayStart && taskStartTime <= todayEnd;
      });
      
      const completedTasksToday = tasksForToday.filter(task => task.completed).length;

      setTasksToday(tasksForToday); // Set the total number of tasks for today
      setCompletedTasksToday(completedTasksToday); // Set the number of completed tasks for today
  
      console.log('tasksForToday ', tasksForToday);
      console.log('tasksForToday ', tasksForToday.length);
      console.log('completedTasksToday ', completedTasksToday);

      return tasksForToday;
    } catch (error) {
      console.error(error);
      return [];
    }
  };
/**********************************************************************************/
useFocusEffect(
  React.useCallback(() => {
    fetchAndFilterTasksForToday();
  }, [])
);
/**********************************************************************************/
const updateTaskCompletion = async (taskId, completed) => {
  const token = await AsyncStorage.getItem("userToken");
  if (token) {
      fetch(`${process.env.EXPO_PUBLIC_DEV_URL}/api/tasks/patch/${taskId}/`, {
          method: "PATCH",
          headers: {
              'Content-Type': 'application/json',
              Authorization: `JWT ${token}`,
          },
          body: JSON.stringify({ completed }),
      })
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.json();
      })
      .then(data => {
          // console.log("Task updated:", data);
          fetchAndFilterTasksForToday(); // Re-fetch tasks to update the list
      })
      .catch(error => console.error("Error updating task:", error));
  }
};
/**********************************************************************************/
  return (
    <View style={styles.container}> 
    <ScrollView style={styles.scrollView}>
      <Header/>
      <View style={styles.dayStatSection}>
        <View style={styles.tasksDoneToday}>
          <Text style={styles.taskNumber}>{Array.isArray(tasksToday) ? tasksToday.length : 0}</Text>
          <Text style={styles.taskText}>uppgifter</Text>
          <Text style={styles.taskText}>idag</Text>
        </View>
        
        {tasksToday.length > 0 && completedTasksToday !== null && (
          <View style={styles.tasksDoneGraph}>
            <PieChart
              widthAndHeight={widthAndHeight}
              series={[(tasksToday.length - completedTasksToday), completedTasksToday]}
              sliceColor={sliceColor}
              coverRadius={0.9}
              coverFill={"#92cdca"}
            />
          </View>
        )}


        <View style={styles.tasksLeftToday}>
          <Text style={styles.taskNumber}>{completedTasksToday}</Text>
          <Text style={styles.taskText}>uppgifter</Text>
          <Text style={styles.taskText}>avklarade</Text>
        </View>
      </View>
      <View style={styles.motivationTextSection}>
        <Text> God morgon! </Text>
        <Text> Pepp Pepp Hurra </Text>
      </View>
      <View style={styles.activeDogPictureSection}>
        <ImageBackground
          source={ DogImage }
          resizeMode="cover"
          style={styles.articleImageStyle}
          imageStyle={{ borderRadius: 20}}
        />
      </View>

          {/* TODO: gotta fix the layout of tasks, and also add some message when there are no tasks for the day. */}
          <View style={styles.tasksListSection}>
            <View style={styles.taskListBoxHeader}>
              <SubHeader headerText={'Uppgifter'}/>
            </View>
            <View style={styles.taskListBox}>
                {tasksToday && tasksToday.map((task) => (
                  <Task
                    key={task.id}
                    taskName={task.name}
                    startTime={task.start_time}
                    notes={task.notes}
                    dogName={task.dog_name}
                    isCompleted={task.completed}
                    onCheckChange={(newCheckState) => updateTaskCompletion(task.id, newCheckState)}
                  />
                ))}
              </View>
          </View>
      <TouchableOpacity style={styles.offeringContainer} onPress={() => navigation.navigate("ArticleList")}>
      <ImageBackground
          source={ offeringImage }
          resizeMode="cover"
          style={styles.offeringImageStyle}
          imageStyle={{ borderRadius: 20}}
        />
        <SubHeader style={styles.offeringHeaderStyle} headerText={'Erbjudande'}/>
      </TouchableOpacity>
      
      <View style={styles.newsContainer}>
        <SubHeader headerText={'Nyheter'}/>
        <Text style={styles.motivationTextSection}> Petology 1.0 har precis släppts! </Text>
      </View>
      <TouchableOpacity style={styles.articlesContainer} onPress={() => navigation.navigate("ArticleList")}>
        <SubHeader headerText={'Artiklar'}/>
      </TouchableOpacity>
      <View style={styles.emptyContainer}></View>

    </ScrollView>
    <Footer navigation={navigation} />
    </View>
  );
};

/**********************************************************************************/
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: "#92cdca",
  },
  scrollView: {
    // backgroundColor: "#92cdca",
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
/**********************************************************************************/
  activeDogPictureSection: {
    alignContent: "center",
    borderRadius: 20,
    height: '15%',
    width: "95%",
    marginBottom: 25,
    left: 10, // bad solution but can't figure it out dynamically right now
  },
  articleImageStyle: {
    height: "100%",
    width: "100%",
    borderRadius: 20,
  },
/**********************************************************************************/
  tasksListSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 15,
  },
  taskListBox: {
    // backgroundColor: '#afe0de',
    // minHeight: 200, // Set a minimum height to ensure it's visible
    width: '90%',
    // borderRadius: 2,
  },  
  taskListBoxHeader: {},
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
/**********************************************************************************/
  articlesContainer: {
    paddingTop: 40,
    height: 200,
    width: '90%',
    borderWidth: 2,
    left: 20,
    borderRadius: 20,
    backgroundColor: 'lightgreen',
  },
  offeringContainer: {
    height: 200,
    width: '90%',
    borderWidth: 2,
    left: 20,
    borderRadius: 20,
    marginBottom: 30,
  },
  offeringImageStyle: {
    height: "100%",
    width: "100%",
  },
  offeringHeaderStyle: {

  },
  newsContainer: {
    alignItems: 'center',
    height: 80,
  },
  emptyContainer: {
    height: 300,
    // backgroundColor: 'gold',
  },
});

export default LandingPage;
