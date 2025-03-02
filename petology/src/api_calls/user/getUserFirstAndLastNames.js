import AsyncStorage from '@react-native-async-storage/async-storage';

const getUserFirstAndLastNames = async () => {
  try {
    // Retrieve user token from AsyncStorage
    const token = await AsyncStorage.getItem('userToken');
    const response = await fetch(`${process.env.EXPO_PUBLIC_DEV_URL}/api/users/get/names/`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      // Check if response status is 204 (No Content)
      if (response.status === 204) {
        return null; // or return any default value you want
      }

      const data = await response.json();
      return data;
    } else {
      throw new Error('Failed to get first and last names');
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export default getUserFirstAndLastNames;
