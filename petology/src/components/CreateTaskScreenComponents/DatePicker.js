import {React, useState} from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ImageBackground } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const DatePicker = ({ title, date, time, onDateChange, onTimeChange }) => {
/**********************************************************************************/
    // const [startDate, setStartDate] = useState(new Date());
    // const [startTime, setStartTime] = useState(new Date(new Date().setHours(4, 0, 0, 0)))

    // const [stopDate, setStopDate] = useState(new Date()); 
    // const [stopTime, setStopTime] = useState(new Date(new Date().setHours(0, 0, 0, 0)))
/**********************************************************************************/
    return (
        <View style={styles.container}>
            <View style={styles.textContainer}> 
                <Text style={styles.titleStyle}> {title} </Text>
            </View>
            <View style={styles.dateContainer}>
            <DateTimePicker
                value={date}
                mode="date"
                locale="sv-SE"
                onChange={(event, selectedDate) => onDateChange(selectedDate)}
            />
            <DateTimePicker
                value={time}
                mode="time"
                locale="sv-SE"
                onChange={(event, selectedTime) => onTimeChange(selectedTime)}
            />
            </View> 
        </View>
    );
  };
/**********************************************************************************/
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 25,
    },
    titleStyle: {
        fontSize: 22,
        fontFamily: "Cochin",
    },
    textContainer: {
    },
    dateContainer: {
        flexDirection: 'row',
    },
});

export default DatePicker;
