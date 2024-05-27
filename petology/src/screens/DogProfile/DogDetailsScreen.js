import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import getDogById from '../../api_calls/dog/getDogById';
import Footer from '../../components/common/Footer';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect hook

const DogDetailsScreen = ({ navigation, route }) => {
  const { dogId } = route.params;
  const [selectedDog, setSelectedDog] = useState(null);

  useEffect(() => {
    fetchSelectedDog();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchSelectedDog();
    }, [])
  );

  const fetchSelectedDog = async () => {
    try {
      const dogDetails = await getDogById(dogId);
      setSelectedDog(dogDetails);
    } catch (error) {
      console.error('Error fetching selected dog:', error);
    }
  };

  return (
    <View style={styles.container}>
      
          <TouchableOpacity
            style={styles.editInformationButton}
            onPress={() => navigation.navigate('UpdateDogDetailsScreen', { dogId: dogId })}
          >
            <FontAwesome name='edit' size={35} color='#000' />
          </TouchableOpacity>

      {selectedDog && (
        <View style={styles.dogInfoContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}> Information </Text>
        </View>
          <Text style={styles.dogInfoText}>Stamtavlenamn: {selectedDog?.pedigree_name}</Text>
          <Text style={styles.dogInfoText}>Ras: {selectedDog?.breed}</Text>
          <Text style={styles.dogInfoText}>Födelsedag: {selectedDog?.birthday}</Text>
          <Text style={styles.dogInfoText}>Kön: {selectedDog?.sex}</Text>
          <Text style={styles.dogInfoText}>Färg: {selectedDog?.color}</Text>

          <View style={styles.spaceBetweenFields}></View>

          <Text style={styles.dogInfoText}>ID-nummer: {selectedDog?.id_number}</Text>
          <Text style={styles.dogInfoText}>Registreringsnummer: {selectedDog?.registration_number}</Text>
          <Text style={styles.dogInfoText}>Passnummber: {selectedDog?.passport_number}</Text>

          <View style={styles.spaceBetweenFields}></View>

          <Text style={styles.dogInfoText}>Försäkringsbolag: {selectedDog?.insurance_company}</Text>
          <Text style={styles.dogInfoText}>Försäkringsnummer: {selectedDog?.insurance_number}</Text>

          <View style={styles.spaceBetweenFields}></View>

          <Text style={styles.dogInfoText}>Foder: {selectedDog?.feed}</Text>
          <Text style={styles.dogInfoText}>Eventuella foderintoleranser: {selectedDog?.possible_feed_intolerance}</Text>
        </View>
      )}
      <Footer navigation={navigation} />
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#92cdca',
    padding: 5,
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
    marginTop: 100,
    // backgroundColor: 'red',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  dogInfoText: {
    fontSize: 18,
    marginBottom: 10,
  },
  spaceBetweenFields: {
    marginBottom: 20,
  },
  editInformationButton: {
    zIndex: 1,
    position: 'absolute',
    top: 130, // should be 30 more than dogInfoContainer margin it seems 
    right: 30, 
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    // borderWidth: 1,
  },
});

export default DogDetailsScreen;
