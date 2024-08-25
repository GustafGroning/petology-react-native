import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Button,
  TextInput,
} from "react-native";
import { CheckBox, Icon } from "@rneui/themed";
import { deleteTask } from "../../../api_calls/task/deleteTask";
import { updateTask } from "../../../api_calls/task/updateTask";

const Task = ({
  taskId,
  taskName,
  location,
  notes,
  dogName,
  isCompleted,
  onCheckChange,
  onDeleteTask,
  onUpdateTask,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [check, setCheck] = useState(isCompleted); // Ensure check state reflects completion status
  const [editedTaskName, setEditedTaskName] = useState(taskName);
  const [editedLocation, setEditedLocation] = useState(location);
  const [editedNotes, setEditedNotes] = useState(notes);

  // Ensure that the local state reflects the props when they change
  useEffect(() => {
    setCheck(isCompleted);
  }, [isCompleted]);

  const saveChanges = async () => {
    const updatedTask = {
      id: taskId,
      name: editedTaskName,
      location: editedLocation,
      notes: editedNotes,
      dog: dogName,
    };
    const response = await updateTask(taskId, updatedTask);
    if (response && response.id) {
      onUpdateTask(taskId, response);
    } else {
      console.error("Error updating task:", response);
    }

    setIsModalVisible(false);
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleCheckboxPress = () => {
    const newCheckState = !check;
    setCheck(newCheckState); // Update local state
    onCheckChange(newCheckState); // Update parent component's state
  };

  const deleteTaskHandler = async () => {
    const success = await deleteTask(taskId);
    if (success) {
      onDeleteTask(taskId);
    } else {
      // Handle deletion failure
    }
    setIsModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity>
        <View style={styles.checkBoxContainer}>
          <CheckBox
            center
            checkedIcon={
              <Icon
                name="radio-button-checked"
                type="material"
                color="#5c6162"
                size={34}
              />
            }
            uncheckedIcon={
              <Icon
                name="radio-button-unchecked"
                type="material"
                color="#5c6162"
                size={34}
              />
            }
            checked={check}
            onPress={handleCheckboxPress}
            containerStyle={{
              backgroundColor: "transparent",
              justifyContent: "center",
            }}
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={toggleModal}>
        <View style={styles.textContainer}>
          <Text style={styles.taskName}>{taskName}</Text>
          {notes ? (
            <Text
              style={styles.taskNotes}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {dogName} - {notes}
            </Text>
          ) : (
            <Text
              style={styles.taskNotes}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {dogName}
            </Text>
          )}
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
            style={[styles.input, styles.notesInput]}
            placeholder="Notes"
            value={editedNotes}
            onChangeText={setEditedNotes}
            multiline={true}
            numberOfLines={4}
          />
          <Button title="Save" onPress={saveChanges} />
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={deleteTaskHandler}
          >
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
          <Button title="Cancel" onPress={toggleModal} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  taskName: {
    fontSize: 16,
    marginBottom: 5,
    top: 12,
  },
  taskNotes: {
    fontSize: 14,
    color: "#333",
    top: 12,
  },
  checkBoxContainer: {
  },
  textContainer: {
    flex: 1,
  },
  expandedContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 5,
  },
  modalContainer: {
    paddingTop: 100,
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  notesInput: {
    height: 100,
    textAlignVertical: "top", // Allows multiline text alignment
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dogName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  deleteButton: {
    backgroundColor: "red",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default Task;
