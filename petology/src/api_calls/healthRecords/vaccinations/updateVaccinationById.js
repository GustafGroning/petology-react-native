import AsyncStorage from "@react-native-async-storage/async-storage";

const updateVaccinationById = async (vaccinationId, updatedData) => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    const response = await fetch(`${process.env.EXPO_PUBLIC_DEV_URL}/api/health-records/vaccinations/${vaccinationId}/update/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${token}`,
      },
      body: JSON.stringify(updatedData),
    });

    if (response.ok) {
      return await response.json();
    } else {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update vaccination");
    }
  } catch (error) {
    console.error("Error updating vaccination:", error);
    throw error;
  }
};

export default updateVaccinationById;
