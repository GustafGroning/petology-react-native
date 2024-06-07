import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Button } from "react-native-paper";
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import Footer from "../components/common/Footer";
const PulseMonitorScreen = ({ navigation }) => {
  const [seconds, setSeconds] = useState(0);
  const [breaths, setBreaths] = useState(0);

  const handleHeartPress = () => {
    setBreaths(breaths + 1);
  };

  const handleSave = () => {
    // Save the data
    console.log(`Saved: ${seconds} seconds, ${breaths} breaths`);
  };

  return (
    <LinearGradient
        colors={['#86c8c5', '#e4f4f2']}
        style={styles.container}
    >
      <View style={styles.headerBox}>
        <Text style={styles.titleText}>Petology</Text>
        <Button mode="outlined" style={styles.selectDogButton}>Välj hund</Button>
      </View>
      <View style={styles.contentBox}>
        <Text style={styles.headingText}>Monitorera andetag</Text>
        <Text style={styles.instructionsText}>
          Undersökning ska utföras när hunden ligger och vilar eller sover. Undvik att mäta när hunden drömmer, är stressad, flämtar eller är störd av sin omgivning.
        </Text>
        <TouchableOpacity onPress={handleHeartPress} style={styles.heartContainer}>
          <FontAwesome name="heart" size={100} color="#4d9de0" />
        </TouchableOpacity>
        <Text style={styles.heartInstructionText}>
          Tryck på hjärtat för varje räknat andetag
        </Text>
        <Text style={styles.measurementText}>
          Mät antalet andetag under 30 sekunder. Ett andetag innebär att hunden har höjt och sänkt sin bröstkorg.
        </Text>
        <Text style={styles.resultText}>Antal sekunder: {seconds}</Text>
        <Text style={styles.resultText}>Antal andetag: {breaths}</Text>
        <Button mode="contained" onPress={handleSave} style={styles.saveButton}>
          Spara
        </Button>
      </View>
      <Footer navigation={navigation} />
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
    alignItems: "center",
    padding: 10,
  },
  titleText: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  selectDogButton: {
    borderRadius: 20,
  },
  contentBox: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  headingText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  instructionsText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  heartContainer: {
    marginBottom: 20,
  },
  heartInstructionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  measurementText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  resultText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
  },
  saveButton: {
    borderRadius: 20,
    marginTop: 20,
  },
});

export default PulseMonitorScreen;
