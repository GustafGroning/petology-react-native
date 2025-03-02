import AsyncStorage from "@react-native-async-storage/async-storage";

const saveToothbrushing = async (dogId, newToothbrushingData) => {
  try {
    const token = await AsyncStorage.getItem("userToken");

    const response = await fetch(
      `${process.env.EXPO_PUBLIC_DEV_URL}/api/health-index/toothbrushing/save/${dogId}/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newToothbrushingData),
      }
    );

    if (response.ok) {
      // Handle successful save
      const jsonResponse = await response.json();
      return { success: true, data: jsonResponse };
    } else {
      // Handle error in saving the data
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.message || "Failed to save toothbrushing data",
      };
    }
  } catch (error) {
    console.error(error);
    return { success: false, message: "An error occurred while saving the toothbrushing data" };
  }
};

export default saveToothbrushing;
