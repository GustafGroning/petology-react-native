import AsyncStorage from "@react-native-async-storage/async-storage";

const deleteTask = async (taskId) => {
    console.log('inside UTILS');
    console.log(taskId);

    try {
      const token = await AsyncStorage.getItem("userToken");
      if (token) {
        const response = await fetch(`${process.env.EXPO_PUBLIC_DEV_URL}/api/tasks/delete/${taskId}/`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (response.ok) {
          // Deletion successful
          return true;
        } else {
          console.error('Failed to delete task');
          // Handle error cases
          return false;
        }
      } else {
        console.error("User token not found.");
        return false;
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      // Handle network errors
      return false;
    }
  };
  
  export { deleteTask };
