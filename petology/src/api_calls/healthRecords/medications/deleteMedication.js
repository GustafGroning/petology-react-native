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
      return { success: true };
    } else {
      const errorData = await response.json();
      return { success: false, message: errorData.message || "Failed to delete medication" };
    }
  } catch (error) {
    console.error("Error deleting medication:", error);
    return { success: false, message: "An error occurred while deleting the medication" };
  }
};

export default deleteMedication;
