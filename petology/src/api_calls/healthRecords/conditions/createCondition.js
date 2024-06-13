import AsyncStorage from "@react-native-async-storage/async-storage";

const createCondition = async (dogId, name, onsetDate, followUpDate, vetClinic, notes, medicationId = null) => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    const formattedOnsetDate = `${onsetDate.getFullYear()}-${onsetDate.getMonth() + 1}-${onsetDate.getDate()}`;
    const formattedFollowUpDate = followUpDate ? `${followUpDate.getFullYear()}-${followUpDate.getMonth() + 1}-${followUpDate.getDate()}` : null;

    const response = await fetch(`${process.env.EXPO_PUBLIC_DEV_URL}/api/conditions/create/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${token}`,
      },
      body: JSON.stringify({
        dog: dogId,
        name: name,
        onset_date: formattedOnsetDate,
        follow_up_date: formattedFollowUpDate,
        vet_clinic: vetClinic,
        notes: notes,
        medication: medicationId,
      }),
    });

    if (response.ok) {
      return { success: true };
    } else {
      const errorData = await response.json();
      return { success: false, message: errorData.message || "Failed to create condition" };
    }
  } catch (error) {
    console.error("Error creating condition:", error);
    return { success: false, message: "An error occurred while creating the condition" };
  }
};

export default createCondition;
