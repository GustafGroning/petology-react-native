import AsyncStorage from "@react-native-async-storage/async-storage";

const getSurveyQuestions = async () => {
    try {
        const token = await AsyncStorage.getItem("userToken");
        const response = await fetch(`${process.env.EXPO_PUBLIC_DEV_URL}/api/health-index/questions/get/`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            return await response.json();
        } else {
            console.error("Error fetching random questions:", response.status);
            return null;
        }
    } catch (error) {
        console.error("API call error:", error);
        return null;
    }
};

export default getSurveyQuestions;
