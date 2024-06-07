import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import getDogById from '../../api_calls/dog/getDogById';

const HealthIndexBanner = ({ batches_in_row, last_performed_date, latest_batch, navigation, dog_id }) => {
  const [isToday, setIsToday] = useState(false);
  const [dogName, setDogName] = useState('');

  const navigateToHealthIndexSurvey = () =>  {
    console.log('test');
    console.log('latest batch ID ', latest_batch);
    console.log('dog_id to be sent ', dog_id);
    navigation.navigate('HealthIndexSurveyScreen', {
      latest_question_batch: latest_batch,
      dogId: dog_id
    });
  };

  useEffect(() => {
    const fetchDogData = async () => {
      const dogData = await getDogById(dog_id);
      if (dogData) {
        setDogName(dogData.name);
      }
    };

    fetchDogData();

    const today = new Date();
    const lastPerformed = new Date(last_performed_date);

    const isSameDay = (
      today.getFullYear() === lastPerformed.getFullYear() &&
      today.getMonth() === lastPerformed.getMonth() &&
      today.getDate() === lastPerformed.getDate()
    );

    setIsToday(isSameDay);
  }, [last_performed_date, dog_id]);

  console.log('isToday ', isToday);
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={!isToday ? navigateToHealthIndexSurvey : null}
      disabled={isToday}
    >
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Undersökning</Text>
        <FontAwesome name="heart" size={20} color="#000" style={styles.icon} />
        <Text style={styles.dogName}>{dogName}</Text>
      </View>
      <View style={styles.daysContainer}>
        <FontAwesome name="fire" size={20} color="#E94F37" />
        <Text style={styles.daysText}>{batches_in_row} dagar</Text>
      </View>
      <View style={styles.messageContainer}>
        <Text style={styles.messageText}>
          {isToday ? 'genomförd idag!' : 'starta undersökningen'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '90%',
    height: 95,
    borderRadius: 15,
    backgroundColor: '#9ecccb',
    padding: 10,
    marginVertical: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 15,
    fontWeight: 'bold',
    marginRight: 10,
  },
  icon: {
    marginRight: 10,
  },
  dogName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  daysContainer: {
    position: 'absolute',
    right: 10,
    top: 30,
    flexDirection: 'column',
    alignItems: 'center',
  },
  daysText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 5,
    color: '#E94F37',
  },
  messageContainer: {
    top: 15,
    right: 85,
    alignItems: 'center',
  },
  messageText: {
    color: 'blue',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HealthIndexBanner;