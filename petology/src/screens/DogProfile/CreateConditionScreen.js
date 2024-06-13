import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import PetologyTextInput from '../../components/common/input/PetologyTextInput';
import PetologyDatePicker from '../../components/common/input/PetologyDatePicker';
import PetologyDropdown from '../../components/common/input/PetologyDropdown';
import createCondition from '../../api_calls/healthRecords/conditions/createCondition';

const CreateConditionScreen = ({ route, navigation }) => {
  const { dogId } = route.params;

  const [conditionName, setConditionName] = useState('');
  const [onsetDate, setOnsetDate] = useState(new Date());
  const [clinicName, setClinicName] = useState('');
  const [followUp, setFollowUp] = useState(null);
  const [medication, setMedication] = useState(null);
  const [notes, setNotes] = useState('');
  const [journalFile, setJournalFile] = useState(null); // Placeholder for file upload

  const handleCreateCondition = async () => {
    try {
      const success = await createCondition(
        dogId,
        conditionName,
        onsetDate,
        clinicName,
        followUp,
        medication,
        notes,
        journalFile
      );
      if (success) {
        navigation.goBack();
      } else {
        console.error('Failed to create condition');
      }
    } catch (error) {
      console.error('Error creating condition:', error);
    }
  };

  return (
    <LinearGradient
      colors={['#86c8c5', '#e4f4f2']}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.header}>Lägg till sjukdom</Text>

          <PetologyDropdown
            title="Skada/sjukdom"
            placeholder="Välj den diagnos som din hund fått"
            value={conditionName}
            onUpdateText={(text) => setConditionName(text)}
          />

          <PetologyDatePicker
            title="Debut"
            date={onsetDate}
            onDateTimeChange={(date) => setOnsetDate(date)}
          />

          <PetologyTextInput
            placeholder="Fyll i veterinärklinikens namn"
            value={clinicName}
            onUpdateText={(text) => setClinicName(text)}
          />

          <Text style={styles.subHeader}>Är ett återbesök inbokat?</Text>
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[
                styles.optionButton,
                followUp === true && styles.selectedOptionButton,
              ]}
              onPress={() => setFollowUp(true)}
            >
              <Text style={styles.optionButtonText}>Ja</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.optionButton,
                followUp === false && styles.selectedOptionButton,
              ]}
              onPress={() => setFollowUp(false)}
            >
              <Text style={styles.optionButtonText}>Nej</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.subHeader}>Ska några mediciner ges?</Text>
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[
                styles.optionButton,
                medication === true && styles.selectedOptionButton,
              ]}
              onPress={() => setMedication(true)}
            >
              <Text style={styles.optionButtonText}>Ja</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.optionButton,
                medication === false && styles.selectedOptionButton,
              ]}
              onPress={() => setMedication(false)}
            >
              <Text style={styles.optionButtonText}>Nej</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.subHeader}>Lägg in journalkopia</Text>
          <TouchableOpacity style={styles.fileUploadButton}>
            <Text style={styles.fileUploadButtonText}>Välj fil</Text>
          </TouchableOpacity>

          <PetologyTextInput
            placeholder="Fyll i egna anteckningar (valfritt)"
            value={notes}
            onUpdateText={(text) => setNotes(text)}
            multiline={true}
          />

          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton]}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.actionButtonText}>Avsluta</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.submitButton]}
              onPress={handleCreateCondition}
            >
              <Text style={styles.actionButtonText}>Lägg till</Text>
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
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  subHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  optionButton: {
    flex: 1,
    padding: 10,
    margin: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#000',
    alignItems: 'center',
  },
  selectedOptionButton: {
    backgroundColor: '#92cdca',
  },
  optionButtonText: {
    fontSize: 16,
  },
  fileUploadButton: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#000',
    alignItems: 'center',
    marginTop: 10,
  },
  fileUploadButtonText: {
    fontSize: 16,
  },
  actionButton: {
    flex: 1,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    margin: 5,
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderColor: '#000',
    borderWidth: 1,
  },
  submitButton: {
    backgroundColor: '#007bff',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CreateConditionScreen;
