import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Button, TextInput } from 'react-native';
import { deleteTask } from '../../../api_calls/task/deleteTask';
import { CheckBox, Icon } from '@rneui/themed';
import DatePicker from '../../CreateTaskScreenComponents/DatePicker';
import { SelectList } from 'react-native-dropdown-select-list';

const Task = ({ taskId, taskName, startTime, notes, dogName, isCompleted, onCheckChange, onDeleteTask }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [check, setCheck] = useState(isCompleted);
  const [editedTaskName, setEditedTaskName] = useState(taskName);
  const [editedLocation, setEditedLocation] = useState('');
  const [editedNotes, setEditedNotes] = useState('');

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleCheckboxPress = () => {
    const newCheckState = !check;
    setCheck(newCheckState);
    onCheckChange(newCheckState); // Call the function passed from parent component
  };

  const handleTaskPress = () => {
    toggleModal(); // Toggles modal visibility
  };

  const handleEdit = () => {
    // Implement editing functionality here
    console.log('Edit task');
    setIsModalVisible(false);
  };

  const deleteTaskHandler = async () => {
    const success = await deleteTask(taskId);
    if (success) {
      // Call the onDeleteTask callback function passed from the parent component
      onDeleteTask(taskId);
    } else {
      // Handle deletion failure
    }
    setIsModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleCheckboxPress}>
        <View style={styles.checkBoxContainer}> 
          <CheckBox
            center
            checkedIcon={<Icon name="radio-button-checked" type="material" color="black" size={30} />}
            uncheckedIcon={<Icon name="radio-button-unchecked" type="material" color="black" size={30} />}
            checked={check}
            containerStyle = {{backgroundColor: '#92cdca', justifyContent: 'center'}}
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={toggleModal}>
        <View style={styles.textContainer}> 
          <Text style={styles.taskName}>{taskName}</Text>
          <Text style={styles.taskNotes} numberOfLines={1} ellipsizeMode='tail'>
            {dogName} - {notes}
          </Text>
        </View>
      </TouchableOpacity>
      <Modal visible={isModalVisible} animationType="slide">
  <View style={styles.modalContainer}>
    <Text style={styles.dogName}>{dogName}</Text>
    <TextInput
      style={styles.input}
      placeholder="Task Name"
      value={editedTaskName}
      onChangeText={setEditedTaskName}
    />
    <TextInput
      style={styles.input}
      placeholder="Location"
      value={editedLocation}
      onChangeText={setEditedLocation}
    />
    <DatePicker
      title="Start Date"
      date={new Date()} // Provide the appropriate date
      onDateTimeChange={(date) => console.log(date)} // Implement the function to handle date change
    />
    <TextInput
      style={[styles.input, styles.notesInput]}
      placeholder="Notes"
      value={editedNotes}
      onChangeText={setEditedNotes}
    />
    <View style={styles.modalButtons}>
      <Button mode="contained" title="Edit" onPress={handleEdit} style={styles.addButtonStyle} />
      <Button mode="contained" title="Delete" onPress={deleteTaskHandler} style={styles.addButtonStyle} />
      <Button mode="contained" title="Close" onPress={toggleModal} style={styles.addButtonStyle} />
    </View>
  </View>
</Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#92cdca',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  taskNotes: {
    fontSize: 14,
    color: '#333',
  },
  checkBoxContainer: {
    marginRight: 10,
    backgroundColor: '#92cdca',
  },
  textContainer: {
    flex: 1,
  },
  expandedContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginTop: 5,
  },
  modalContainer: {
    paddingTop: 100,
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  notesInput: {
    height: 100,
    textAlignVertical: 'top', // Allows multiline text alignment
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dogName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  }
});


export default Task;
