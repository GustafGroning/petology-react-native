import AsyncStorage from "@react-native-async-storage/async-storage";

const createDog = async (formData) => {
  try {
    const token = await AsyncStorage.getItem("userToken");

    const response = await fetch(`${process.env.EXPO_PUBLIC_DEV_URL}/api/dog/add/`, {
      method: "POST",
      headers: {
        Authorization: `JWT ${token}`,
      },
      body: formData,
    });

    if (response.ok) {
      // Handle successful dog registration
      const jsonResponse = await response.json();
      const newDogId = jsonResponse.dog_id;
      await AsyncStorage.setItem("selectedDogId", newDogId.toString()); // Store the new dog's ID
      return { success: true };
    } else {
      // Handle error in dog registration
      const errorData = await response.json();
      return { success: false, message: errorData.message || "Failed to create dog" };
    }
  } catch (error) {
    console.error(error);
    return { success: false, message: "An error occurred while creating the dog" };
  }
};

export default createDog;
