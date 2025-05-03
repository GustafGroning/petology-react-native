import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Modal, ScrollView } from "react-native";
import { Button } from "react-native-paper";
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SelectList } from 'react-native-dropdown-select-list';
import Footer from "../components/common/Footer";

import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

const BreathMonitorScreen = ({ navigation }) => {
  const [seconds, setSeconds] = useState(0);
  const [breaths, setBreaths] = useState(0);
  const [timerStarted, setTimerStarted] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [breathsPerMinute, setBreathsPerMinute] = useState(0);
  const [alertMessage, setAlertMessage] = useState("");

  const [dogList, setDogList] = useState([]);
  const [selectedDogId, setSelectedDogId] = useState(null);
  const [selected, setSelected] = useState('');
  const [defaultOption, setDefaultOption] = useState(undefined);
  const [selectListKey, setSelectListKey] = useState(0);


  const screenWidth = Dimensions.get("window").width;

  const [breathHistory, setBreathHistory] = useState([]);
  const [chartModalVisible, setChartModalVisible] = useState(false);
  const [pendingChart, setPendingChart] = useState(false);


  useEffect(() => {
    fetchUserDogs();
  }, []);

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
      saveMeasurement(); // ✅ autosave after 30 seconds
    }
  
    return () => clearInterval(timer);
  }, [timerStarted, seconds]);
  

  const fetchUserDogs = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${process.env.EXPO_PUBLIC_DEV_URL}/api/dog/all/`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      console.log('data from fetchUserDogs:: ', data);
      if (response.ok && Array.isArray(data.dogs)) {
        const formattedDogs = data.dogs.map(dog => ({
          key: dog.id,
          value: dog.name,
        }));
        setDogList(formattedDogs);

        if (data.dogs.length === 1) {
          console.log('only found 1 dog::');
          const onlyDog = data.dogs[0];
          setSelectedDogId(onlyDog.id.toString());
          setSelected(onlyDog.id.toString()); // match what val actually is

          console.log('selectedDogId and selected:: ', selectedDogId, selected);
          setDefaultOption({ key: onlyDog.id, value: onlyDog.name });
          setSelectListKey(prev => prev + 1);
        }
      } else {
        console.error('Failed to fetch dogs or dogs is not an array');
      }
    } catch (error) {
      console.error('Error fetching dogs:', error);
    }
  };

  const handleHeartPress = () => {
    if (!selectedDogId) {
      alert('Vänligen välj en hund först.');
      return;
    }
    if (!timerStarted) {
      setTimerStarted(true);
    }
    setBreaths(breaths + 1);
  };

  const calculateBreathsPerMinute = () => {
    const breathsPerMinute = (breaths * 2);
    setBreathsPerMinute(breathsPerMinute);
    if (breathsPerMinute > 45) {
      console.log('heavy breath::');
      setAlertMessage("Förhöjd andning! Kontakta veterinär omedelbart!");
    } else {
      setAlertMessage("");
    }
    setModalVisible(true);
  };

  const saveBreathMonitorRecord = async (dogId, breathsCounted) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const payload = {
        date_performed: new Date().toISOString().split('T')[0],
        breaths_counted: parseInt(breathsCounted, 10), // 💥 Här!
      };
      console.log("Saving breath record payload:", payload);
      
      const response = await fetch(`${process.env.EXPO_PUBLIC_DEV_URL}/api/health-index/breath/save/${dogId}/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      if (response.ok) {
        console.log("BreathMonitorRecord saved successfully");
      } else {
        console.error("Failed to save BreathMonitorRecord");
      }
    } catch (error) {
      console.error("Error saving BreathMonitorRecord:", error);
    }
  };  

  const handleSave = async () => {
    if (!selectedDogId) {
      alert('Vänligen välj en hund först.');
      return;
    }
  
    if (breaths === 0) {
      alert('Vänligen räkna andetag innan du sparar.');
      return;
    }
  
    calculateBreathsPerMinute();
    await saveMeasurement(); // ✅ ensure correct timing
  };
  
  
  
  const saveMeasurement = async () => {
    if (!selectedDogId) {
      alert('Vänligen välj en hund först.');
      return;
    }
  
    if (breaths > 0) {
      await saveBreathMonitorRecord(selectedDogId, breaths); // ⏳ wait until saved
      setPendingChart(true); // show chart after modal
      await fetchBreathHistory(selectedDogId); // ✅ now fetch includes the latest entry
    }
  
    setTimerStarted(false);
    setSeconds(0);
    setBreaths(0);
  };
  
  
  
  
  const fetchBreathHistory = async (dogId) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(`${process.env.EXPO_PUBLIC_DEV_URL}/api/health-index/breath/all/${dogId}/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      const data = await response.json();
      setBreathHistory(data.reverse());
    } catch (error) {
      console.error("Error fetching breath history:", error);
    }
  };
  

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return `${d.getMonth() + 1}/${d.getDate()}`; // "MM/DD"
  };
  
  
  return (
    <LinearGradient colors={['#86c8c5', '#e4f4f2']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} style={{ flex: 1 }}>
        <View style={styles.headerBox}>
          <Text style={styles.titleText}>Petology</Text>
          <View style={styles.dogDropdown}>
          <SelectList
            key={selectListKey}
            placeholder="Välj hund"
            data={dogList}
            setSelected={(val) => {
              setSelected(val); // val = dog ID (number or string)
              const dog = dogList.find(d => d.key.toString() === val.toString());
              if (dog) {
                setSelectedDogId(dog.key.toString()); // already correct format
              }
            }}            
            defaultOption={defaultOption}   // ✅ This is the key fix
            search={false}
            boxStyles={styles.selectDogBox}
            dropdownStyles={styles.dropdownList}
          />

          </View>
        </View>

        <View style={styles.contentBox}>
          <Text style={styles.headingText}>Monitorera andetag</Text>
          <Text style={styles.instructionsText}>
            Undersökning ska utföras när hunden ligger och vilar eller sover. Undvik att mäta när hunden drömmer, är stressad, flämtar eller är störd av sin omgivning.
          </Text>

          <TouchableOpacity onPress={handleHeartPress} style={styles.heartContainer}>
            <FontAwesome name="heart" size={100} color="#4d9de0" />
          </TouchableOpacity>

          <Text style={styles.heartInstructionText}>Tryck på hjärtat för varje räknat andetag</Text>
          <Text style={styles.heartInstructionText}>Timern startar när du trycker på hjärtat</Text>

          <Text style={styles.measurementText}>Mät antalet andetag under 30 sekunder. Ett andetag innebär att hunden har höjt och sänkt sin bröstkorg.</Text>

          <Text style={styles.resultText}>Antal sekunder: {seconds}</Text>
          <Text style={styles.resultText}>Antal andetag: {breaths}</Text>

          <Button mode="contained" onPress={handleSave} style={styles.saveButton}>Spara</Button>
        </View>

        <Footer navigation={navigation} />
      </ScrollView>

      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(!modalVisible)}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Andetag per minut: {breathsPerMinute}</Text>
          {alertMessage ? (<Text style={styles.alertText}>{alertMessage}</Text>) : null}
          <Button
            mode="contained"
            onPress={() => {
              setModalVisible(false);
              if (pendingChart) {
                setPendingChart(false);
                setChartModalVisible(true); // ✅ now we show the chart
              }
            }}
            style={styles.saveButton}
          >
            OK
          </Button>
        </View>
      </Modal>
      <Modal visible={chartModalVisible} transparent={false} animationType="slide">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ fontSize: 22, marginBottom: 10 }}>Andetag över tid</Text>

          {breathHistory.length > 0 ? (
            <LineChart
              data={{
                labels: breathHistory.map(entry => formatDate(entry.date_performed)), // e.g., "5/3"
                datasets: [{ data: breathHistory.map(entry => entry.breaths_counted) }]
              }}            
              width={screenWidth - 40}
              height={220}
              yAxisSuffix=""
              chartConfig={{
                backgroundColor: "#e4f4f2",
                backgroundGradientFrom: "#e4f4f2",
                backgroundGradientTo: "#86c8c5",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: { borderRadius: 16 },
              }}
              bezier
              style={{ borderRadius: 16 }}
            />
          ) : (
            <Text>Inga tidigare mätningar</Text>
          )}

          <Button mode="contained" onPress={() => setChartModalVisible(false)} style={{ marginTop: 20 }}>
            Stäng
          </Button>
        </View>
      </Modal>

    </LinearGradient>
    
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { flexGrow: 1, justifyContent: "space-between", paddingTop: 40 },
  headerBox: { alignItems: "center", padding: 10 },
  titleText: { fontSize: 36, fontWeight: 'bold', marginBottom: 10 },
  dogDropdown: { alignItems: 'center', marginTop: 10 },
  contentBox: { flex: 1, alignItems: "center", padding: 20 },
  headingText: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  instructionsText: { fontSize: 16, textAlign: 'center', marginBottom: 20 },
  heartContainer: { marginBottom: 20 },
  heartInstructionText: { fontSize: 16, textAlign: 'center', marginBottom: 20 },
  measurementText: { fontSize: 16, textAlign: 'center', marginBottom: 20 },
  resultText: { fontSize: 18, textAlign: 'center', marginBottom: 10 },
  saveButton: { borderRadius: 20, marginTop: 20, width: 200 },
  modalView: { flex: 1, justifyContent: "center", alignItems: "center", margin: 20, backgroundColor: "white", borderRadius: 20, padding: 35, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 },
  modalText: { marginBottom: 15, textAlign: "center", fontSize: 24 },
  alertText: { color: "red", fontSize: 18, textAlign: "center", marginBottom: 10 },
  selectDogBox: { borderRadius: 20, backgroundColor: 'white', height: 45, justifyContent: 'center', paddingHorizontal: 20, borderColor: '#4a8483', borderWidth: 1, width: 150 },
  dropdownList: { backgroundColor: 'white', borderRadius: 10, marginTop: 5, width: 150, alignSelf: 'center' },
});

export default BreathMonitorScreen;