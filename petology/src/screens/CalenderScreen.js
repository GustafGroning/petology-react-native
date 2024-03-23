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
    marked[selected] = { ...marked[selected], selected: true, disableTouchEvent: true, selectedColor: 'green' };
  }
  setMarkedDates(marked);
};
/**********************************************************************************/
const listOfDatesWithTasks = () => {
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
  
      const startOfWeekWithoutTime = startOfWeek.toISOString().split('T')[0]; // Get only the date part
      const endOfWeekWithoutTime = endOfWeek.toISOString().split('T')[0]; // Get only the date part
  
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
        <View style={styles.calendarHeaderSection}>
          <TouchableOpacity
            style={styles.addTaskButton}
            onPress={navigateToCreateTask}
          >
            <Text style={styles.addTaskButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.calendarSection}>
          <Calendar
            style={{
              height: 320,
              width: '100%',
              backgroundColor: '#92cdca',
            }}
            theme={{
              backgroundColor: '#92cdca',
              calendarBackground: '#92cdca',
              monthTextColor: 'white',
              textSectionTitleColor: 'white',
              selectedDayBackgroundColor: '#558b2f',
              todayTextColor: '#ff5722',
              dayTextColor: 'white',
            }}
            onDayPress={day => {
              setSelected(day.dateString); // YYYY-MM-DD format
            }}
            markedDates={markedDates} // Add the prop to mark dates with tasks
          />
        </View>

         <View style={styles.taskHeaderSection}>
                {/* <TouchableOpacity onPress={() => setCurrentSpanIndex(currentSpanIndex - 1)}>
                    <FontAwesome name="arrow-left" size={20} color="#000" />
                </TouchableOpacity> */}
                {/* <Text style={styles.taskHeaderText}> {timespans[currentSpanIndex]} </Text> */}
                {/* <TouchableOpacity onPress={() => setCurrentSpanIndex(currentSpanIndex + 1)}>
                    <FontAwesome name="arrow-right" size={20} color="#000" />
                </TouchableOpacity> */}
                <Button mode="contained" onPress={() => setSelected(0)} style={styles.addButtonStyle}>
                  Idag
                </Button>
                <Button mode="contained" onPress={() => setSelected(1)} style={styles.addButtonStyle}>
                  vecka
                </Button>
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

  calendarHeaderSection: {
    width: '100%',
    height: 40,
    justifyContent: 'center',
  },

  addTaskButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    backgroundColor: '#92cdca',
    left: 390,
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
    width: '90%',
    paddingBottom: 18,
    marginBottom: 20,
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
