import AsyncStorage from "@react-native-async-storage/async-storage";

const createCondition = async (dogId, name, onsetDate, followUpDate, vetClinic, notes, medicationId) => {
  console.log('inside API ', dogId, name, onsetDate, followUpDate, vetClinic, notes, medicationId);
  try {
    const token = await AsyncStorage.getItem("userToken");
    const formatDate = (date) => {
      if (!date) return null;
      const d = new Date(date);
      const month = `${d.getMonth() + 1}`.padStart(2, '0');
      const day = `${d.getDate()}`.padStart(2, '0');
      return `${d.getFullYear()}-${month}-${day}`;
    };

    const formattedOnsetDate = formatDate(onsetDate);
    const formattedFollowUpDate = followUpDate ? formatDate(followUpDate) : null;

    console.log('dogId within API ', dogId.dog);
    console.log('Name within API ', name);
    const payload = {
      dog: dogId,
      name: name,
      onset_date: formattedOnsetDate,
      follow_up_date: formattedFollowUpDate,
      vet_clinic: vetClinic || '',
      notes: notes || '',
      medication: medicationId || null,
    };

    console.log('Payload: INSIDE CREATE CONDITION API CALL', payload);  // Log the payload being sent

    const response = await fetch(`${process.env.EXPO_PUBLIC_DEV_URL}/api/health-records/conditions/create/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response from server:", errorText);
      throw new Error(`Server responded with status ${response.status}`);
    }

    const responseData = await response.json();
    return { success: true, data: responseData };

  } catch (error) {
    console.error("Error creating condition:", error);
    return { success: false, message: error.message || "An error occurred while creating the condition" };
  }
};

export default createCondition;
