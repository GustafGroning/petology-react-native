import React, { useEffect, useState } from "react";
import { View, StyleSheet, TextInput } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button, Text } from "react-native-paper";
import { LinearGradient } from 'expo-linear-gradient';
import getUserFirstAndLastNames from "../api_calls/user/getUserFirstAndLastNames";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigateToSignUp = () => {
    setEmail("");
    setPassword("");
    navigation.navigate("SignUp");
  };

  const handleLogin = async () => {
    try {
      console.log("trying api-token-auth");
      console.log(".env var EXPO_PUBLIC_DEV_URL", process.env.EXPO_PUBLIC_DEV_URL);
  
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_DEV_URL}/api-token-auth/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: email,
            password: password,
          }),
        }
      );
  
      const data = await response.json();
  
      // Check if the response is OK
      if (response.ok) {
        const { access, refresh } = data;
  
        if (!access || !refresh) {
          console.error("Access or refresh token missing in response:", data);
          return;
        }
  
        // Store the tokens in AsyncStorage
        await AsyncStorage.setItem("userToken", access);
        await AsyncStorage.setItem("refreshToken", refresh);
  
        const basicInfo = await getUserFirstAndLastNames();
  
        if (!basicInfo || !basicInfo.full_name) {
          navigation.navigate("InputUserBasicInfoScreen");
          return;
        }
  
        // Fetch dogs data
        const dogsResponse = await fetch(
          `${process.env.EXPO_PUBLIC_DEV_URL}/api/dog/all/`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${access}`,
            },
          }
        );
  
        const dogsData = await dogsResponse.json();
  
        // Navigate based on dogs data
        if (dogsResponse.ok && dogsData.dogs && dogsData.dogs.length > 0) {
          navigation.navigate("Landing");
        } else {
          navigation.navigate("DogIntroduction");
        }
      } else {
        console.log("Login failed");
        console.log("Response:", data); // Log response for debugging
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };
  

  return (
    <LinearGradient
      colors={['#86c8c5', '#e4f4f2']}
      style={styles.container}
    >
      <View style={styles.headerBox}>
        <View style={styles.headerContainer}>
          <Text variant="headlineMedium">Petology</Text>
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
          onPress={handleLogin}
        >
          Sign in
        </Button>
        <View style={styles.signUpBox}>
          <Text> Don't have an account?</Text>
          <Button onPress={navigateToSignUp}>Sign up</Button>
        </View>
      </View>
      <View style={styles.boxFour}></View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-around",
    paddingTop: 40,
  },
  headerBox: {
    flex: 1,
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
  },
  input: {
    width: "85%",
    height: 45,
    backgroundColor: "white",
    marginBottom: 14,
    alignContent: "center",
    justifyContent: "center",
  },
  signUpBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  boxFour: {
    flex: 3,
    padding: 10,
  },
});

export default LoginScreen;
