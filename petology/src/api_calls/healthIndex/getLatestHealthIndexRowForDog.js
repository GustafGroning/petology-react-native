import AsyncStorage from "@react-native-async-storage/async-storage";

const getLatestHealthIndexRowForDog = async (dogId) => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_DEV_URL}/api/health-index/dog/get/${dogId}/`,
      {
        headers: {
          Authorization: `JWT ${token}`,
        },
      },
    );
    const data = await response.json();
    if (response.ok) {
      const dogLatestHealthRow = {
        id: data.id,
        name: data.dog_name,
        latest_run_batch_id: data.latest_run_batch_id,
        batches_in_row: data.batches_in_row,
        date_performed: data.date_performed,
        general_condition: data.general_condition,
        dental_health: data.dental_health,
        eyes: data.eyes,
        skin_and_coat: data.skin_and_coat,
        locomotor_system: data.locomotor_system,
        other: data.other, 
      };
      return dogLatestHealthRow;
    } else {
      console.log("Failed to fetch dog health rows");
      return null;
    }
  } catch (error) {
    console.log("Error fetching dog health row:", error);
    return null;
  }
};

export default getLatestHealthIndexRowForDog;
