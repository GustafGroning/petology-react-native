import AsyncStorage from "@react-native-async-storage/async-storage";

const updateUserNames = async (firstName, lastName) => {
  try {
    // Retrieve user token from AsyncStorage
    const token = await AsyncStorage.getItem('userToken');

    // Make a PUT request to update user names
    const response = await fetch(`${process.env.EXPO_PUBLIC_DEV_URL}/api/users/update/`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ firstName, lastName }), // Send first name and last name in the request body
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error('Failed to update user names');
    }
  } catch (error) {
    console.error('Error updating user names:', error);
    throw error;
  }
};

export default updateUserNames;
