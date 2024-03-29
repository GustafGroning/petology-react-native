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
import ArticleListScreen from "./src/screens/ArticleListScreen";
import ArticleScreen from "./src/screens/ArticleScreen";
import LibraryScreen from "./src/screens/Library/LibraryScreen";

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
          <Stack.Screen name="DogIntroduction" component={DogIntroductionScreen} />
          <Stack.Screen name="Calendar" component={CalendarScreen} />
          <Stack.Screen name="CreateTask" component={CreateTaskScreen} />
          <Stack.Screen name="ArticleList" component={ArticleListScreen} />
          <Stack.Screen name="ArticleScreen" component={ArticleScreen} />
          <Stack.Screen name="LibraryScreen" component={LibraryScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;
