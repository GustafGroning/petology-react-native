import AsyncStorage from "@react-native-async-storage/async-storage";

const partialUpdateMedication = async (medicationId, updatedData) => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    const response = await fetch(`${process.env.EXPO_PUBLIC_DEV_URL}/api/health-records/medications/${medicationId}/partial_update/`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    });
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      console.error("Failed to partial update medication");
      return null;
    }
  } catch (error) {
    console.error("Error partial updating medication:", error);
    return null;
  }
};

export default partialUpdateMedication;
