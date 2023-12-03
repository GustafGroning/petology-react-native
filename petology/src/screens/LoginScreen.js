import React, { useEffect, useState } from "react";
import { View, StyleSheet, TextInput } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button, Text } from "react-native-paper";

const LoginScreen = ({ navigation }) => {
  /**************************************************************/
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  /**************************************************************/
  const navigateToSignUp = () => {
    setEmail(""); // Reset username
    setPassword(""); // Reset password
    navigation.navigate("SignUp");
  };

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:8000/api-token-auth/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: email,
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

  /**************************************************************/
  return (
    <View style={styles.container}>
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
          placeholder="password"
          value={password}
          onChangeText={setPassword}
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
      {/* <View style={styles.loginButtonBox}></View> */}
      <View style={styles.boxFour}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#92cdca",
    flex: 1, // makes the container take up the full screen?
    // flexDirection: "row", // default column
    justifyContent: "space-around", // default flex-start
    // alignItems: "flex-end", // controls cross-axis, aka the one not being controlled by justfiyContent
    paddingTop: 40,
  },
  headerBox: {
    flex: 1, // changed from 2
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
    // backgroundColor: "gold",
  },
  boxFour: {
    flex: 3,
    padding: 10,
  },
});

export default LoginScreen;

// alpha-p-circle
