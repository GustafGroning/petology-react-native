import AsyncStorage from "@react-native-async-storage/async-storage";

const getUserTasks = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (token) {
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_DEV_URL}/api/tasks/all/`,
          {
            method: "GET",
            headers: {
              Authorization: `JWT ${token}`,
            },
          }
        );
  
        if (response.ok) {
          const data = await response.json();
          return data;
        } else {
          console.error("Error fetching user tasks:", response.status);
          return response.status;
        }
      } else {
        console.error("User token not found.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching user tasks:", error);
      return error;
    }
  };


export default getUserTasks;