import AsyncStorage from "@react-native-async-storage/async-storage";
const getTasksForDog = async (dogId) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${process.env.EXPO_PUBLIC_DEV_URL}/api/tasks/get/dog/${dogId}/`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        throw new Error('Failed to fetch tasks for the dog');
      }
    } catch (error) {
      console.error('Error fetching tasks for the dog:', error);
      throw error;
    }
  };
  
  export default getTasksForDog;
  