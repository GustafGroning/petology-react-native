import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Button, Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SelectList } from 'react-native-dropdown-select-list';
import DateTimePicker from '@react-native-community/datetimepicker';
// APIs
import createDog from '../api_calls/dog/createDog';
import getAllBreeds from '../api_calls/breed/getAllBreeds';

const RegisterDogScreen = ({ navigation }) => {
  // State for form fields
  const [name, setName] = useState('');
  const [selectedBreed, setSelectedBreed] = useState(null);
  const [birthday, setBirthday] = useState(new Date());
  const [selectedSex, setSelectedSex] = useState('');
  const [breedData, setBreedData] = useState([]);
  /**********************************************************************************/
  const sexValues = [
    { key: '1', value: 'Okastrerad hane' },
    { key: '2', value: 'Kastrerad hane' },
    { key: '3', value: 'Okastrerad tik' },
    { key: '4', value: 'Kastrerad tik' },
  ];

  /**********************************************************************************/
  const handleCreateDog = async () => {
    // Ensure all fields are filled
    if (!name || !selectedBreed || !birthday || !selectedSex) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    try {
      const result = await createDog(name, selectedBreed, birthday, selectedSex);

      if (result.success) {
        navigation.navigate('DogSelection');
      } else {
        Alert.alert('Error', result.message || 'Failed to create dog');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while creating the dog');
    }
  };
  /**********************************************************************************/
  const fetchBreeds = useCallback(async () => {
    try {
      const query = await getAllBreeds();

      if (query.success){
        console.log('succeeded! ', query.data);
        setBreedData(query.data.breeds); // Update breedData with fetched breeds
        console.log(breedData);
      }
    } catch (error) {
      console.error('Error fetching breeds', error);
    }
  }, []);


  useEffect(() => {
    fetchBreeds();
    
  }, [fetchBreeds]);
  /**********************************************************************************/
  const navigateToDogSelection = () => {
    navigation.navigate('DogSelection');
  };
  /**********************************************************************************/

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.headerSection}>
          <Text variant='headlineLarge' style={styles.header}>
            Petology
          </Text>
          <View style={styles.closeButtonContainer}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={navigateToDogSelection}
            >
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section2}>
          <Text variant='headlineMedium' style={styles.headerSmall}>
            Skapa hund
          </Text>
          <TextInput
            style={styles.FormInput}
            placeholder='Namn'
            placeholderTextColor={'black'}
            onChangeText={setName}
          />
          <View style={styles.dropdownContainer}>
            <SelectList
              setSelected={setSelectedBreed}
              placeholder='Ras'
              
              // Transform array of objects to array of strings
              data={breedData.map(breed => breed.name)} 
              save='value'
              boxStyles={{
                borderRadius: 90,
                backgroundColor: '#e8f5f5',
                marginBottom: 18,
                width: '100%',
              }}
            />
          </View>
          <View style={styles.dropdownContainer}>
            <SelectList
              setSelected={setSelectedSex}
              placeholder='Kön'
              data={sexValues}
              save='value'
              boxStyles={{
                borderRadius: 90,
                backgroundColor: '#e8f5f5',
                marginBottom: 18,
              }}
            />
          </View>
          <Text> Födelsedatum:</Text>
          <DateTimePicker
            value={birthday}
            mode='date'
            locale='sv-SE'
            onChange={(event, selectedDateTime) => {
              if (selectedDateTime) {
                setBirthday(selectedDateTime);
                console.log(birthday);
              }
            }}
            style={{marginBottom: 20}}
          />
          <View style={styles.submitSection}>
            <Button
              mode='contained'
              onPress={handleCreateDog}
              style={{ width: '80%', height: '30%' }}
              buttonColor='#4a8483'
            > Skapa hund </Button>
          </View>
        </View>  
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
/**********************************************************************************/
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: '#92cdca',
  },
  scrollView: {},
  /**********************************************************************************/
  headerSection: {
    flex: 1,
    alignItems: 'center',
    height: 80,
    padding: 20,
  },
  headerText: {
    fontSize: 36,
    fontFamily: 'Cochin',
    opacity: 0.7,
  },
  /**********************************************************************************/
  section2: {
    height: 400,
    alignItems: 'center',
    paddingTop: 10,
  },
  header: {
    fontFamily: 'Cochin',
  },
  headerSmall: {
    fontFamily: 'Cochin',
    marginBottom: 15,
  },
  FormInput: {
    width: '80%',
    height: '12%',
    backgroundColor: '#e8f5f5',
    borderColor: 'grey',
    borderWidth: 1,
    borderRadius: 90,
    marginBottom: 18,
    textAlign: 'center',
  },
  dropdownContainer: {
    width: '80%',
  },
  submitSection: {
    height: 150,
    width: '75%',

    alignItems: 'center',
  },
  closeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 30,
  },
  closeButtonText: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButtonContainer: {
    position: 'absolute',
    // backgroundColor: 'gold',
    top: 28,
    left: 320,
  },

});

export default RegisterDogScreen;
