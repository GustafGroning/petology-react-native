import AsyncStorage from "@react-native-async-storage/async-storage";

const deleteCondition = async (conditionId) => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    const response = await fetch(`${process.env.EXPO_PUBLIC_DEV_URL}/api/health-records/conditions/${conditionId}/delete/`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      return { success: true };
    } else {
      const errorData = await response.json();
      return { success: false, message: errorData.message || "Failed to delete condition" };
    }
  } catch (error) {
    console.error("Error deleting condition:", error);
    return { success: false, message: "An error occurred while deleting the condition" };
  }
};

export default deleteCondition;
