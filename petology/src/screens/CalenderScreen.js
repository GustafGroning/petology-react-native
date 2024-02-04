import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Calendar } from 'react-native-calendars';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Footer from '../components/common/Footer';
import Task from '../components/common/Task';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const CalendarScreen = ({ navigation }) => {
/**********************************************************************************/
  // create an ENUM that decides the current timespan
  // 0 = dagens
  // 1 = veckans
  // room to add more views later
  const [currentSpanIndex, setCurrentSpanIndex] = useState(0); // Initial span index
  const timespans = ['dagens uppgifter', 'veckans uppgifter']; // Define available timespans

  const [filteredTasks, setFilteredTasks] = useState([]);
  // List of all users tasks.
  const [listOfTasks, setListOfTasks] = useState([]);

  // Change the current span index based on the increment
  const changeTimeSpan = (increment) => {
    const newIndex = currentSpanIndex + increment;

    // Ensure the index cannot go out of bounds
    if (newIndex >= 0 && newIndex < timespans.length) {
      setCurrentSpanIndex(newIndex);
    }
  };
/**********************************************************************************/
// CALENDER
const [selected, setSelected] = useState('');



/**********************************************************************************/
    // Define the start and end dates based on the selected time span
    let startDate = new Date();
    let endDate = new Date();
    if (currentSpanIndex === 0) {
      // For "dagens uppgifter," use the current date as both start and end
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
    } else if (currentSpanIndex === 1) {
      // For "veckans uppgifter," use the current date and 7 days later as end date
      endDate.setDate(endDate.getDate() + 7);
      endDate.setHours(23, 59, 59, 999);
    }

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
              // Add any other headers you need here
            },
          }
        );
  
        if (response.ok) {
          const data = await response.json();
          // Handle the received data (tasks) as needed
          setListOfTasks(data);
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
const listOfDatesWithTasks = (tasks) => {
  const uniqueDates = new Set(); // Use a Set to avoid duplicate dates
  tasks.forEach((task) => {
    if (task.start_time) { // Ensure start_time is not null
      const date = task.start_time.split('T')[0]; // Extract the date part
      uniqueDates.add(date); // Add to the Set
    }
  });
  return Array.from(uniqueDates); // Convert the Set to an Array
};

/**********************************************************************************/
const filterTasksByDate = (tasks, currentSpanIndex, selectedDate) => {
  let startDate = new Date();
  let endDate = new Date();

  const timezoneOffset = startDate.getTimezoneOffset() * 60000; // Offset in milliseconds

  console.log(`Current Span Index: ${currentSpanIndex}`);
  console.log(`Selected Date: ${selectedDate}`);
  console.log(`Initial Start Date: ${startDate.toISOString()} and End Date: ${endDate.toISOString()}`);

  if (selectedDate) {
    startDate = new Date(selectedDate);
    endDate = new Date(selectedDate);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);
    console.log('Date selected. Adjusted Start Date:', startDate.toISOString(), 'Adjusted End Date:', endDate.toISOString());
  } else if (currentSpanIndex === 0) {
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);
    console.log('Dagens uppgifter. Adjusted Start Date:', startDate.toISOString(), 'Adjusted End Date:', endDate.toISOString());
  } else if (currentSpanIndex === 1) {
    endDate.setDate(endDate.getDate() + 7);
    endDate.setHours(23, 59, 59, 999);
    console.log('Veckans uppgifter. Adjusted Start Date:', startDate.toISOString(), 'Adjusted End Date:', endDate.toISOString());
  }

  const filteredTasks = tasks.filter((task) => {
    if (task.start_time) {
      const taskStartDateUTC = new Date(task.start_time);
      const taskStartDateLocal = new Date(taskStartDateUTC.getTime() + timezoneOffset);

      const isWithinRange = taskStartDateLocal >= startDate && taskStartDateLocal <= endDate;
      console.log(`Task Start Time (Local): ${taskStartDateLocal.toISOString()}, Within Range: ${isWithinRange}`);
      return isWithinRange;
    }
    return false;
  });

  console.log(`Filtered Tasks: ${filteredTasks.length}`);
  filteredTasks.forEach(task => console.log(`Task ID: ${task.id}, Start Time: ${task.start_time}`, task.name));

  return filteredTasks;
};

