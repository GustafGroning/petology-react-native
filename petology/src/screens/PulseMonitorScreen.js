import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Modal } from "react-native";
import { Button } from "react-native-paper";
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import Footer from "../components/common/Footer";
const PulseMonitorScreen = ({ navigation }) => {
  const [seconds, setSeconds] = useState(0);
  const [breaths, setBreaths] = useState(0);
  const [timerStarted, setTimerStarted] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [breathsPerMinute, setBreathsPerMinute] = useState(0);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    let timer;
    if (timerStarted) {
      timer = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
    }
    if (seconds >= 30) {
      clearInterval(timer);
      setTimerStarted(false);
      calculateBreathsPerMinute();
    }
    return () => clearInterval(timer);
  }, [timerStarted, seconds]);

  const handleHeartPress = () => {
    if (!timerStarted) {
      setTimerStarted(true);
    }
    setBreaths(breaths + 1);
  };

  const calculateBreathsPerMinute = () => {
    const breathsPerMinute = (breaths * 2); // Since it's measured for 30 seconds
    setBreathsPerMinute(breathsPerMinute);
    if (breathsPerMinute > 45) {
      setAlertMessage("Förhöjd andning! Kontakta veterinär omedelbart!");
    } else {
      setAlertMessage("");
    }
    setModalVisible(true);
  };

  const handleSave = () => {
    // Save the data
    console.log(`Saved: ${seconds} seconds, ${breaths} breaths`);
    setModalVisible(false);
    setSeconds(0);
    setBreaths(0);
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
        <Text style={styles.heartInstructionText}>
          Timern startar när du trycker på hjärtat
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

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Andetag per minut: {breathsPerMinute}</Text>
          {alertMessage ? (
            <Text style={styles.alertText}>{alertMessage}</Text>
          ) : null}
          <Button mode="contained" onPress={handleSave} style={styles.saveButton}>
            OK
          </Button>
        </View>
      </Modal>
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
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 24,
  },
  alertText: {
    color: "red",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 10,
  },
});

export default PulseMonitorScreen;
