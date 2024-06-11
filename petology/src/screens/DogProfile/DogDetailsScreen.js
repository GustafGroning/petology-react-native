import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import getDogById from '../../api_calls/dog/getDogById';
import Footer from '../../components/common/Footer';
import { LinearGradient } from 'expo-linear-gradient';

const DogDetailsScreen = ({ navigation, route }) => {
  const { dogId } = route.params;
  const [selectedDog, setSelectedDog] = useState(null);

  useFocusEffect(
    useCallback(() => {
      fetchSelectedDog();
    }, [dogId])
  );

  const fetchSelectedDog = async () => {
    try {
      const dogDetails = await getDogById(dogId);
      setSelectedDog(dogDetails);
      console.log('dog ', selectedDog);
    } catch (error) {
      console.error('Error fetching selected dog:', error);
    }
  };

  return (
    <LinearGradient 
      colors={['#86c8c5', '#e4f4f2']}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.editInformationButtonContainer}>
            <TouchableOpacity
              style={styles.editInformationButton}
              onPress={() => navigation.navigate('UpdateDogDetailsScreen', { dogId: dogId })}
            >
            </TouchableOpacity>
          </View>

          {selectedDog && (
            <View style={styles.dogInfoContainer}>
              <View style={styles.headerContainer}>
                <Text style={styles.headerText}>{selectedDog?.name}</Text>
              </View>
              <View style={styles.infoHeaderContainer}>
                <Text style={styles.infoHeaderText}>Information</Text>
                <TouchableOpacity
                  style={styles.editInformationButton}
                  onPress={() => navigation.navigate('UpdateDogDetailsScreen', { dogId: dogId })}
                >
                  <FontAwesome name='arrow-right' size={20} color='#000' />
                </TouchableOpacity>
              </View>
              <Text style={styles.dogInfoLabel}>Stamtavlenamn: <Text style={styles.dogInfoText}>{selectedDog?.pedigree_name}</Text></Text>
              <Text style={styles.dogInfoLabel}>Ras: <Text style={styles.dogInfoText}>{selectedDog?.breed}</Text></Text>
              <Text style={styles.dogInfoLabel}>Födelsedag: <Text style={styles.dogInfoText}>{selectedDog?.birthday}</Text></Text>
              <Text style={styles.dogInfoLabel}>Kön: <Text style={styles.dogInfoText}>{selectedDog?.sex}</Text></Text>
              <Text style={styles.dogInfoLabel}>Färg: <Text style={styles.dogInfoText}>{selectedDog?.color}</Text></Text>

              <View style={styles.spaceBetweenFields}></View>

              <Text style={styles.dogInfoLabel}>ID-nummer: <Text style={styles.dogInfoText}>{selectedDog?.id_number}</Text></Text>
              <Text style={styles.dogInfoLabel}>Registreringsnummer: <Text style={styles.dogInfoText}>{selectedDog?.registration_number}</Text></Text>
              <Text style={styles.dogInfoLabel}>Passnummer: <Text style={styles.dogInfoText}>{selectedDog?.passport_number}</Text></Text>

              <View style={styles.spaceBetweenFields}></View>

              <Text style={styles.dogInfoLabel}>Försäkringsbolag: <Text style={styles.dogInfoText}>{selectedDog?.insurance_company}</Text></Text>
              <Text style={styles.dogInfoLabel}>Försäkringsnummer: <Text style={styles.dogInfoText}>{selectedDog?.insurance_number}</Text></Text>

              <View style={styles.spaceBetweenFields}></View>

              <Text style={styles.dogInfoLabel}>Foder: <Text style={styles.dogInfoText}>{selectedDog?.feed}</Text></Text>
              <Text style={styles.dogInfoLabel}>Eventuella foderintoleranser: <Text style={styles.dogInfoText}>{selectedDog?.possible_feed_intolerance}</Text></Text>
            </View>
          )}

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeader}>Vaccinationer</Text>
            <TouchableOpacity onPress={() => navigation.navigate('VaccinationsScreen', { dogId: dogId })}>
              <FontAwesome name='plus' size={24} color='#000' />
            </TouchableOpacity>
          </View>
          {/* Add vaccinations data here */}

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeader}>Mediciner</Text>
            <TouchableOpacity onPress={() => navigation.navigate('MedicationsScreen', { dogId: dogId })}>
              <FontAwesome name='plus' size={24} color='#000' />
            </TouchableOpacity>
          </View>
          {/* Add medications data here */}

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeader}>Nuvarande sjukdomar</Text>
            <TouchableOpacity onPress={() => navigation.navigate('CurrentConditionsScreen', { dogId: dogId })}>
              <FontAwesome name='plus' size={24} color='#000' />
            </TouchableOpacity>
          </View>
          {/* Add current conditions data here */}

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeader}>Tidigare sjukdomar</Text>
            <TouchableOpacity onPress={() => navigation.navigate('PastConditionsScreen', { dogId: dogId })}>
              <FontAwesome name='plus' size={24} color='#000' />
            </TouchableOpacity>
          </View>
          {/* Add past conditions data here */}
        </View>
      </ScrollView>
      <Footer style={styles.footer} navigation={navigation} />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  headerContainer: {
    alignItems: 'center',
  },
  headerText: {
    fontSize: 36,
    fontFamily: 'Cochin',
    opacity: 0.7,
  },
  dogInfoContainer: {
    borderRadius: 10,
    marginBottom: 20,
  },
  infoHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoHeaderText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  dogInfoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  dogInfoText: {
    fontSize: 16,
    fontWeight: 'normal',
  },
  spaceBetweenFields: {
    marginBottom: 20,
  },
  editInformationButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  editInformationButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
  },
  sectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default DogDetailsScreen;
