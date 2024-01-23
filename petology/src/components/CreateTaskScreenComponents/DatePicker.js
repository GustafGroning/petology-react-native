import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const DatePicker = ({ title, date, onDateTimeChange }) => {
    return (
      <View style={styles.container}>
        <Text style={styles.titleStyle}>{title}</Text>
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
    );
  };  

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    marginBottom: 25,
  },
  titleStyle: {
    fontSize: 22,
    fontFamily: 'Cochin',
  },
});

export default DatePicker;
