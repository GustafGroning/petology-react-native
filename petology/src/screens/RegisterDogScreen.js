import React from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";

const RegisterDogScreen = () => {
  /**************************************************************/
  // const storageToken = await AsyncStorage.getItem("userToken");
  // TODO: fix token import, just to practice importing stuff from asyncStorage and displaying it.

  /**************************************************************/

  /**************************************************************/

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Petology</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Namn</Text>
        <TextInput style={styles.input} placeholder="Fido" />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Ras</Text>
        <TextInput style={styles.input} placeholder="Labrador" />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Födelsedatum</Text>
        <TextInput style={styles.input} placeholder="ÅÅMMDD" />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Kön</Text>
        <TextInput style={styles.input} placeholder="Hane/Tik" />
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Skapa hund</Text>
      </TouchableOpacity>

      <View style={styles.imageUpload}>
        <TouchableOpacity>
          {/* <Image source={require("path-to-your-image-icon.png")} /> */}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FAFAD2", // Choose an appropriate color
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 10,
  },
  label: {
    fontSize: 18,
  },
  input: {
    borderColor: "gray",
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: "#90EE90", // Choose an appropriate color
    padding: 15,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 18,
    textAlign: "center",
  },
  imageUpload: {
    alignItems: "center",
    marginVertical: 20,
  },
});

export default RegisterDogScreen;
