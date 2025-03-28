import AsyncStorage from "@react-native-async-storage/async-storage";

const getDogById = async (dogId) => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    const response = await fetch(`${process.env.EXPO_PUBLIC_DEV_URL}/api/dog/get/${dogId}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    if (response.ok) {
      const dogData = {
        id: data.id,
        name: data.name,
        breed: data.breed,
        birthday: data.birthday,
        sex: data.sex,
        pedigree_name: data.pedigree_name,
        color: data.color,
        insurance_company: data.insurance_company,
        insurance_number: data.insurance_number,
        feed: data.feed,
        possible_feed_intolerance: data.possible_feed_intolerance,
        id_number: data.id_number,
        registration_number: data.registration_number,
        passport_number: data.passport_number
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
