import AsyncStorage from "@react-native-async-storage/async-storage";

const getMedicationsForDog = async (dogId) => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    const response = await fetch(`${process.env.EXPO_PUBLIC_DEV_URL}/api/health-records/medications/dog/${dogId}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      console.error("Failed to fetch medications");
      return [];
    }
  } catch (error) {
    console.error("Error fetching medications:", error);
    return [];
  }
};

export default getMedicationsForDog;
