import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Button } from 'react-native';

const Task = ({ taskName, startTime, notes, dogName }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleEdit = () => {
    // Implement editing functionality here
    console.log('Edit task');
    setIsModalVisible(false);
  };

  const handleDelete = () => {
    // Implement deleting functionality here
    console.log('Delete task');
    setIsModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleModal}>
        <Text style={styles.taskName}>{taskName}</Text>
      </TouchableOpacity>
      <Modal visible={isModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Task Details:</Text>
          <Text>Task Name: {taskName}</Text>
          <Text>Start Time: {startTime}</Text>
          <Text>Dog Name: {dogName}</Text>
          <Text>Notes: {notes}</Text>
          <Button title="Edit" onPress={handleEdit} />
          <Button title="Delete" onPress={handleDelete} />
          <Button title="Close" onPress={toggleModal} />
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
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default Task;
