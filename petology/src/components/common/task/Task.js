// Components
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Button, TextInput } from 'react-native';
import { CheckBox, Icon } from '@rneui/themed';
import DatePicker from '../../CreateTaskScreenComponents/DatePicker';
// APIs
import { deleteTask } from '../../../api_calls/task/deleteTask';
import { updateTask } from '../../../api_calls/task/updateTask';



const Task = ({ taskId, taskName, startTime, notes, dogName, isCompleted, onCheckChange, onDeleteTask }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [check, setCheck] = useState(isCompleted);
  const [editedTaskName, setEditedTaskName] = useState(taskName);
  const [editedLocation, setEditedLocation] = useState('');
  const [editedNotes, setEditedNotes] = useState(notes);

  const saveChanges = async () => {
    // Construct the updated task object with the edited fields
    console.log('taskId in saveChanges ', taskId);
    const updatedTask = {
      id: taskId,
      name: editedTaskName,
      location: editedLocation,
      notes: editedNotes,
      // Add other fields here if needed
    };

    // Call the updateTask API with the updated task object
    const response = await updateTask(taskId, updatedTask);
    if (response.ok) {
      // Handle success if needed
    } else {
      // Handle error if needed
    }

    // Close the modal
    setIsModalVisible(false);
  };

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
            containerStyle={{ backgroundColor: '#92cdca', justifyContent: 'center' }}
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
          <TextInput
            style={[styles.input, styles.notesInput]} // Apply styles for multiline input
            placeholder="Notes"
            value={editedNotes}
            onChangeText={setEditedNotes}
            multiline={true} // Enable multiline
            numberOfLines={4} // Set the maximum number of lines
          />
          <Button title="Save" onPress={saveChanges} />
          <Button title="Cancel" onPress={toggleModal} />
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