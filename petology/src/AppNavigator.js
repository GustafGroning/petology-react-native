import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from ".src/screens/LoginScreen"; // Update with actual path
import SignUpScreen from "./src/screens/SignUpScreen"; // Update with actual path
import LandingScreen from "./src/screens/LandingScreen"; // Update with actual path

const Stack = createStackNavigator();

function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="Landing" component={LandingScreen} />
    </Stack.Navigator>
  );
}

export default AppNavigator;
