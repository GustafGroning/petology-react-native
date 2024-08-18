import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useFocusEffect } from '@react-navigation/native';
import getDogById from '../../api_calls/dog/getDogById';
import getLatestHealthIndexRowForDog from '../../api_calls/healthIndex/getLatestHealthIndexRowForDog';

const HealthIndexBanner = ({ navigation, dog_id, batches_in_row }) => {
  const [isToday, setIsToday] = useState(false);
  const [dogName, setDogName] = useState('');
  const [displayBatchesInRow, setDisplayBatchesInRow] = useState(0);
  const [latestBatchId, setLatestBatchId] = useState(0);

  const fetchDogData = async () => {
    const dogData = await getDogById(dog_id);
    if (dogData) {
      setDogName(dogData.name);
    }
  };

  const fetchHealthIndexData = async () => {
    const data = await getLatestHealthIndexRowForDog(dog_id);
    if (data) {
      const today = new Date();
      const lastPerformedDate = new Date(data.date_performed);
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);

      const isSameDay = (
        today.getFullYear() === lastPerformedDate.getFullYear() &&
        today.getMonth() === lastPerformedDate.getMonth() &&
        today.getDate() === lastPerformedDate.getDate()
      );

      const isYesterday = (
        yesterday.getFullYear() === lastPerformedDate.getFullYear() &&
        yesterday.getMonth() === lastPerformedDate.getMonth() &&
        yesterday.getDate() === lastPerformedDate.getDate()
      );

      setIsToday(isSameDay);
      setDisplayBatchesInRow(isYesterday || isSameDay ? data.batches_in_row : 0);
      setLatestBatchId(data.latest_run_batch_id);
    } else {
      setDisplayBatchesInRow(1);
      setLatestBatchId(1);
    }
  };

  // Re-fetch data whenever the screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchDogData();
      fetchHealthIndexData();
    }, [dog_id])
  );

  const navigateToHealthIndexSurvey = () => {
    navigation.navigate('HealthIndexSurveyScreen', {
      latest_question_batch: latestBatchId,
      dogId: dog_id,
    });
  };

  return (
    <TouchableOpacity
      style={isToday ? styles.finishedSurveyContainer : styles.unfinishedSurveyContainer}
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
        <Text style={styles.daysText}>{displayBatchesInRow} dagar</Text>
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
  unfinishedSurveyContainer: {
    width: '90%', // Use a consistent width for all banners
    minWidth: 400,
    height: 95,
    borderRadius: 15,
    backgroundColor: '#9ecccb',
    padding: 10,
    marginVertical: 10,
    alignSelf: 'center', // Ensure the banner is centered
  },
  finishedSurveyContainer: {
    width: '90%', // Use a consistent width for all banners
    minWidth: 400,
    height: 95,
    borderRadius: 15,
    backgroundColor: 'lightgreen',
    padding: 10,
    marginVertical: 10,
    alignSelf: 'center', // Ensure the banner is centered
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Ensure equal spacing
  },
  headerText: {
    flex: 1, // Allow the text to take available space
    fontSize: 15,
    fontWeight: 'bold',
  },
  icon: {
    marginLeft: 10,
  },
  dogName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10, // Add margin to avoid overlapping
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
    color: '#E94F37',
  },
  messageContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    alignItems: 'flex-end',
  },
  messageText: {
    color: 'blue',
    fontSize: 18,
    fontWeight: 'bold',
  },
});


export default HealthIndexBanner;
