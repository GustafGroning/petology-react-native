import AsyncStorage from "@react-native-async-storage/async-storage";

const deleteMedication = async (medicationId) => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    const response = await fetch(`${process.env.EXPO_PUBLIC_DEV_URL}/api/health-records/medications/${medicationId}/delete/`, {
      method: "DELETE",
      headers: {
        Authorization: `JWT ${token}`,
      },
    });
    if (response.ok) {
      return true;
    } else {
      console.error("Failed to delete medication");
      return false;
    }
  } catch (error) {
    console.error("Error deleting medication:", error);
    return false;
  }
};

export default deleteMedication;
