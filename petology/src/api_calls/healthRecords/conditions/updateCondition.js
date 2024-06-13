import AsyncStorage from "@react-native-async-storage/async-storage";

const updateCondition = async (conditionId, updatedData) => {
  try {
    const token = await AsyncStorage.getItem("userToken");

    const response = await fetch(`${process.env.EXPO_PUBLIC_DEV_URL}/api/conditions/${conditionId}/update/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${token}`,
      },
      body: JSON.stringify(updatedData),
    });

    if (response.ok) {
      return { success: true };
    } else {
      const errorData = await response.json();
      return { success: false, message: errorData.message || "Failed to update condition" };
    }
  } catch (error) {
    console.error("Error updating condition:", error);
    return { success: false, message: "An error occurred while updating the condition" };
  }
};

export default updateCondition;
