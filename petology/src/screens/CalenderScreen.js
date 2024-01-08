import React from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import Footer from '../components/common/Footer';

const CalendarScreen = ({ navigation }) => {

/**********************************************************************************/
  const navigateToCreateTask = () => {
    navigation.navigate('CreateTask');
  };
/**********************************************************************************/

  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <Text style={styles.headerText}> Petology </Text>
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
    borderWidth: 1,
    borderColor: 'gray',
    height: 350,
    backgroundColor: "#92cdca",
  }}
  theme={{
    backgroundColor: "#92cdca",
    calendarBackground: "#92cdca",
    monthTextColor: "white",
    textSectionTitleColor: "white",
    selectedDayBackgroundColor: "#558b2f",
    todayTextColor: "#ff5722",
    dayTextColor: "white",
    // Add more theme properties as needed
  }}
  // ...other props
/>


      </View>

      <View style={styles.taskHeaderSection}>
        <Text style={styles.taskHeaderText}>Your Tasks</Text>
      </View>

      <View style={styles.taskSection}>
        {/* Task items will be displayed here */}
        <Text>Tasks will be listed here</Text>
      </View>

      <Button 
        title="Go to Landing" 
        onPress={() => navigation.navigate('Landing')} 
      />
      <Footer navigation={navigation}/>
    </View>
  );
};

const styles = StyleSheet.create({
/**********************************************************************************/
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: "#92cdca",
  },
/**********************************************************************************/
  headerSection: {
    flex: 1,
    alignItems: "center",
    height: 80,
    padding: 20,
    borderColor: "black",
    borderWidth: 1,
  },
  headerText: {
    fontSize: 36,
    fontFamily: "Cochin",
    opacity: 0.7,
  },
/**********************************************************************************/
  calendarHeaderSection: {
    borderColor: "black",
    borderWidth: 1,
    width: '100%',
    height: 40,
    // backgroundColor: 'gold',
    justifyContent: 'center',
  },
  addTaskButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
    borderRadius: 14, // Half of width/height to make it round
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
  calendarSection: {
    flex: 3, // Adjust this as needed to give more space to the calendar
    width: '90%', // Ensure the calendar takes the full width
    borderColor: "black",
    borderWidth: 1,
  },
  taskHeaderSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: "black",
    borderWidth: 1,
  },
  taskHeaderText: {
    fontSize: 20,
  },
  taskSection: {
    flex: 2, // Adjust based on how much space you want for tasks
    width: '100%', // Ensure the tasks section takes the full width
    borderColor: "black",
    borderWidth: 1,
  },
/**********************************************************************************/
});

export default CalendarScreen;
