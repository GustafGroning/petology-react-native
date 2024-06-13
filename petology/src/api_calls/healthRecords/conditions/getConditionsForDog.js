import AsyncStorage from "@react-native-async-storage/async-storage";

const getConditionsForDog = async (dogId) => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    const response = await fetch(`${process.env.EXPO_PUBLIC_DEV_URL}/api/conditions/dog/${dogId}/`, {
      headers: {
        Authorization: `JWT ${token}`,
      },
    });
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      console.error("Failed to fetch conditions");
      return [];
    }
  } catch (error) {
    console.error("Error fetching conditions:", error);
    return [];
  }
};

export default getConditionsForDog;
