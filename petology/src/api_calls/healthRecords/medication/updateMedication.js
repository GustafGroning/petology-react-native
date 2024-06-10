import AsyncStorage from "@react-native-async-storage/async-storage";

const updateMedication = async (medicationId, updatedData) => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    const response = await fetch(`${process.env.EXPO_PUBLIC_DEV_URL}/api/health-records/medications/${medicationId}/update/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${token}`,
      },
      body: JSON.stringify(updatedData),
    });
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      console.error("Failed to update medication");
      return null;
    }
  } catch (error) {
    console.error("Error updating medication:", error);
    return null;
  }
};

export default updateMedication;
