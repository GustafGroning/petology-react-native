import AsyncStorage from "@react-native-async-storage/async-storage";

const getAllHealthIndexRowForDog = async (dogId) => {
  try {
    console.log('sending token');
    const token = await AsyncStorage.getItem("userToken");
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_DEV_URL}/api/health-index/dog/get/all/${dogId}/`,
      {
        headers: {
          Authorization: `JWT ${token}`,
        },
      },
    );
    console.log('response ', response);
    const data = await response.json();

    if (response.ok && Array.isArray(data)) {
      const formattedRows = data.map((row) => ({
        id: row.id,
        name: row.dog_name,
        latest_run_batch_id: row.latest_run_batch_id,
        batches_in_row: row.batches_in_row,
        date_performed: row.date_performed,
        general_condition: row.general_condition,
        dental_health: row.dental_health,
        eyes: row.eyes,
        skin_and_coat: row.skin_and_coat,
        locomotor_system: row.locomotor_system,
        other: row.other,
      }));
      return formattedRows;
    } else {
      console.error("Failed to fetch dog health rows");
      return null;
    }
  } catch (error) {
    console.error("Error fetching dog:", error);
    return null;
  }
};

export default getAllHealthIndexRowForDog;
