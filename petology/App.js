import React from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./src/screens/LoginScreen";
import SignUpScreen from "./src/screens/SignUpScreen";
import LandingPage from "./src/screens/LandingPage";
import RegisterDogScreen from "./src/screens/RegisterDogScreen";
import ProtectedTestScreen from "./src/screens/ProtectedTestScreen";
import DogIntroductionScreen from "./src/screens/DogIntroductionScreen";
import DogSelectionScreen from "./src/screens/DogSelectionScreen";
import CalendarScreen from "./src/screens/CalenderScreen";
import CreateTaskScreen from "./src/screens/CreateTaskScreen";

/**************************************************************/
const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login"   screenOptions={{
    headerShown: false
  }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="Landing" component={LandingPage} />
          <Stack.Screen name="RegisterDog" component={RegisterDogScreen} />
          <Stack.Screen name="protected" component={ProtectedTestScreen} />
          <Stack.Screen name="DogSelection" component={DogSelectionScreen} />
          <Stack.Screen
            name="DogIntroduction"
            component={DogIntroductionScreen}
          />
          <Stack.Screen name="Calendar" component={CalendarScreen} />
          <Stack.Screen name="CreateTask" component={CreateTaskScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;
