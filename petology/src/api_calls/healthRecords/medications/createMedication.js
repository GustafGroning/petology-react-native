import AsyncStorage from "@react-native-async-storage/async-storage";

const createMedication = async (medicationData) => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    const response = await fetch(`${process.env.EXPO_PUBLIC_DEV_URL}/api/health-records/medications/create/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${token}`,
      },
      body: JSON.stringify(medicationData),
    });
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      console.error("Failed to create medication");
      return null;
    }
  } catch (error) {
    console.error("Error creating medication:", error);
    return null;
  }
};

export default createMedication;
