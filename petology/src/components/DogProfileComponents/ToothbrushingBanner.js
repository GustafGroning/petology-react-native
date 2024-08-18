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
  const [lastPerformed, setLastPerformed] = useState(null);
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
      setStreak(isYesterday || isSameDay ? data.streak : 0); 
      setLastPerformed(lastPerformedDate);
    } else {
      setStreak(1);
      setLastPerformed(null);
    }
  };

  useEffect(() => {
    fetchDogData();
    fetchToothbrushingData();
  }, [dog_id]);

  const handleToothbrushing = async () => {
    const today = new Date().toISOString().split('T')[0];

    const newToothbrushingData = {
      date_performed: today,
      streak: streak + 1,
    };

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
        style={isToday ? styles.finishedSurveyContainer : styles.unfinishedSurveyContainer}
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
        animationType="fade"
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
  unfinishedSurveyContainer: {
    width: '90%', // Consistent width for all banners
    minWidth: 400,
    height: 95,
    borderRadius: 15,
    backgroundColor: '#9ecccb',
    padding: 10,
    marginVertical: 10,
    alignSelf: 'center', // Ensure the banner is centered
  },
  finishedSurveyContainer: {
    width: '90%', // Consistent width for all banners
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
    flex: 1,
    fontSize: 15,
    fontWeight: 'bold',
    marginRight: 5, // Add margin to prevent overlap with other elements
  },
  icon: {
    marginLeft: 10,
  },
  dogName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    maxWidth: '30%', // Ensure the dog name doesn't push content out of bounds
    textAlign: 'right', // Align text to the right to avoid overlap
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
    textAlign: 'right',
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  modalButton: {
    backgroundColor: '#4a90e2',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 10,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default ToothbrushingBanner;
