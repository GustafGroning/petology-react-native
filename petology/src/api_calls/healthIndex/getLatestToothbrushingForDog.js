import AsyncStorage from "@react-native-async-storage/async-storage";

const getLatestToothbrushingForDog = async (dogId) => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_DEV_URL}/api/health-index/toothbrushing/latest/${dogId}/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      console.log('responde correct ', data);
      const dogLatestToothbrushing = {
        dog_id: data.dog,
        date_performed: data.date_performed,
        streak: data.streak,
      };
      return dogLatestToothbrushing;
    } else if (response.status === 404) {
      return null;
    } else {
      console.log("Failed to fetch dog's latest toothbrushing data");
      return null;
    }
  } catch (error) {
    console.log("Error fetching dog's latest toothbrushing data:", error);
    return null;
  }
};

export default getLatestToothbrushingForDog;
