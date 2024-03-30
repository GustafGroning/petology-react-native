import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import getDogById from "../../api_calls/dog/getDogById";
import Footer from "../../components/common/Footer";
import Header from "../../components/common/Header";

const DogMainScreen = ({ navigation, route }) => {
  const [selectedDog, setSelectedDog] = useState(null);
  const { dogId } = route.params; // Extracting dogId from navigation params

  useEffect(() => {
    fetchSelectedDog();
  }, []);

  const fetchSelectedDog = async () => {
    try {
      const dogDetails = await getDogById(dogId); // Fetch dog details using the dogId from navigation params
      setSelectedDog(dogDetails);
    } catch (error) {
      console.error("Error fetching selected dog:", error);
    }
  };

  const getSexLabel = (sex) => {
    switch (sex) {
      case 1:
        return "Okastrerad hane";
      case 2:
        return "Kastrerad hane";
      case 3:
        return "Okastrerad tik";
      case 4:
        return "Kastrerad tik";
      default:
        return "Unknown";
    }
  };

  return (
    <View style={styles.container}> 
    <ScrollView>
      <View style={styles.dogHeaderContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>{selectedDog?.name}</Text>
        </View>
      </View>
      
      <View style={styles.diagramContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}> Status </Text>
        </View>
      </View>

      <View style={styles.dogInfoContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}> Information </Text>
        </View>
        
        <Text style={styles.dogInfoText}>Ras: {selectedDog?.breed}</Text>
        <Text style={styles.dogInfoText}>Födelsedag: {selectedDog?.birthday}</Text>
        <Text style={styles.dogInfoText}>Kön: {getSexLabel(selectedDog?.sex)}</Text>

      </View>
    </ScrollView>
    <Footer navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#92cdca",
  },
  dogHeaderContainer: {
    marginTop: 150,
    height: 100,
    alignItems: 'center',
  },
  headerContainer: {
    alignItems: 'center',
  },
  diagramContainer: {
    height: 350,
    backgroundColor: 'gold',
    alignItems: 'center',
  },
  dogInfoContainer: {
    backgroundColor: "red",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  dogInfoText: {
    fontSize: 18,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 36,
    fontFamily: "Cochin",
    opacity: 0.7,
  },
});

export default DogMainScreen;
