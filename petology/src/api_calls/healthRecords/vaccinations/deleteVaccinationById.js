import AsyncStorage from "@react-native-async-storage/async-storage";

const deleteVaccinationById = async (vaccinationId) => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    const response = await fetch(`${process.env.EXPO_PUBLIC_DEV_URL}/api/vaccination/delete/${vaccinationId}/`, {
      method: "DELETE",
      headers: {
        Authorization: `JWT ${token}`,
      },
    });

    if (response.ok) {
      return { success: true };
    } else {
      const errorData = await response.json();
      return { success: false, message: errorData.message || "Failed to delete vaccination" };
    }
  } catch (error) {
    console.error("Error deleting vaccination:", error);
    return { success: false, message: "An error occurred while deleting the vaccination" };
  }
};

export default deleteVaccinationById;
