import React, { useState, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PieChart from "react-native-pie-chart";
import DogImage from "../../assets/doggo.jpg";
import offeringImage from "../../assets/offering.jpg";
import Footer from "../components/common/Footer";
import Header from "../components/common/Header";
import Task from "../components/common/task/Task";
import SubHeader from "../components/common/SubHeader";
import getUserTasks from "../api_calls/task/getUserTasks";

const LandingPage = ({ navigation }) => {
  const widthAndHeight = 120;
  const sliceColor = ["#eff8f7", "#a55671"];
  const [allTasks, setAllTasks] = useState([]);
  const [tasksToday, setTasksToday] = useState([]);
  const [completedTasksToday, setCompletedTasksToday] = useState(0);
  /**********************************************************************************/
  const getAllUserTasksHandler = async () => {
    const tasks = await getUserTasks();
    console.log("tasks ", tasks);
    setAllTasks(tasks);
  };
  /**********************************************************************************/
  const filterTasksForToday = () => {
    console.log("********** started filtering tasks for TODAY **********");
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const tasksForToday = allTasks.filter((task) => {
      const taskStartTime = new Date(task.start_time);
      return taskStartTime >= todayStart && taskStartTime <= todayEnd;
    });
    console.log("********** found tasks for today **********");
    console.log(tasksForToday);
    setTasksToday(tasksForToday);
  };
  /**********************************************************************************/
  const filterCompletedTasks = () => {
    console.log("********** inside filterCompletedTasks **********");
    console.log(
      "heres what tasksToday looks like inside filterCompletedTasks",
      tasksToday,
    );
    const completedToday = tasksToday.filter((task) => task.completed);
    console.log("completedToday ", completedToday);
    setCompletedTasksToday(completedToday.length);
  };
  /**********************************************************************************/
  const handleDeleteTask = (taskId) => {
    setAllTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };
  /**********************************************************************************/
  const handleUpdateTask = async (taskId, updatedTask) => {
    try {
      setAllTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === taskId ? updatedTask : task)),
      );
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };
  /**********************************************************************************/
  const updateTaskCompletion = async (taskId, completed) => {
    console.log("Received task completion state in LandingPage:", completed);
    const token = await AsyncStorage.getItem("userToken");
    if (token) {
      fetch(`${process.env.EXPO_PUBLIC_DEV_URL}/api/tasks/patch/${taskId}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${token}`,
        },
        body: JSON.stringify({ completed }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          getAllUserTasksHandler();
        })
        .catch((error) => console.error("Error updating task:", error));
    }
  };
  /**********************************************************************************/
  useEffect(() => {
    getAllUserTasksHandler();
  }, []);

  useEffect(() => {
    // Call filterTasksForToday whenever allTasks changes
    filterTasksForToday();
  }, [allTasks]);

  useEffect(() => {
    filterCompletedTasks();
  }, [tasksToday, completedTasksToday]);

  useFocusEffect(
    React.useCallback(() => {
      console.log("inside useFocusEffect");
      getAllUserTasksHandler();
    }, []),
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Header />
        <View style={styles.dayStatSection}>
          {tasksToday.length > 0 ? (
            <>
              <View style={styles.tasksDoneToday}>
                <Text style={styles.taskNumber}>
                  {tasksToday.length - completedTasksToday}
                </Text>
                <Text style={styles.taskText}>uppgifter kvar</Text>
                <Text style={styles.taskText}>idag</Text>
              </View>

              <View style={styles.tasksDoneGraph}>
                <PieChart
                  widthAndHeight={widthAndHeight}
                  series={[
                    tasksToday.length - completedTasksToday,
                    completedTasksToday,
                  ]}
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
            <View style={styles.tasksDoneGraph}>
              <PieChart
                widthAndHeight={widthAndHeight}
                series={[0, 5]}
                sliceColor={sliceColor}
                coverRadius={0.9}
                coverFill={"#92cdca"}
              />
              <Text style={styles.noTasksLeftTextLineOne}>
                {" "}
                Inga uppgifter{" "}
              </Text>
              <Text style={styles.noTasksLeftTextLineTwo}> kvar idag! </Text>
            </View>
          )}
        </View>

        <View style={styles.motivationTextSection}>
          <Text> God morgon! </Text>
          <Text> Pepp Pepp Hurra </Text>
        </View>
        <View style={styles.activeDogPictureSection}>
          <ImageBackground
            source={DogImage}
            resizeMode="cover"
            style={styles.articleImageStyle}
            imageStyle={{ borderRadius: 20 }}
          />
        </View>
        <View style={styles.tasksListSection}>
          {tasksToday.length > 0 && (
            <>
              <View style={styles.taskListBoxHeader}>
                <SubHeader headerText={"Uppgifter"} />
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
                    dogName={task.dog_name}
                    isCompleted={task.completed}
                    onCheckChange={(newCheckState) =>
                      updateTaskCompletion(task.id, newCheckState)
                    }
                    onDeleteTask={handleDeleteTask}
                    onUpdateTask={handleUpdateTask}
                  />
                ))}
              </View>
            </>
          )}
        </View>

        <TouchableOpacity
          style={styles.offeringContainer}
          onPress={() => navigation.navigate("ArticleList")}
        >
          <ImageBackground
            source={offeringImage}
            resizeMode="cover"
            style={styles.offeringImageStyle}
            imageStyle={{ borderRadius: 20 }}
          />
          <SubHeader
            style={styles.offeringHeaderStyle}
            headerText={"Erbjudande"}
          />
        </TouchableOpacity>

        <View style={styles.newsContainer}>
          <SubHeader headerText={"Nyheter"} />
          <Text style={styles.motivationTextSection}>
            {" "}
            Petology 1.0 har precis släppts!{" "}
          </Text>
        </View>
        {/* Looks in articleListScreen like entire articles are sent to render articles, which means
      the chosen article needs to be loaded here on LandingPage in order to have featured articles. */}
        <TouchableOpacity
          style={styles.articlesContainer}
          onPress={() => navigation.navigate("ArticleList")}
        >
          <SubHeader headerText={"Artiklar"} />
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
  scrollView: {},
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
    height: "15%",
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
    width: "90%",
    // borderRadius: 2,
  },
  taskListBoxHeader: {},
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 4,
  },
  noTasksLeftTextLineOne: {
    position: "absolute",
    top: 50,
  },
  noTasksLeftTextLineTwo: {
    position: "absolute",
    top: 70,
  },
  /**********************************************************************************/
  // CHECKBOX STYLES
  checkboxBase: {
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "black",
    backgroundColor: "transparent",
  },
  checkboxChecked: {
    backgroundColor: "black",
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
    width: "90%",
    borderWidth: 2,
    left: 20,
    borderRadius: 20,
    backgroundColor: "lightgreen",
  },
  offeringContainer: {
    height: 200,
    width: "90%",
    borderWidth: 2,
    left: 20,
    borderRadius: 20,
    marginBottom: 30,
  },
  offeringImageStyle: {
    height: "100%",
    width: "100%",
  },
  offeringHeaderStyle: {},
  newsContainer: {
    alignItems: "center",
    height: 80,
  },
  emptyContainer: {
    height: 300,
    // backgroundColor: 'gold',
  },
});

export default LandingPage;
