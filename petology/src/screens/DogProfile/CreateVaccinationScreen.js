import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import PetologyTextInput from '../../components/common/input/PetologyTextInput'; // Adjust the path as needed
import PetologyDropdown from '../../components/common/input/PetologyDropdown'; // Adjust the path as needed
import PetologyDatePicker from '../../components/common/input/PetologyDatePicker';
import createVaccination from '../../api_calls/healthRecords/vaccinations/createVaccination';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CreateVaccinationScreen = ({ navigation, route }) => {
  const { dogId } = route.params;
  const [vaccination, setVaccination] = useState('');
  const [vaccination_detailed_name, setVaccination_detailed_name] = useState('');
  const [vaccinationDate, setVaccinationDate] = useState(new Date());
  const [showNextVaccinationDate, setShowNextVaccinationDate] = useState(false);
  const [nextVaccinationDate, setNextVaccinationDate] = useState(new Date());
  const [clinicName, setClinicName] = useState('');
  const [notes, setNotes] = useState('');
  const [customVaccination, setCustomVaccination] = useState(false);

  const vaccinationOptions = [
    { key: '1', value: 'Rabies' },
    { key: '2', value: 'Distemper' },
    { key: '3', value: 'Parvovirus' },
  ];

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-indexed
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const handleSave = async () => {
    try {
      const formattedVaccinationDate = formatDate(vaccinationDate);
      const formattedNextVaccinationDate = showNextVaccinationDate && nextVaccinationDate
        ? formatDate(nextVaccinationDate)
        : null;

      const response = await createVaccination(
        dogId,
        vaccination,
        vaccination_detailed_name, 
        formattedVaccinationDate,
        formattedNextVaccinationDate,
        clinicName,
        notes
      );

      if (response.success) {
        navigation.goBack();
      } else {
        console.error('Error creating vaccination:', response.message);
      }
    } catch (error) {
      console.error('An error occurred while creating the vaccination:', error);
    }
  };

  return (
    <LinearGradient
      colors={['#86c8c5', '#e4f4f2']}
      style={styles.container}
    >
      <ScrollView style={styles.scrollContent}>
        <View style={styles.formContainer}>
          <Text style={styles.headerText}>Lägg till vaccination</Text>
          <Text style={styles.subHeaderText}>Ellie</Text>

          <Text style={styles.formLabel}>Vaccination</Text>
          {customVaccination ? (
            <PetologyTextInput
              placeholder="Ange vaccination"
              value={vaccination}
              onUpdateText={setVaccination}
            />
          ) : (
            <PetologyDropdown
              setSelected={setVaccination}
              placeholder="Välj vaccination"
              data={vaccinationOptions}
              save="value"
            />
          )}

          <TouchableOpacity onPress={() => setCustomVaccination(!customVaccination)}>
            <Text style={styles.customVaccinationText}>
              {customVaccination ? 'Välj från lista' : 'Finns vaccinet inte på listan?'}
            </Text>
          </TouchableOpacity>

          <PetologyTextInput
            placeholder="Tekniskt namna"
            value={vaccination_detailed_name}
            onUpdateText={setVaccination_detailed_name}
          />
          <Text style={styles.formLabel}>Datum</Text>
          <PetologyDatePicker
            date={vaccinationDate}
            onDateTimeChange={setVaccinationDate}
          />

          <View style={styles.switchContainer}>
            <Text style={styles.formLabel}>Ska vaccinet fyllas på?</Text>
            <Switch
              value={showNextVaccinationDate}
              onValueChange={setShowNextVaccinationDate}
            />
          </View>

          {showNextVaccinationDate && (
            <>
              <Text style={styles.formLabel}>Nästa vaccination</Text>
              <PetologyDatePicker
                date={nextVaccinationDate}
                onDateTimeChange={setNextVaccinationDate}
              />
            </>
          )}

          <Text style={styles.formLabel}>Vaccinerad på</Text>
          <PetologyTextInput
            placeholder="Fyll i klinikens namn"
            value={clinicName}
            onUpdateText={setClinicName}
          />

          <Text style={styles.formLabel}>Anteckningar</Text>
          <PetologyTextInput
            placeholder="Fyll i egna anteckningar (valfritt)"
            value={notes}
            onUpdateText={setNotes}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
              <Text style={styles.cancelButtonText}>Avsluta</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Lägg till</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  formContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  formLabel: {
    fontSize: 14,
    marginBottom: 5,
  },
  customVaccinationText: {
    fontSize: 14,
    color: 'blue',
    marginBottom: 15,
  },
  headerText: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subHeaderText: {
    fontSize: 24,
    marginBottom: 20,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: '#ccc',
    padding: 15,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  saveButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default CreateVaccinationScreen;
