import AsyncStorage from "@react-native-async-storage/async-storage";

const createVaccination = async (dogId, name, vaccination_detailed_name, vaccinationDate, nextVaccinationDate, clinicName, notes) => {
  console.log('inside API call!');
  try {
    const token = await AsyncStorage.getItem("userToken");
    const formattedVaccinationDate = vaccinationDate;  // Use already formatted date
    const formattedNextVaccinationDate = nextVaccinationDate ? nextVaccinationDate : null;

    const response = await fetch(`${process.env.EXPO_PUBLIC_DEV_URL}/api/health-records/vaccinations/create/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${token}`,
      },
      body: JSON.stringify({
        dog: dogId,
        name: name,
        vaccination_detailed_name: vaccination_detailed_name,
        vaccination_date: formattedVaccinationDate,
        next_vaccination_date: formattedNextVaccinationDate,
        clinic_name: clinicName,
        notes: notes,
      }),
    });

    if (response.ok) {
      return { success: true };
    } else {
      const errorData = await response.json();
      return { success: false, message: errorData.message || "Failed to create vaccination" };
    }
  } catch (error) {
    console.error("Error creating vaccination:", error);
    return { success: false, message: "An error occurred while creating the vaccination" };
  }
};

export default createVaccination;
