import AsyncStorage from "@react-native-async-storage/async-storage";

const getDogById = async (dogId) => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    const response = await fetch(`${process.env.EXPO_PUBLIC_DEV_URL}/api/dog/get/${dogId}/`, {
      headers: {
        Authorization: `JWT ${token}`,
      },
    });
    const data = await response.json();
    console.log("Response data:", data);

    if (response.ok) {
      const dogData = {
        id: data.id,
        name: data.name,
        breed: data.breed,
        birthday: data.birthday,
        sex: data.sex
      };
      return dogData;
    } else {
      console.error("Failed to fetch dog");
      return null;
    }
  } catch (error) {
    console.error("Error fetching dog:", error);
    return null;
  }
};

export default getDogById;
