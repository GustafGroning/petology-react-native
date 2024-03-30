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
import getUserTasks from "../api_calls/user/getUserTasks";
import updateTaskStatus from "../api_calls/task/updateTaskStatus";

const LandingPage = ({ navigation }) => {
/**********************************************************************************/
  // PIE CHART
  const widthAndHeight = 120;
  // const series = [123, 321, 123, 789, 537];
  // const series = [(tasksToday.length - completedTasksToday), completedTasksToday];
  // const series = [1, 5]
  // const sliceColor = ["#fbd203", "#ffb300", "#ff9100", "#ff6c00", "#ff3c00"];
  const sliceColor = ["#eff8f7", "#a55671"];
/**********************************************************************************/
// TASK HANDLING
const [allTasks, setAllTasks] = useState([]); // all tasks for the user
const [tasksToday, setTasksToday] = useState([]); // filter out tasks for the current day
const [completedTasksToday, setCompletedTasksToday] = useState(0); // tasks for today with completed = true

const getAllUserTasksHandler = async () => {
  const tasks = await getUserTasks();
  setAllTasks(tasks);
};

const filterTasksForToday = () => {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const tasksForToday = allTasks.filter(task => {
    const taskStartTime = new Date(task.start_time);
    return taskStartTime >= todayStart && taskStartTime <= todayEnd;
  });

  setTasksToday(tasksForToday);
  // filterCompletedTasks();

};

const filterCompletedTasks = async () => {
  console.log('COMPLETED TASKS ', completedTasksToday);
  setCompletedTasksToday(tasksToday.filter(task => task.completed).length);
};

  // Callback function to handle task deletion
  const handleDeleteTask = (taskId) => {
    // Update state to remove the deleted task
    setTasksToday(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

const handleUpdateTask = async (taskId, updatedTask) => {
  try {
    // Update the task in the allTasks state
    setTasksToday(prevTasks => prevTasks.map(task => (task.id === taskId ? updatedTask : task)));
  } catch (error) {
    // Handle error if needed
    console.error("Error updating task:", error);
  }
};

const updateTaskCompletion = async (taskId, completed) => {
  // Call the new function passing the taskId, completed status, and the fetchAndUpdateTasks function
  updateTaskStatus(taskId, completed, getAllUserTasksHandler);
};
/**********************************************************************************/
useFocusEffect(
  React.useCallback(() => {
    getAllUserTasksHandler();
  }, [])
);
useEffect(() => {
  filterTasksForToday();
}, [allTasks]);
useEffect(() => {
  filterCompletedTasks();
}, [tasksToday]);

  return (
    <View style={styles.container}> 
    <ScrollView style={styles.scrollView}>
      <Header/>
      <View style={styles.dayStatSection}>
        {tasksToday.length > 0 ? (
          <>
            <View style={styles.tasksDoneToday}>
              <Text style={styles.taskNumber}>{tasksToday.length - completedTasksToday}</Text>
              <Text style={styles.taskText}>uppgifter kvar</Text>
              <Text style={styles.taskText}>idag</Text>
            </View>

            <View style={styles.tasksDoneGraph}>
              <PieChart
                widthAndHeight={widthAndHeight}
                series={[(tasksToday.length - completedTasksToday), completedTasksToday]}
                sliceColor={sliceColor}
                coverRadius={0.9}
                coverFill={"#92cdca"}
              />
            </View>

            <View style={styles.tasksLeftToday}>
              <Text style={styles.taskNumber}>{completedTasksToday}</Text>
              <Text style={styles.taskText}>uppgifter</Text>
              <Text style={styles.taskText}>avklarade</Text>
            </View>
          </>
        ) : (
          <Text style={styles.placeholderText}>Inga uppgifter idag!</Text>
        )}
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
      <View style={styles.tasksListSection}>
        {tasksToday.length > 0 && (
          <>
            <View style={styles.taskListBoxHeader}>
              <SubHeader headerText={'Uppgifter'}/>
            </View>
            <View style={styles.taskListBox}>
              {tasksToday.map((task) => (
                <Task
                  key={task.id}
                  taskId={task.id}
                  taskName={task.name}
                  startTime={task.start_time}
                  notes={task.notes}
                  location={task.location}
                  dogName={task.dog}
                  isCompleted={task.completed}
                  onCheckChange={(newCheckState) => updateTaskCompletion(task.id, newCheckState)}
                  onDeleteTask={handleDeleteTask}
                  onUpdateTask={handleUpdateTask}
                />
              ))}
            </View>
          </>
        )}
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
      {/* Looks in articleListScreen like entire articles are sent to render articles, which means
      the chosen article needs to be loaded here on LandingPage in order to have featured articles. */}
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
