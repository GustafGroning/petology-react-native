import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DogListItem from '../components/DogSelectionScreenComponents/DogListItem';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import getDogsForUser from '../api_calls/dog/getDogsForUser';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect hook
import { LinearGradient } from 'expo-linear-gradient';

const DogSelectionScreen = ({ navigation }) => {
  const [dogs, setDogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDogs, setFilteredDogs] = useState([]);

  useEffect(() => {
    fetchDogs();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchDogs();
    }, [])
  );

  /**********************************************************************************/
  const fetchDogs = async () => {
    try {
      const data = await getDogsForUser();
      if (data) {
        setDogs(data);
        setFilteredDogs(data);
      } else {
        console.error('Failed to fetch dogs');
      }
    } catch (error) {
      console.error('Error fetching dogs', error);
    }
  };

  /**********************************************************************************/
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query === '') {
      setFilteredDogs(dogs);
    } else {
      const filtered = dogs.filter((dog) =>
        dog.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredDogs(filtered);
    }
  };

  /**********************************************************************************/
  const navigateToRegisterDog = () => {
    navigation.navigate('RegisterDog');
  };

  /**********************************************************************************/
  const handleSelectDog = async (dogId) => {
    try {
      await AsyncStorage.setItem('selectedDogId', dogId.toString());
      navigation.navigate('DogMainScreen', { dogId: dogId });
    } catch (error) {
      console.error('Error setting selected dog ID:', error);
    }
  };

  /**********************************************************************************/
  return (
    <LinearGradient
      colors={['#86c8c5', '#e4f4f2']}
      style={styles.container}
    >
      <View style={{ flex: 1 }}>
        <Header />
        <View style={styles.subHeaderSection}>
          <Text style={styles.subHeaderText}> Mina hundar </Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={navigateToRegisterDog}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.searchInput}
          placeholder='Search dogs...'
          value={searchQuery}
          onChangeText={handleSearch}
        />
        <ScrollView contentContainerStyle={styles.dogListScrollView}>
          {filteredDogs.map((dog) => (
            <DogListItem
              key={dog.id}
              name={dog.name}
              breed={dog.breed}
              birthday={dog.birthday}
              onPress={() => handleSelectDog(dog.id)}
            />
          ))}
        </ScrollView>
      </View>
      <Footer navigation={navigation} />
    </LinearGradient>
  );
};
/**********************************************************************************/
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    backgroundColor: '#92cdca',
    justifyContent: 'center',
  },
  headerSection: {
    paddingTop: 5,
    height: 75,
    width: '100%',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerText: {
    fontSize: 36,
    fontFamily: 'Cochin',
    opacity: 0.6,
  },
  subHeaderSection: {
    flexDirection: 'row',
    height: 40,
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  subHeaderText: {
    fontSize: 26,
    fontFamily: 'Cochin',
    marginLeft: 30,
  },
  dogListSection: {
    height: 500,
    width: '100%',
  },
  dogListScrollView: {
    alignItems: 'center',
  },
  listItem: {
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  itemText: {
    fontSize: 18,
  },
  addButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    backgroundColor: '#92cdca',
    left: 30,
  },
  addButtonText: {
    color: 'black',
    fontSize: 15,
    fontWeight: 'bold',
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 10,
    paddingHorizontal: 10,
  },
});

export default DogSelectionScreen;
