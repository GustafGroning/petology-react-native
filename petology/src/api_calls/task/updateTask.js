import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = `${process.env.EXPO_PUBLIC_DEV_URL}/api/tasks/update/`;

const updateUserTask = async (task_id, data, method) => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    if (token) {
      const response = await fetch(`${API_URL}${task_id}/`, {
        method: method,
        headers: {
          Authorization: `JWT ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const updatedTask = await response.json();
        return updatedTask;
      } else {
        console.error(`Error updating task ${task_id}:`, response.status);
        return response.status;
      }
    } else {
      console.error("User token not found.");
      return null;
    }
  } catch (error) {
    console.error(`Error updating task ${task_id}:`, error);
    return error;
  }
};

const updateTask = async (task_id, data, partial = false) => {
  const method = partial ? "PATCH" : "PUT";
  return await updateUserTask(task_id, data, method);
};

export { updateTask };
