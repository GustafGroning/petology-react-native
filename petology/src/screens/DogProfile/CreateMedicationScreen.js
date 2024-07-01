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

const CreateMedicationScreen = ({ route, navigation }) => {
  const { dogId } = route.params;

  const [medicationData, setMedicationData] = useState({
    name: '',
    strength: '',
    administration_method: '',
    amount: '',
    frequency: '',
    administration_start_date: new Date(),
    administration_length: new Date(),
  });

  const handleCreateMedication = async () => {
    try {
      const success = await createMedication({
        ...medicationData,
        dog: dogId,
      });
      if (success) {
        navigation.goBack();
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
          <Text style={styles.header}>Lägg till medicin</Text>

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

          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton]}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.actionButtonText}>Avsluta</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.submitButton]}
              onPress={handleCreateMedication}
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
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

export default CreateMedicationScreen;
