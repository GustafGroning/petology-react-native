import AsyncStorage from "@react-native-async-storage/async-storage";

const getUserFirstAndLastNames = async () => {
  try {
    // Retrieve user token from AsyncStorage
    const token = await AsyncStorage.getItem('userToken');
    const response = await fetch(`${process.env.EXPO_PUBLIC_DEV_URL}/api/users/get/names/`, {
      method: 'GET',
      headers: {
        Authorization: `JWT ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('response ', response);

    if (response.ok) {
      console.log('response okay!');

      // Check if response status is 204 (No Content)
      if (response.status === 204) {
        console.log('No content in response');
        return null; // or return any default value you want
      }

      const data = await response.json();
      console.log('data ', data);
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
