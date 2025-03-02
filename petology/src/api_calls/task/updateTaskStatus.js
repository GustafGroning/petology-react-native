import AsyncStorage from '@react-native-async-storage/async-storage';

const updateTaskStatus = async (taskId, completed, fetchAndUpdateTasks) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_DEV_URL}/api/tasks/patch/${taskId}/`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ completed }),
        },
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      if (fetchAndUpdateTasks) {
        fetchAndUpdateTasks();
      }
    } else {
      throw new Error('User token not found.');
    }
  } catch (error) {
    console.error('Error updating task:', error);
  }
};

export default updateTaskStatus;
