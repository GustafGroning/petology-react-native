import AsyncStorage from "@react-native-async-storage/async-storage";

const getVaccinationsForDog = async (dogId) => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    const response = await fetch(`${process.env.EXPO_PUBLIC_DEV_URL}/api/health-records/vaccinations/dog/${dogId}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.text(); // Use text() to read the response body as a string
      console.error("Failed to fetch vaccinations", errorData);
      return [];
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching vaccinations:", error);
    return [];
  }
};

export default getVaccinationsForDog;
