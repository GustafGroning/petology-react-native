import AsyncStorage from "@react-native-async-storage/async-storage";

const deleteDog = async (dogId) => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    
    const response = await fetch(`${process.env.EXPO_PUBLIC_DEV_URL}/api/dog/delete/${dogId}/`, {
      method: "DELETE",
      headers: {
        Authorization: `JWT ${token}`,
      },
    });

    if (response.ok) {
      // Dog deleted successfully
      return { success: true };
    } else {
      // Failed to delete dog
      const errorData = await response.json();
      return { success: false, message: errorData.message || "Failed to delete dog" };
    }
  } catch (error) {
    // Error occurred while deleting dog
    console.error(error);
    return { success: false, message: "An error occurred while deleting the dog" };
  }
};

export default deleteDog;
