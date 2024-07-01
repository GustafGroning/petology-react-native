import AsyncStorage from "@react-native-async-storage/async-storage";

const updateCondition = async (conditionId, updatedData) => {
  console.log('Updated Condition Data:', updatedData);
  try {
    const token = await AsyncStorage.getItem("userToken");

    const response = await fetch(`${process.env.EXPO_PUBLIC_DEV_URL}/api/health-records/conditions/${conditionId}/update/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${token}`,
      },
      body: JSON.stringify(updatedData),
    });

    if (response.ok) {
      const responseData = await response.json();
      return responseData; // Return the updated condition object
    } else {
      const errorData = await response.json();
      console.error("Error data:", errorData);
      return { success: false, message: errorData.message || "Failed to update condition" };
    }
  } catch (error) {
    console.error("Error updating condition:", error);
    return { success: false, message: "An error occurred while updating the condition" };
  }
};

export default updateCondition;
