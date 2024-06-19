import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Button,
  TextInput,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import PetologyDatePicker from '../../components/common/input/PetologyDatePicker';
import createMedication from '../../api_calls/healthRecords/medications/createMedication';
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
  const [isMedicationModalVisible, setIsMedicationModalVisible] = useState(false);
  const [medicationData, setMedicationData] = useState({
    name: '',
    strength: '',
    administration_method: '',
    amount: '',
    frequency: '',
    administration_start_date: new Date(),
    administration_length: new Date(),
  });

  const handleCreateCondition = async () => {
    try {
      let medicationId = null;
      if (medication) {
        const savedMedication = await createMedication(medicationData);
        if (savedMedication && savedMedication.id) {
          medicationId = savedMedication.id;
        } else {
          console.error('Failed to create medication');
          return;
        }
      }
      const success = await createCondition(
        dogId,
        conditionName,
        onsetDate,
        followUp ? new Date(followUp) : null,
        clinicName,
        notes,
        medicationId
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

  const handleCreateMedication = async () => {
    try {
      const savedMedication = await createMedication(medicationData);
      if (savedMedication && savedMedication.id) {
        setMedication(savedMedication.id);
        setIsMedicationModalVisible(false);
      } else {
        console.error('Failed to create medication');
      }
    } catch (error) {
      console.error('Error creating medication:', error);
    }
  };

  return (
    <LinearGradient colors={['#86c8c5', '#e4f4f2']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.header}>Lägg till sjukdom</Text>

          <TextInput
            placeholder="Skada/sjukdom"
            value={conditionName}
            onChangeText={(text) => setConditionName(text)}
            style={styles.input}
          />

          <PetologyDatePicker
            title="Debut"
            date={onsetDate}
            onDateTimeChange={(date) => setOnsetDate(date)}
          />

          <TextInput
            placeholder="Fyll i veterinärklinikens namn"
            value={clinicName}
            onChangeText={(text) => setClinicName(text)}
            style={styles.input}
          />

          <Text style={styles.subHeader}>Är ett återbesök inbokat?</Text>
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[
                styles.optionButton,
                followUp !== null && styles.selectedOptionButton,
              ]}
              onPress={() => setFollowUp(new Date())}
            >
              <Text style={styles.optionButtonText}>Ja</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.optionButton,
                followUp === null && styles.selectedOptionButton,
              ]}
              onPress={() => setFollowUp(null)}
            >
              <Text style={styles.optionButtonText}>Nej</Text>
            </TouchableOpacity>
          </View>

          {followUp && (
            <PetologyDatePicker
              title="Återbesök"
              date={followUp}
              onDateTimeChange={(date) => setFollowUp(date)}
            />
          )}

          <Text style={styles.subHeader}>Ska några mediciner ges?</Text>
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[
                styles.optionButton,
                medication !== null && styles.selectedOptionButton,
              ]}
              onPress={() => setIsMedicationModalVisible(true)}
            >
              <Text style={styles.optionButtonText}>Ja</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.optionButton,
                medication === null && styles.selectedOptionButton,
              ]}
              onPress={() => setMedication(null)}
            >
              <Text style={styles.optionButtonText}>Nej</Text>
            </TouchableOpacity>
          </View>

          <Modal visible={isMedicationModalVisible} animationType="slide">
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Lägg till medicin</Text>
              <TextInput
                placeholder="Namn"
                value={medicationData.name}
                onChangeText={(text) =>
                  setMedicationData({ ...medicationData, name: text })
                }
                style={styles.input}
              />
              <TextInput
                placeholder="Styrka"
                value={medicationData.strength}
                onChangeText={(text) =>
                  setMedicationData({ ...medicationData, strength: text })
                }
                style={styles.input}
              />
              <TextInput
                placeholder="Administrationsmetod"
                value={medicationData.administration_method}
                onChangeText={(text) =>
                  setMedicationData({
                    ...medicationData,
                    administration_method: text,
                  })
                }
                style={styles.input}
              />
              <TextInput
                placeholder="Mängd"
                value={medicationData.amount}
                onChangeText={(text) =>
                  setMedicationData({ ...medicationData, amount: text })
                }
                style={styles.input}
              />
              <TextInput
                placeholder="Frekvens"
                value={medicationData.frequency}
                onChangeText={(text) =>
                  setMedicationData({ ...medicationData, frequency: text })
                }
                style={styles.input}
              />
              <PetologyDatePicker
                title="Startdatum"
                date={medicationData.administration_start_date}
                onDateTimeChange={(date) =>
                  setMedicationData({
                    ...medicationData,
                    administration_start_date: date,
                  })
                }
              />
              <PetologyDatePicker
                title="Längd"
                date={medicationData.administration_length}
                onDateTimeChange={(date) =>
                  setMedicationData({
                    ...medicationData,
                    administration_length: date,
                  })
                }
              />
              <Button title="Spara" onPress={handleCreateMedication} />
              <Button
                title="Avbryt"
                onPress={() => setIsMedicationModalVisible(false)}
              />
            </View>
          </Modal>

          <Text style={styles.subHeader}>Lägg in journalkopia</Text>
          <TouchableOpacity style={styles.fileUploadButton}>
            <Text style={styles.fileUploadButtonText}>Välj fil</Text>
          </TouchableOpacity>

          <TextInput
            placeholder="Fyll i egna anteckningar (valfritt)"
            value={notes}
            onChangeText={(text) => setNotes(text)}
            style={styles.input}
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
});

export default CreateConditionScreen;
