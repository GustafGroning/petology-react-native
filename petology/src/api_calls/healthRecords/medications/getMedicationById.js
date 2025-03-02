import AsyncStorage from "@react-native-async-storage/async-storage";

const getMedicationById = async (medicationId) => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    const response = await fetch(`${process.env.EXPO_PUBLIC_DEV_URL}/api/health-records/medications/${medicationId}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      console.error("Failed to fetch medication");
      return null;
    }
  } catch (error) {
    console.error("Error fetching medication:", error);
    return null;
  }
};

export default getMedicationById;
