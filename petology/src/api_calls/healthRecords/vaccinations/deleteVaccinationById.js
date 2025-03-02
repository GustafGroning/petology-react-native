import AsyncStorage from "@react-native-async-storage/async-storage";

const deleteVaccinationById = async (vaccinationId) => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    const response = await fetch(`${process.env.EXPO_PUBLIC_DEV_URL}/api/health-records/vaccinations/${vaccinationId}/delete/`, {
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
      return { success: false, message: errorData.message || "Failed to delete vaccination" };
    }
  } catch (error) {
    console.error("Error deleting vaccination:", error);
    return { success: false, message: "An error occurred while deleting the vaccination" };
  }
};

export default deleteVaccinationById;
