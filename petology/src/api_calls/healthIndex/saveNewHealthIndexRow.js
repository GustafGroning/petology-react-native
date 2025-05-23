import AsyncStorage from "@react-native-async-storage/async-storage";

const saveNewHealthIndexRow = async (dogId, newRow) => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    console.log('new row: ', newRow);

    // Ensure the date_performed is in the correct format
    newRow.date_performed = new Date().toISOString().split('T')[0]; // Converts to YYYY-MM-DD

    const response = await fetch(`${process.env.EXPO_PUBLIC_DEV_URL}/api/health-index/dog/${dogId}/add/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newRow),
    });

    if (response.ok) {
      // Handle successful row save
      const jsonResponse = await response.json();
      return { success: true, data: jsonResponse };
    } else {
      // Handle error in saving the row
      const errorData = await response.json();
      return { success: false, message: errorData.message || "Failed to save health index row" };
    }
  } catch (error) {
    console.error(error);
    return { success: false, message: "An error occurred while saving the health index row" };
  }
};

export default saveNewHealthIndexRow;
