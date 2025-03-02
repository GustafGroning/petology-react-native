import AsyncStorage from "@react-native-async-storage/async-storage";

const createMedication = async (medicationData) => {
  try {
    const token = await AsyncStorage.getItem("userToken");

    const formatDate = (date) => {
      if (!date) return null;
      const d = new Date(date);
      const month = `${d.getMonth() + 1}`.padStart(2, '0');
      const day = `${d.getDate()}`.padStart(2, '0');
      return `${d.getFullYear()}-${month}-${day}`;
    };

    const formattedMedicationData = {
      ...medicationData,
      administration_start_date: formatDate(medicationData.administration_start_date),
      administration_length: formatDate(medicationData.administration_length),
    };

    console.log('medicationData ', formattedMedicationData);

    const response = await fetch(`${process.env.EXPO_PUBLIC_DEV_URL}/api/health-records/medications/create/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formattedMedicationData),
    });

    const data = await response.json();
    console.log('inside createMedication, seeing data ', data);
    if (response.ok) {
      return data;
    } else {
      console.error("Failed to create medication", data);
      return null;
    }
  } catch (error) {
    console.error("Error creating medication:", error);
    return null;
  }
};

export default createMedication;
