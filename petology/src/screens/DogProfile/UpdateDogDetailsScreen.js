import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import PetologyTextInput from '../../components/common/input/PetologyTextInput'; // Adjust the path as needed
import PetologyDropdown from '../../components/common/input/PetologyDropdown'; // Adjust the path as needed
import PetologyNumericInput from '../../components/common/input/PetologyNumericInput'; // Adjust the path as needed
import PetologyDatePicker from '../../components/common/input/PetologyDatePicker';
import getDogById from '../../api_calls/dog/getDogById';
import { partialUpdateDog } from '../../api_calls/dog/updateDogDetails';

const UpdateDogDetailsScreen = ({ route, navigation }) => {
  const { dogId } = route.params;
  const [selectedDog, setSelectedDog] = useState(null);
  const [dogInfo, setDogInfo] = useState({
    pedigree_name: { current: '', original: '' },
    breed: { current: '', original: '' },
    birthday: { current: new Date(), original: '' },
    sex: { current: '', original: '' },
    color: { current: '', original: '' },
    id_number: { current: '', original: '' },
    registration_number: { current: '', original: '' },
    passport_number: { current: '', original: '' },
    insurance_company: { current: '', original: '' },
    insurance_number: { current: '', original: '' },
    feed: { current: '', original: '' },
    possible_feed_intolerance: { current: '', original: '' }
  });
  const [breeds, setBreeds] = useState([]);
  const [changedFields, setChangedFields] = useState([]);

  const sexValues = [
    { key: '1', value: 'Okastrerad hane' },
    { key: '2', value: 'Kastrerad hane' },
    { key: '3', value: 'Okastrerad tik' },
    { key: '4', value: 'Kastrerad tik' },
  ];

  useEffect(() => {
    fetchSelectedDog();
    fetchBreeds();
  }, []);
  
  const fetchSelectedDog = async () => {
    try {
      const dogDetails = await getDogById(dogId);
      setSelectedDog(dogDetails);
      setDogInfo(prevState => {
        return {
          ...prevState,
          pedigree_name: { current: dogDetails.pedigree_name, original: dogDetails.pedigree_name },
          breed: { current: dogDetails.breed, original: dogDetails.breed },
          birthday: { current: new Date(dogDetails.birthday), original: dogDetails.birthday },
          sex: { current: dogDetails.sex, original: dogDetails.sex },
          color: { current: dogDetails.color, original: dogDetails.color },
          id_number: { current: dogDetails.id_number, original: dogDetails.id_number },
          registration_number: { current: dogDetails.registration_number, original: dogDetails.registration_number },
          passport_number: { current: dogDetails.passport_number, original: dogDetails.passport_number },
          insurance_company: { current: dogDetails.insurance_company, original: dogDetails.insurance_company },
          insurance_number: { current: dogDetails.insurance_number, original: dogDetails.insurance_number },
          feed: { current: dogDetails.feed, original: dogDetails.feed },
          possible_feed_intolerance: { current: dogDetails.possible_feed_intolerance, original: dogDetails.possible_feed_intolerance }
        };
      });
    } catch (error) {
      console.error('Error fetching selected dog:', error);
    }
  };

  const fetchBreeds = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch('http://localhost:8000/api/dog/breeds/', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (response.ok) {
        setBreeds(
          data.breeds.map((breed) => ({ key: breed.id, value: breed.name }))
        );
      } else {
        console.error('Failed to fetch breeds', data);
      }
    } catch (error) {
      console.error('Error fetching breeds', error);
    }
  };

  const handleChange = (name, value) => {
    const newValue = name === 'breed' ? breeds.find(breed => breed.key === value).value : value;
    
    setDogInfo(prevState => {
      return {
        ...prevState,
        [name]: { current: newValue, original: prevState[name].original }
      };
    });
  
    if (!changedFields.includes(name)) {
      setChangedFields(prevState => [...prevState, name]);
    }
  };

  const handleSubmit = async () => {
    try {
      const updatedDogInfo = Object.fromEntries(
        Object.entries(dogInfo)
          .filter(([key]) => changedFields.includes(key))
          .map(([key, value]) => {
            if (key === 'birthday') {
              return [key, new Date(value.current).toISOString().split('T')[0]];
            }
            return [key, value.current];
          })
      );
      const success = await partialUpdateDog(dogId, updatedDogInfo);
      if (success) {
        navigation.goBack();
      } else {
        console.error('Failed to update dog information');
      }
    } catch (error) {
      console.error('Error updating dog information:', error);
    }
  };

  return (
    <LinearGradient
      colors={['#86c8c5', '#e4f4f2']}
      style={styles.container}
    >
      <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
        <Text style={styles.closeButtonText}>✕</Text>
      </TouchableOpacity>
      <ScrollView style={styles.scrollContent}>
        <View style={styles.formContainer}>
          <Text style={styles.formLabel}>Stamtavlenamn</Text>
          <PetologyTextInput
            placeholder="Stamtavlenamn"
            value={dogInfo.pedigree_name.current}
            onUpdateText={(text) => handleChange('pedigree_name', text)}
          />

          <Text style={styles.formLabel}>Födelsedag</Text>
          <View style={styles.birthdayContainer}>
            <PetologyDatePicker
              date={dogInfo.birthday.current}
              onDateTimeChange={(selectedDateTime) => handleChange('birthday', selectedDateTime)}
            />
          </View>

          <Text style={styles.formLabel}>Kön</Text>
          <PetologyDropdown
            setSelected={(text) => handleChange('sex', text)}
            placeholder={dogInfo.sex.current}
            data={sexValues}
            save='value'
          />

          <Text style={styles.formLabel}>Färg</Text>
          <PetologyTextInput
            placeholder="Färg"
            value={dogInfo.color.current}
            onUpdateText={(text) => handleChange('color', text)}
          />
          <Text style={styles.formLabel}>ID-nummer</Text>
          <PetologyNumericInput
            placeholder="ID-nummer"
            value={dogInfo.id_number.current}
            onUpdateText={(text) => handleChange('id_number', text)}
          />
          <Text style={styles.formLabel}>Registreringsnummer</Text>
          <PetologyNumericInput
            placeholder="Registreringsnummer"
            value={dogInfo.registration_number.current}
            onUpdateText={(text) => handleChange('registration_number', text)}
          />
          <Text style={styles.formLabel}>Passnummer</Text>
          <PetologyNumericInput
            placeholder="Passnummer"
            value={dogInfo.passport_number.current}
            onUpdateText={(text) => handleChange('passport_number', text)}
          />
          <Text style={styles.formLabel}>Försäkringsbolag</Text>
          <PetologyTextInput
            placeholder="Försäkringsbolag"
            value={dogInfo.insurance_company.current}
            onUpdateText={(text) => handleChange('insurance_company', text)}
          />
          <Text style={styles.formLabel}>Försäkringsnummer</Text>
          <PetologyNumericInput
            placeholder="Försäkringsnummer"
            value={dogInfo.insurance_number.current}
            onUpdateText={(text) => handleChange('insurance_number', text)}
          />
          <Text style={styles.formLabel}>Foder</Text>
          <PetologyTextInput
            placeholder="Foder"
            value={dogInfo.feed.current}
            onUpdateText={(text) => handleChange('feed', text)}
          />
          <Text style={styles.formLabel}>Foderintolerans</Text>
          <PetologyTextInput
            placeholder="Foderintolerans"
            value={dogInfo.possible_feed_intolerance.current}
            onUpdateText={(text) => handleChange('possible_feed_intolerance', text)}
          />
        </View>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>Uppdatera</Text>
        </TouchableOpacity>
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
    marginTop: 80,
    alignItems: 'center',
  },
  birthdayContainer: {
    alignItems: 'center',
    width: '35%',
  },
  formLabel: {
    fontSize: 14,
    marginBottom: 5,
  },
  submitButton: {
    backgroundColor: '#007bff',
    padding: 15,
    alignItems: 'center',
    borderRadius: 5,
    marginHorizontal: 20,
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  closeButton: {
    position: 'absolute',
    top: 50, // Adjust if needed depending on device (iPhone notch etc.)
    left: 20,
    zIndex: 10,
  },
  closeButtonText: {
    fontSize: 28,
    color: '#333',
  },
  
});

export default UpdateDogDetailsScreen;
