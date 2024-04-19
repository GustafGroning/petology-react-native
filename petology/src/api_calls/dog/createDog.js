import AsyncStorage from "@react-native-async-storage/async-storage";

const createDog = async (name, selectedBreed, birthday, selectedSex) => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    const formattedDate = `${birthday.getFullYear()}-${
      birthday.getMonth() + 1
    }-${birthday.getDate()}`;

    const response = await fetch("http://localhost:8000/api/dog/add/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${token}`,
      },
      body: JSON.stringify({
        name: name,
        breed: selectedBreed, // Use the selected breed's ID
        birthday: formattedDate, // Format date to YYYY-MM-DD
        sex: selectedSex,
      }),
    });

    if (response.ok) {
      // Handle successful dog registration
      const jsonResponse = await response.json();
      const newDogId = jsonResponse.dog_id;
      await AsyncStorage.setItem("selectedDogId", newDogId.toString()); // Store the new dog's ID
      return { success: true };
    } else {
      // Handle error in dog registration
      const errorData = await response.json();
      return { success: false, message: errorData.message || "Failed to create dog" };
    }
  } catch (error) {
    console.error(error);
    return { success: false, message: "An error occurred while creating the dog" };
  }
};

export default createDog;
