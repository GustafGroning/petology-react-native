import React from 'react';
import { View, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const PetologyDatePicker = ({ date, onDateTimeChange }) => {
  return (
    <View style={styles.container}>
      <View style={styles.datePickerContainer}>
        <DateTimePicker
          value={date}
          mode="date"
          locale="sv-SE"
          onChange={(event, selectedDateTime) => {
            if (selectedDateTime) {
              onDateTimeChange(selectedDateTime); // Pass back to the parent component
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
    width: '90%', // Match the width of other input fields
    alignSelf: 'center',
  },
  datePickerContainer: {
    flex: 1, // Take up remaining space
  },
});

export default PetologyDatePicker;
