import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import getDogById from '../../api_calls/dog/getDogById';
import getVaccinationsForDog from '../../api_calls/healthRecords/vaccinations/getVaccinationsForDog';
import getConditionsForDog from '../../api_calls/healthRecords/conditions/getConditionsForDog';
import getMedicationsForDog from '../../api_calls/healthRecords/medications/getMedicationsForDog';
import updateVaccinationById from '../../api_calls/healthRecords/vaccinations/updateVaccinationById';
import updateCondition from '../../api_calls/healthRecords/conditions/updateCondition';
import updateMedication from '../../api_calls/healthRecords/medications/updateMedication';
import deleteVaccination from '../../api_calls/healthRecords/vaccinations/deleteVaccinationById';
import deleteCondition from '../../api_calls/healthRecords/conditions/deleteCondition';
import deleteMedication from '../../api_calls/healthRecords/medications/deleteMedication';
import Footer from '../../components/common/Footer';
import { LinearGradient } from 'expo-linear-gradient';
import InfoCard from '../../components/dogDetails/InfoCard';

const DogDetailsScreen = ({ navigation, route }) => {
  const { dogId } = route.params;
  const [selectedDog, setSelectedDog] = useState(null);
  const [vaccinations, setVaccinations] = useState([]);
  const [conditions, setConditions] = useState([]);
  const [medications, setMedications] = useState([]);
  const currentConditions = conditions.filter(condition => !condition.healed);
  const pastConditions = conditions.filter(condition => condition.healed);

  useFocusEffect(
    useCallback(() => {
      fetchSelectedDog();
      fetchDogVaccinations();
      fetchDogConditions();
      fetchDogMedications();
    }, [dogId])
  );

  const fetchSelectedDog = async () => {
    try {
      const dogDetails = await getDogById(dogId);
      setSelectedDog(dogDetails);
    } catch (error) {
      console.error('Error fetching selected dog:', error);
    }
  };

  const fetchDogVaccinations = async () => {
    try {
      const vaccinations = await getVaccinationsForDog(dogId);
      setVaccinations(vaccinations);
    } catch (error) {
      console.error('Error fetching vaccinations:', error);
    }
  };

  const fetchDogConditions = async () => {
    try {
      const conditions = await getConditionsForDog(dogId);
      setConditions(conditions);
    } catch (error) {
      console.error('Error fetching conditions:', error);
    }
  };

  const fetchDogMedications = async () => {
    try {
      const medications = await getMedicationsForDog(dogId);
      setMedications(medications);
    } catch (error) {
      console.error('Error fetching medications:', error);
    }
  };

  const handleUpdate = async (id, data, type) => {
    console.log('the stuff sent to parent ', id, data, type);
    let updateFunc;
    switch (type) {
        case 'vaccination':
            updateFunc = updateVaccinationById;
            data.dog = dogId;
            break;
        case 'condition':
            updateFunc = updateCondition;
            data.dog = dogId; // Add dogId to the condition update data
            if (data.medication && typeof data.medication !== 'object') {
                data.medication = { id: data.medication }; // Ensure medication is an object
            }
            break;
        case 'medication':
            updateFunc = updateMedication;
            data.dog = dogId;
            break;
        default:
            return;
    }

    console.log('Updated Data:', data); // Log the updated data to check its structure

    try {
        const updatedItem = await updateFunc(id, data);
        if (updatedItem) {
            switch (type) {
                case 'vaccination':
                    setVaccinations(vaccinations.map(v => (v.id === id ? updatedItem : v)));
                    break;
                case 'condition':
                    setConditions(conditions.map(c => (c.id === id ? updatedItem : c)));
                    break;
                case 'medication':
                    setMedications(medications.map(m => (m.id === id ? updatedItem : m)));
                    break;
            }
        }
    } catch (error) {
        console.error(`Error updating ${type}:`, error);
    }
};


  const handleDelete = async (id, type) => {
    let deleteFunc;
    switch (type) {
      case 'vaccination':
        deleteFunc = deleteVaccination;
        break;
      case 'condition':
        deleteFunc = deleteCondition;
        break;
      case 'medication':
        deleteFunc = deleteMedication;
        break;
      default:
        return;
    }
    try {
      const success = await deleteFunc(id);
      if (success) {
        switch (type) {
          case 'vaccination':
            setVaccinations(vaccinations.filter(v => v.id !== id));
            break;
          case 'condition':
            setConditions(conditions.filter(c => c.id !== id));
            break;
          case 'medication':
            setMedications(medications.filter(m => m.id !== id));
            break;
        }
      }
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
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
                  <FontAwesome name='pencil' size={24} color='#000' />
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
  
          <View style={styles.sectionIconContainer}>
            <FontAwesome name='heart-o' size={58} color='#000' />
          </View>
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderContainer}>
              <Text style={styles.sectionHeader}>Vaccinationer</Text>
              <TouchableOpacity style={styles.sectionButton} onPress={() => navigation.navigate('CreateVaccinationScreen', { dogId: dogId })}>
                <FontAwesome name='pencil' size={24} color='#000' />
              </TouchableOpacity>
            </View>
          </View>
          {vaccinations.map((vaccination) => (
            <InfoCard 
              key={vaccination.id} 
              type="vaccination" 
              data={{
                id: vaccination.id,
                name: vaccination.name,
                vaccineName: vaccination.vaccineName,
                date: vaccination.vaccination_date,
                nextDate: vaccination.next_vaccination_date,
              }} 
              onUpdate={(updatedData) => handleUpdate(vaccination.id, updatedData, 'vaccination')}
              onDelete={() => handleDelete(vaccination.id, 'vaccination')}
            />
          ))}
  
          <View style={styles.sectionContainer}>
            <View style={styles.sectionIconContainer}>
              <FontAwesome name='eyedropper' size={58} color='#000' />
            </View>
            <View style={styles.sectionHeaderContainer}>
              <Text style={styles.sectionHeader}>Mediciner</Text>
              <TouchableOpacity style={styles.sectionButton} onPress={() => navigation.navigate('CreateMedicationScreen', { dogId: dogId })}>
                <FontAwesome name='pencil' size={24} color='#000' />
              </TouchableOpacity>
            </View>
          </View>
          {medications.map((medication) => (
            <InfoCard 
              key={medication.id} 
              type="medication" 
              data={{
                id: medication.id,
                name: medication.name,
                strength: medication.strength,
                administrationMethod: medication.administration_method,
                amount: medication.amount,
                frequency: medication.frequency,
                administrationStartDate: medication.administration_start_date,
                administrationLength: medication.administration_length,
              }} 
              onUpdate={(updatedData) => handleUpdate(medication.id, updatedData, 'medication')}
              onDelete={() => handleDelete(medication.id, 'medication')}
            />
          ))}
  
          <View style={styles.sectionContainer}>
            <View style={styles.sectionIconContainer}>
              <FontAwesome name='hospital-o' size={58} color='#000' />
            </View>
            <View style={styles.sectionHeaderContainer}>
              <Text style={styles.sectionHeader}>Nuvarande sjukdomar</Text>
              <TouchableOpacity style={styles.sectionButton} onPress={() => navigation.navigate('CreateConditionScreen', { dogId: dogId })}>
                <FontAwesome name='pencil' size={24} color='#000' />
              </TouchableOpacity>
            </View>
          </View>
          {currentConditions.map((condition) => (
            <InfoCard 
              key={condition.id} 
              type="condition" 
              data={{
                id: condition.id,
                name: condition.name,
                onsetDate: condition.onset_date,
                followUpDate: condition.follow_up_date,
                vetClinic: condition.vet_clinic,
                notes: condition.notes,
                medication: condition.medication,
                healed: condition.healed,
              }} 
              onUpdate={(updatedData) => handleUpdate(condition.id, updatedData, 'condition')}
              onDelete={() => handleDelete(condition.id, 'condition')}
            />
          ))}
  
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderContainer}>
              <Text style={styles.sectionHeader}>Tidigare sjukdomar</Text>
              <TouchableOpacity style={styles.sectionButton} onPress={() => navigation.navigate('PastConditionsScreen', { dogId: dogId })}>
                <FontAwesome name='pencil' size={24} color='#000' />
              </TouchableOpacity>
            </View>
          </View>
          {pastConditions.map((condition) => (
            <InfoCard 
              key={condition.id} 
              type="condition" 
              data={{
                id: condition.id,
                name: condition.name,
                onsetDate: condition.onset_date,
                followUpDate: condition.follow_up_date,
                vetClinic: condition.vet_clinic,
                notes: condition.notes,
                medication: condition.medication,
                healed: condition.healed,
              }} 
              onUpdate={(updatedData) => handleUpdate(condition.id, updatedData, 'condition')}
              onDelete={() => handleDelete(condition.id, 'condition')}
            />
          ))}
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
  sectionIconContainer: {
    alignItems: 'center',
  },
  sectionContainer: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  sectionHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionHeader: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  sectionButton: {
    position: 'absolute',
    right: 0,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});



export default DogDetailsScreen;
