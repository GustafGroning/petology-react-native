import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';


const DatePicker = ({ title, date, onDateTimeChange }) => {

const defaultDate = new Date();
defaultDate.setHours(0, 0, 0, 0); // Sets hours, minutes, seconds, and milliseconds to 0

    return (
      <View style={styles.container}>
        <Text style={styles.titleStyle}>{title}</Text>
        <View style={styles.datePickerContainer}>
          <DateTimePicker
            value={date}
            mode="datetime"
            locale="sv-SE"
            onChange={(event, selectedDateTime) => {
              if (selectedDateTime) {
                onDateTimeChange(selectedDateTime); // Pass the selected date and time back to the parent component
              }
            }}
          />
        </View>
      </View>
    );
  };  

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center', // Align items vertically
    marginBottom: 25,
  },
  titleStyle: {
    fontSize: 22,
    fontFamily: 'Cochin',
    marginRight: 10, // Add margin to separate the title from the date picker
  },
  datePickerContainer: {
    flex: 1, // Take up remaining space
  },
});

export default DatePicker;
