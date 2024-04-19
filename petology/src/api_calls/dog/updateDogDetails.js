import AsyncStorage from "@react-native-async-storage/async-storage";

const updateDog = async (dogId, updatedFields) => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    const response = await fetch(`${process.env.EXPO_PUBLIC_DEV_URL}/api/dog/update/${dogId}/`, {
      method: 'PUT', // Use PUT method to update all fields
      headers: {
        Authorization: `JWT ${token}`,
        'Content-Type': 'application/json', // Specify the content type as JSON
      },
      body: JSON.stringify(updatedFields), // Send the updated fields as JSON string
    });
    
    if (response.ok) {
      console.log("Dog updated successfully");
      return true; // Indicate success
    } else {
      console.error("Failed to update dog");
      return false; // Indicate failure
    }
  } catch (error) {
    console.error("Error updating dog:", error);
    return false; // Indicate failure
  }
};

const partialUpdateDog = async (dogId, updatedFields) => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    const response = await fetch(`${process.env.EXPO_PUBLIC_DEV_URL}/api/dog/partial-update/${dogId}/`, {
      method: 'PATCH', // Use PATCH method to partially update specific fields
      headers: {
        Authorization: `JWT ${token}`,
        'Content-Type': 'application/json', // Specify the content type as JSON
      },
      body: JSON.stringify(updatedFields), // Send the updated fields as JSON string
    });
    
    if (response.ok) {
      console.log("Dog partially updated successfully");
      return true; // Indicate success
    } else {
      console.error("Failed to partially update dog");
      return false; // Indicate failure
    }
  } catch (error) {
    console.error("Error partially updating dog:", error);
    return false; // Indicate failure
  }
};

export { updateDog, partialUpdateDog };
