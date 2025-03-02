import AsyncStorage from "@react-native-async-storage/async-storage";

const getAllBreeds = async () => {
    try {
        const token = await AsyncStorage.getItem("userToken");
        const response = await fetch(`${process.env.EXPO_PUBLIC_DEV_URL}/api/dog/breeds/`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          const data = await response.json();
          if(response.ok){
            console.log('breeds fetch: ', data);
            return {success: true, data};
          } else {
            const errorData = await response.json();
            return { success: false, message: errorData.message || "Failed to fetch breeds" };
          }
    } catch (error) {
        console.error(error);
        return { success: false, message: "An error occurred while fetching breeds" };
      }
};

export default getAllBreeds;