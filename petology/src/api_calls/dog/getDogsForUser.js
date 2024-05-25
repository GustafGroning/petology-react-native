import AsyncStorage from "@react-native-async-storage/async-storage";

const getDogsForUser = async () => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_DEV_URL}/api/dog/all/`,
      {
        headers: {
          Authorization: `JWT ${token}`,
        },
      },
    );
    const data = await response.json();

    if (response.ok && Array.isArray(data.dogs)) {
      const formattedDogs = data.dogs.map((dog) => ({
        id: dog.id,
        name: dog.name,
        breed: dog.breed,
        birthday: dog.birthday,
        sex: dog.sex,
        pedigree_name: dog.pedigree_name,
        color: dog.color,
        insurance_company: dog.insurance_company,
        insurance_number: dog.insurance_number,
        feed: dog.feed,
        possible_feed_intolerance: dog.possible_feed_intolerance,
        id_number: dog.id_number,
        registration_number: dog.registration_number,
        passport_number: dog.passport_number,
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

export default getDogsForUser;