const datesWithTasks = listOfDatesWithTasks(listOfTasks);

const getMarkedDates = () => {
  const marked = {};

  datesWithTasks.forEach((date) => {
    marked[date] = { marked: true, dotColor: 'black' };
  });

  if (selected) {
    marked[selected] = { ...marked[selected], selected: true, disableTouchEvent: true, selectedColor: 'green' };
  }

  return marked;
};

const markedDates = getMarkedDates();

  

/**********************************************************************************/
  useEffect(() => {
    fetchUserTasks();
  }, []);
  useEffect(() => {
    const newFilteredTasks = filterTasksByDate(listOfTasks, currentSpanIndex, selected);
    setFilteredTasks(newFilteredTasks);
  }, [listOfTasks, currentSpanIndex, selected]); // Add this useEffect hook
  
  

  
/**********************************************************************************/
  useFocusEffect(
    React.useCallback(() => {
      fetchUserTasks(); // Fetch tasks whenever the screen comes into focus
    }, [])
  );
/**********************************************************************************/
  const navigateToCreateTask = () => {
    navigation.navigate('CreateTask');
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
          // console.log("Task updated:", data);
          fetchUserTasks(); // Re-fetch tasks to update the list
      })
      .catch(error => console.error("Error updating task:", error));
  }
};



/**********************************************************************************/
  return (
    <View style={styles.outerContainer}>

      <View style={styles.container}>
        <View style={styles.headerSection}>
          <Text style={styles.headerText}>Petology</Text>
        </View>
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
              // borderWidth: 1,
              // borderColor: 'gray',
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
              console.log(day.dateString);
            }}
            // markedDates={{
            //   [selected]: {selected: true, disableTouchEvent: true, 
            //     selectedDotColor: 'DOES_NOTHING', selectedColor: 'blue'},
            //     datesWithTasks: { marked: true, dotColor: 'green'},
            //     // this should be replaced with a list object in YYYY-MM-DD format
            //     // that we will get from listOfDatesWithTasks
            //     '2024-02-15': { marked: true, dotColor: 'green'},

            // }}
            markedDates={markedDates}

          />
        </View>

         <View style={styles.taskHeaderSection}>
                <TouchableOpacity onPress={() => changeTimeSpan(-1)}>
                    <FontAwesome name="arrow-left" size={20} color="#000" />
                </TouchableOpacity>
                <Text style={styles.taskHeaderText}> {timespans[currentSpanIndex]} </Text>
                <TouchableOpacity onPress={() => changeTimeSpan(1)}>
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
  /******* Outer Container *******/
  outerContainer: {
    flex: 1,
    backgroundColor: '#92cdca',
    justifyContent: 'space-between', // This will push the footer to the bottom
  },
  /**********************************************************************************/

  /******* Main Container *******/
  container: {
    flex: 1,
    paddingTop: 40,
    paddingBottom: 10, // Add some bottom padding to separate the footer
    alignItems: 'center',
  },
  /**********************************************************************************/

  /******* Header Section *******/
  headerSection: {
    alignItems: 'center',
    height: 80,
    padding: 20,
  },
  headerText: {
    fontSize: 36,
    fontFamily: 'Cochin',
    opacity: 0.7,
  },
  /**********************************************************************************/

  /******* Calendar Header Section *******/
  calendarHeaderSection: {
    // borderColor: 'black',
    // borderWidth: 1,
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
  /**********************************************************************************/

  /******* Calendar Section *******/
  calendarSection: {
    width: '90%',
    // borderColor: 'black',
    // borderWidth: 1,
  },
  /**********************************************************************************/

  /******* Task Header Section *******/
  taskHeaderSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // borderColor: 'black',
    height: 40,
    width: '75%',
    // borderWidth: 1,
    // backgroundColor: 'gold',
  },
  taskHeaderText: {
    fontSize: 20,
  },
  /**********************************************************************************/

  /******* Task Section *******/
  taskSection: {
    flex: 1, // Allow the task section to grow and take remaining space
    width: '100%',
  },
  /**********************************************************************************/

  /******* Span Switcher Section *******/
  spanSwitcher: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  arrowButton: {
    padding: 10,
  },
  arrowButtonText: {
    fontSize: 16,
  },
  /**********************************************************************************/
});

export default CalendarScreen;
