import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Button } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import PetologyTextInput from '../components/common/input/PetologyTextInput';

const AddTreatmentScreen = ({ navigation }) => {
  const [treatment, setTreatment] = useState('');
  const [strength, setStrength] = useState('');
  const [route, setRoute] = useState('');
  const [amount, setAmount] = useState('');
  const [frequency, setFrequency] = useState('');
  const [duration, setDuration] = useState('');
  const [startDate, setStartDate] = useState(new Date());

  const handleSave = () => {
        
  };

  return (
    <LinearGradient
      colors={['#86c8c5', '#e4f4f2']}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Lägg till behandling</Text>
          <Text style={styles.subHeaderText}>Ellie</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.label}>Behandling/Medicin</Text>
            <PetologyTextInput
              placeholder="Fyll i behandling/medicin"
              value={treatment}
              onUpdateText={setTreatment}
            />
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.label}>Styrka</Text>
            <PetologyTextInput
              placeholder="5mg"
              value={strength}
              onUpdateText={setStrength}
            />
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.label}>Administreringssätt</Text>
            <PetologyTextInput
              placeholder="I munnen"
              value={route}
              onUpdateText={setRoute}
            />
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.label}>Mängd</Text>
            <PetologyTextInput
              placeholder="1 tablett"
              value={amount}
              onUpdateText={setAmount}
            />
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.label}>Frekvens</Text>
            <PetologyTextInput
              placeholder="1 gång per dag"
              value={frequency}
              onUpdateText={setFrequency}
            />
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.label}>Hur länge ska behandlingen pågå?</Text>
            <PetologyTextInput
              placeholder="1 dagar"
              value={duration}
              onUpdateText={setDuration}
            />
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.label}>När börjar behandlingen</Text>
            <DateTimePicker
              value={startDate}
              mode="date"
              locale="sv-SE"
              onChange={(event, selectedDateTime) => {
                if (selectedDateTime) {
                  setStartDate(selectedDateTime);
                }
              }}
              style={{ marginBottom: 20 }}
            />
          </View>

          <Button mode="contained" onPress={handleSave} style={styles.saveButton}>
            Lägg till
          </Button>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
  },
  scrollContent: {
    paddingBottom: 80,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333',
  },
  subHeaderText: {
    fontSize: 20,
    color: '#333',
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#333',
  },
  textInputStyling: {
    textAlign: 'center',
    height: 40,
    borderColor: 'black',
    borderWidth: 0.5,
    borderRadius: 22,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: '#4a8483',
  },
});

export default AddTreatmentScreen;
