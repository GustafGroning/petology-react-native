import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import getDogById from '../../api_calls/dog/getDogById';
import getLatestToothbrushingForDog from '../../api_calls/healthIndex/getLatestToothbrushingForDog';
import saveToothbrushing from '../../api_calls/healthIndex/saveToothbrushing';

const ToothbrushingBanner = ({ navigation, dog_id }) => {
  const [isToday, setIsToday] = useState(false);
  const [dogName, setDogName] = useState('');
  const [streak, setStreak] = useState(0);
  const [lastPerformed, setLastPerformed] = useState(null); // Add this state variable
  const [showModal, setShowModal] = useState(false);

  const fetchDogData = async () => {
    const dogData = await getDogById(dog_id);
    if (dogData) {
      setDogName(dogData.name);
    }
  };

  const fetchToothbrushingData = async () => {
    const data = await getLatestToothbrushingForDog(dog_id);
    if (data) {
      console.log('banner found toothbrush data ', data);
      const today = new Date();
      const lastPerformedDate = new Date(data.date_performed);
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);

      console.log('yesterday and today ', yesterday, today);

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

      console.log('isYesterday and isSameDay ', isYesterday, isSameDay);

      setIsToday(isSameDay);
      // if last date was yesterday, show streak. 
      // else (meaning there's been a gap), show 0
      setStreak(isYesterday || isSameDay ? data.streak : 0); 
      setLastPerformed(lastPerformedDate); // Set the lastPerformed date
    } else {
      setStreak(1);
      setLastPerformed(null); // Reset the lastPerformed date
    }
  };

  useEffect(() => {
    fetchDogData();
    fetchToothbrushingData();
  }, [dog_id]);

  const handleToothbrushing = async () => {
    console.log('inside handleToothbrushing');
    const today = new Date().toISOString().split('T')[0]; // Current date in YYYY-MM-DD format

    const newToothbrushingData = {
      date_performed: today,
      streak: streak + 1,
    };

    console.log("newToothbrushingData ", newToothbrushingData);

    const result = await saveToothbrushing(dog_id, newToothbrushingData);
    if (result.success) {
      setIsToday(true);
      setStreak(newToothbrushingData.streak);
    }
    setShowModal(false);
  };

  return (
    <View>
      <TouchableOpacity
        style={styles.container}
        onPress={!isToday ? () => setShowModal(true) : null}
        disabled={isToday}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Toothbrushing</Text>
          <FontAwesome name="heart" size={20} color="#000" style={styles.icon} />
          <Text style={styles.dogName}>{dogName}</Text>
        </View>
        <View style={styles.daysContainer}>
          <FontAwesome name="fire" size={20} color="#E94F37" />
          <Text style={styles.daysText}>{streak} dagar</Text>
        </View>
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>
            {isToday ? 'genomförd idag!' : 'starta tandborstning'}
          </Text>
        </View>
      </TouchableOpacity>

      <Modal
        visible={showModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Har du borstat tänderna idag?</Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity onPress={handleToothbrushing} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Ja</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowModal(false)} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Nej</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
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
    width: "75%",
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

export default ToothbrushingBanner;
