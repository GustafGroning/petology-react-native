// screens/LoginScreen.js
import React, { useState } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Button, Text } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:8000/api-token-auth/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        const { token } = data;
        await AsyncStorage.setItem("userToken", token); // Store the token
        const storageToken = await AsyncStorage.getItem("userToken");
        console.log(storageToken);

        // TODO: should check if the user account already has at least 1 dog. Checks like this:
        // If USER has 1+ dogs:
        //    if dogID in asyncStorage (user has already a dog selected)
        //          Navigate to Homescreen for the dog
        //    Else
        //      Navigate to SelectActiveDog
        // Else
        //    Navigate RegisterDog
        navigation.navigate("RegisterDog");
      } else {
        // Handle login failure (e.g., show an error message)
      }
    } catch (error) {
      console.error(error);
      // Handle network or other errors
    }
  };

  const navigateToSignUp = () => {
    setUsername(""); // Reset username
    setPassword(""); // Reset password
    navigation.navigate("SignUp");
  };

  const navigateToFlexbox = () => {
    setUsername(""); // Reset username
    setPassword(""); // Reset password
    navigation.navigate("Flexbox");
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Petology</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button mode="contained" onPress={handleLogin}>
        Sign in
      </Button>
      <Button onPress={navigateToSignUp}>
        Don't have an account? Sign up{" "}
      </Button>
      <Button onPress={navigateToFlexbox}>Flexbox practice</Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: 200,
    height: 40,
    padding: 10,
    borderWidth: 1,
    borderColor: "gray",
    marginBottom: 10,
  },
});

export default LoginScreen;
