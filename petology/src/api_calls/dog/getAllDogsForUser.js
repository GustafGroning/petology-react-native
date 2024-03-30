import AsyncStorage from "@react-native-async-storage/async-storage";

const getAllDogsForUser = async () => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    const response = await fetch(`${process.env.EXPO_PUBLIC_DEV_URL}/api/dog/all/`, {
      headers: {
        Authorization: `JWT ${token}`,
      },
    });
    const data = await response.json();
    console.log("Response data:", data);

    if (response.ok && Array.isArray(data.dogs)) {
      const formattedDogs = data.dogs.map((dog) => ({
        label: dog.name,
        value: dog.id.toString(),
      }));
      return formattedDogs;
    } else {
      console.error("Failed to fetch dogs or 'dogs' is not an array");
      return [];
    }
  } catch (error) {
    console.error("Error fetching dogs:", error);
    return [];
  }
};

export default getAllDogsForUser;
