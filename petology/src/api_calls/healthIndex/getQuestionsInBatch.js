import AsyncStorage from "@react-native-async-storage/async-storage";

const getQuestionsInBatch = async (batchId) => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    const response = await fetch(`${process.env.EXPO_PUBLIC_DEV_URL}/api/health-index/batch/get/${batchId}/`, {
      headers: {
        Authorization: `JWT ${token}`,
      },
    });
    const data = await response.json();
    if (response.ok) {
      return data;  // Assuming data is an array of questions with their responses
    } else {
      console.log("Failed to fetch questions in batch");
      return null;
    }
  } catch (error) {
    console.error("Error fetching questions in batch:", error);
    return null;
  }
};

export default getQuestionsInBatch;
