import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Calendar } from 'react-native-calendars';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Task from '../components/common/Task';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Button } from "react-native-paper";

const CalendarScreen = ({ navigation }) => {
  const [currentSpanIndex, setCurrentSpanIndex] = useState(0);
  const timespans = ['dagens uppgifter', 'veckans uppgifter'];

  const [taskListHeader, setTaskListHeader] = useState(['idag'])
  const [allTasks, setAllTasks] = useState([]); // Maintain all tasks
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [selected, setSelected] = useState(0);
  const [markedDates, setMarkedDates] = useState({});
/**********************************************************************************/
// NAVIGATION
  const navigateToCreateTask = () => {
    navigation.navigate('CreateTask');
  };
/**********************************************************************************/
  const fetchUserTasks = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (token) {
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_DEV_URL}/api/tasks/all/`, // Replace with your API endpoint
          {
            method: "GET",
            headers: {
              Authorization: `JWT ${token}`,
            },
          }
        );
  
        if (response.ok) {
          const data = await response.json();
          setAllTasks(data);
        } else {
          console.error("Error fetching user tasks:", response.status);
        }
      } else {
        console.error("User token not found.");
      }
    } catch (error) {
      console.error("Error fetching user tasks:", error);
    }
  };
/**********************************************************************************/
// Creates dots on the calendar for each date which has tasks. 
// uses allTasks rather than filteredTasks to seperate logic.
const calculateMarkedDates = () => {
  const marked = {};
  allTasks.forEach(task => {
    const date = task.start_time.split('T')[0];
    marked[date] = { marked: true, dotColor: 'black' };
  });
  if (selected) {
    marked[selected] = { ...marked[selected], selected: true, disableTouchEvent: true, selectedColor: '#4f908e' };
  }
  setMarkedDates(marked);
};
/**********************************************************************************/
const getStartOfWeek = (date) => {
  const day = date.getDay(); // 0: Sunday, 1: Monday, ..., 6: Saturday
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday if Sunday
  return new Date(date.setDate(diff)); // Set to the start of the week
};
/**********************************************************************************/
const getEndOfWeek = (startOfWeek) => {
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 6); // Add 6 days to get the end of the week
  return endOfWeek;
};
/**********************************************************************************/
const listOfDatesWithTasks = () => {
/*
Handles which tasks are being rendered in the task list based on 'selected'.
if selected === 0, display all tasks for the current day.
if selected === 1, display all tasks for the currect week (starting on the last monday)
else (meaning that the user has selected a specific date from the calendar), display
tasks for that specific date.
*/
  let tasksForDates = [];

  if (selected !== '') {
    if (selected === 0) {
      // Filter tasks for today
      const today = new Date();
      const todayWithoutTime = today.toISOString().split('T')[0]; // Get only the date part
      const todayTasks = allTasks.filter(task => {
        const taskDate = new Date(task.start_time);
        const taskDateWithoutTime = taskDate.toISOString().split('T')[0]; // Get only the date part
        return taskDateWithoutTime === todayWithoutTime;
      });
      tasksForDates = todayTasks;
    } else if (selected === 1) {
      // Filter tasks for this week
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Start of current week (Monday)
      const endOfWeek = new Date(today);
      endOfWeek.setDate(today.getDate() + (7 - today.getDay())); // End of current week (Sunday)

      // Calculate start and end of the current week
      const startOfWeekDate = getStartOfWeek(today);
      const endOfWeekDate = getEndOfWeek(startOfWeekDate);

      const startOfWeekWithoutTime = startOfWeekDate.toISOString().split('T')[0]; // Get only the date part
      const endOfWeekWithoutTime = endOfWeekDate.toISOString().split('T')[0]; // Get only the date part

      tasksForDates = allTasks.filter(task => {
        const taskDate = new Date(task.start_time);
        const taskDateWithoutTime = taskDate.toISOString().split('T')[0]; // Get only the date part
        return (
          taskDateWithoutTime >= startOfWeekWithoutTime &&
          taskDateWithoutTime <= endOfWeekWithoutTime
        );
      });
    } else {
      // Filter tasks for a specific date
      const selectedDate = new Date(selected);
      const selectedDateWithoutTime = selectedDate.toISOString().split('T')[0]; // Get only the date part
      const selectedDateTasks = allTasks.filter(task => {
        const taskDate = new Date(task.start_time);
        const taskDateWithoutTime = taskDate.toISOString().split('T')[0]; // Get only the date part
        return taskDateWithoutTime === selectedDateWithoutTime;
      });
      tasksForDates = selectedDateTasks;
    }   
  } else {
    tasksForDates = allTasks;
  }

  setFilteredTasks(tasksForDates); // Update filteredTasks state
};
/**********************************************************************************/
const updateTaskListHeader = () => {
  if (selected === 0) {
    setTaskListHeader('idag');
  } else if (selected === 1) {
    setTaskListHeader('den här veckan');
  } else {
    // Convert selected date to the desired format (e.g., dd-mm-yyyy)
    const selectedDate = new Date(selected);
    const formattedDate = selectedDate.toLocaleDateString('sv-SE');
    setTaskListHeader(formattedDate);
  }
};
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
            fetchUserTasks();
        })
        .catch(error => console.error("Error updating task:", error));
    }
  };
/**********************************************************************************/
  useEffect(() => {
    fetchUserTasks();
  }, []);
  useEffect(() => {
    calculateMarkedDates();
    updateTaskListHeader();
  }, [allTasks, selected]); // Update marked dates whenever allTasks or selected changes
  useEffect(() => {
    listOfDatesWithTasks();
  }, [selected, allTasks, currentSpanIndex]);
  useFocusEffect(
    React.useCallback(() => {
      fetchUserTasks();
    }, [])
/**********************************************************************************/
  );
  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        <Header/>
        <View style={styles.calendarSection}>
          <TouchableOpacity
            style={styles.addTaskButton}
            onPress={navigateToCreateTask}
          >
            <Text style={styles.addTaskButtonText}>+</Text>
          </TouchableOpacity>
          <Calendar
            style={{
              height: 320,
              width: '100%',
              backgroundColor: '#92cdca',
            }}
            firstDay={1}
            theme={{
              backgroundColor: '#92cdca',
              calendarBackground: '#92cdca',
              monthTextColor: 'white',
              textSectionTitleColor: 'white',
              todayTextColor: '#ff5722',
              dayTextColor: 'white',
            }}
            onDayPress={day => {
              setSelected(day.dateString);
            }}
            markedDates={markedDates}
          />
        </View>

         <View style={styles.taskHeaderSection}>
            <TouchableOpacity onPress={() => setSelected(0)}>
                <FontAwesome name="arrow-left" size={20} color="#000" />
            </TouchableOpacity>
            <Text style={styles.taskHeaderText}> {taskListHeader} </Text>
            <TouchableOpacity onPress={() => setSelected(1)}>
                <FontAwesome name="arrow-right" size={20} color="#000" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.taskSection}>
              {filteredTasks.map((task) => (
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
          </ScrollView>
        </View>
      <Footer navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#92cdca',
    justifyContent: 'space-between',
  },

  container: {
    flex: 1,
    paddingTop: 40,
    paddingBottom: 10,
    alignItems: 'center',
  },
  addTaskButton: {
    zIndex: 1, // Set a higher zIndex for the button
    position: 'absolute', // Position the button absolutely
    top: 10, // Adjust the top position as needed
    right: 55, // Adjust the right position as needed
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    backgroundColor: '#92cdca',
  },
  

  addTaskButtonText: {
    color: 'black',
    fontSize: 15,
    fontWeight: 'bold',
  },

  addButtonStyle: {
    width: '40%', // Adjust the width as needed
    height: 40,
    justifyContent: 'center',
    backgroundColor: '#4a8483',
    // Add any other styling you want for the button
},

  calendarSection: {
    width: '95%',
    paddingBottom: 18,
    marginBottom: 20,
    // borderWidth: 2,
  },

  taskHeaderSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 40,
    width: '75%',
    marginBottom: 10,
  },

  taskHeaderText: {
    fontSize: 20,
  },

  taskSection: {
    flex: 1,
    width: '100%',
  },
});

export default CalendarScreen;
