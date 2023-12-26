import React, { useState } from "react";
import { View, StyleSheet, TextInput } from "react-native";
import { Button, Text } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SignUpScreen = ({ navigation }) => {
  /**************************************************************/

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  /**************************************************************/

  const handleSignUp = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/users/register/",
        {
          // Make sure this URL matches your Django registration endpoint
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        console.log("Registration successful", data.token);
        await AsyncStorage.setItem("userToken", data.token); // Store the token
        navigation.navigate("Login"); // Navigate to RegisterDog screen
      } else {
        console.log("Registration failed", data.error);
        // Handle registration failure (e.g., show an error message)
      }
    } catch (error) {
      console.error("Network or server error", error);
      // Handle network or other errors
    }
  };

  /**************************************************************/

  return (
    <View style={styles.container}>
      <View style={styles.headerBox}>
        <View style={styles.headerContainer}>
          <Text variant="headlineMedium">Create account </Text>
        </View>
      </View>
      <View style={styles.inputBox}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          textAlign={"center"}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          textAlign={"center"}
        />
        <Button
          mode="contained"
          style={{ borderRadius: 2, width: "85%" }}
          onPress={handleSignUp}
        >
          Create account
        </Button>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <Text> Already have an account?</Text>
          <Button 
            onPress={() => navigation.navigate("Login")}> 
            Login
            </Button>
        </View>
      </View>
      <View style={styles.boxFour}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#92cdca",
    flex: 1,
    justifyContent: "space-around",
    paddingTop: 40,
  },
  headerBox: {
    flex: 1,
    backgroundColor: "#92cdca",
    alignItems: "center",
    padding: 10,
  },
  headerContainer: {
    paddingTop: 25,
  },
  inputBox: {
    flex: 3,
    alignItems: "center",
    justifyContent: "center",
    width: '100%', // Add width to make sure it takes the full width
  },
  input: {
    width: "85%",
    height: 45,
    backgroundColor: "white",
    marginBottom: 14,
    alignContent: "center",
    justifyContent: "center",
  },
  boxFour: {
    flex: 3,
    padding: 10,
  },
});

export default SignUpScreen;
