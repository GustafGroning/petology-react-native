import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CheckBox, Icon } from '@rneui/themed';

const Task = ({ taskName, startTime, notes, dogName, isCompleted, onCheckChange }) => {
/**********************************************************************************/
    const [check, setCheck] = useState(isCompleted);
/**********************************************************************************/
const [expanded, setExpanded] = useState(false);

const toggleExpanded = () => {
    setExpanded(!expanded);
};

/**********************************************************************************/
    const formatStartTime = (time) => {
        const date = new Date(time);
        return date.toLocaleString();
    };
/**********************************************************************************/
    const extractTimeFromStartTime = (time) => {
        const date = new Date(time);
        let hours = date.getHours();
        let minutes = date.getMinutes();
    
        // Format hours and minutes to always be two digits
        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
    
        return `${hours}:${minutes}`;
    };
/**********************************************************************************/
const handleCheckboxPress = () => {
    setCheck(!check);
    onCheckChange(!check); // Call the function passed from parent component
};
/**********************************************************************************/
const CollapsedView = () => (
    <View style={styles.container}>
        <View style={styles.checkBoxContainer}> 
            <CheckBox
                center
                checkedIcon={<Icon name="radio-button-checked" type="material" color="black" size={30} />}
                uncheckedIcon={<Icon name="radio-button-unchecked" type="material" color="black" size={30} />}
                checked={check}
                onPress={handleCheckboxPress}
                containerStyle = {{backgroundColor: '#92cdca', justifyContent: 'center'}}
            />
        </View>
        <View style={styles.textContainer}> 
            <Text style={styles.taskName}>{taskName}</Text>
            <Text style={styles.taskNotes} numberOfLines={1} ellipsizeMode='tail'>
                {dogName} - {notes}
            </Text>
        </View>
        <View style={styles.timeContainer}> 
            <Text style={styles.startTime}> Klockan {extractTimeFromStartTime(startTime)}</Text>
        </View>
    </View>
);

const ExpandedView = () => (
    <View style={styles.expandedContainer}>
        <Text style={styles.taskName}>{taskName}</Text>
        <Text>{`Start Time: ${formatStartTime(startTime)}`}</Text>
        <Text>{`Dog Name: ${dogName}`}</Text>
        <Text>{`Notes: ${notes}`}</Text>
        {/* Add more details as needed */}
    </View>
);
/**********************************************************************************/
return (
    <TouchableOpacity onPress={toggleExpanded} activeOpacity={0.9}>
        {expanded ? <ExpandedView /> : <CollapsedView />}
    </TouchableOpacity>
);
};
/**********************************************************************************/
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 3,
        borderWidth: 1,
        borderRadius: 10,
        // borderBottomColor: '#ddd',
        backgroundColor: '#92cdca',
        alignItems: 'center', // Align items vertically in the center
        marginBottom: 8,
    },
    taskName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    taskNotes: {
        fontSize: 13,
        overflow: 'hidden',
        // textOverflow: 'ellipsis',
        maxWidth: '90%',
    },
    startTime: {
        fontSize: 14,
        color: '#666',
    },
    checkBoxContainer: {
        // justifyContent: 'center', // Center the checkbox vertically
        // borderColor: 'black',
        // borderWidth: 1,
        // paddingHorizontal: 5, // Add some horizontal padding
        // marginRight: 5, // Space between checkbox and text
    },
    textContainer: {
        flexDirection: 'column',
        width: 75,
        flex: 2, // Take available space
    },
    timeContainer: {
        alignItems: 'flex-end',
        flex: 1,
    },
});


export default Task;
