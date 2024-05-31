import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';
import doggo from '../../../assets/doggo.jpg';

const HealthIndexBanner = ({ batches_in_row, last_performed_date, latest_batch, navigation, dog_id }) => {
  const [isToday, setIsToday] = useState(false);

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
    const today = new Date();
    const lastPerformed = new Date(last_performed_date);

    const isSameDay = (
      today.getFullYear() === lastPerformed.getFullYear() &&
      today.getMonth() === lastPerformed.getMonth() &&
      today.getDate() === lastPerformed.getDate()
    );

    setIsToday(isSameDay);
  }, [last_performed_date]);

  console.log('isToday ', isToday);
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={!isToday ? navigateToHealthIndexSurvey : null}
      disabled={isToday}
    >
      <View style={styles.imageContainer}>
        <ImageBackground   
          style={styles.dogImage}
          imageStyle={{ borderRadius: 30 }}
          source={doggo}
        />
        <Text style={styles.batchAmountTextStyling}>{batches_in_row} dagar</Text>
      </View>
      <View style={styles.textContainer}> 
        <Text>Undersökning</Text>
        <Text>
          {isToday ? 'klar med dagens undersökning' : 'Dagens undersökning redo'}
        </Text>
        <Text>{last_performed_date.split('T')[0]}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    height: 90,
    top: 10,
  },
  imageContainer: {
    flex: 1,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dogImage: {
    height: 90,
    width: 90,
    borderRadius: 30,
    left: 0,
    zIndex: 1,
  },
  batchAmountTextStyling: {
    position: 'absolute',
    fontSize: 22,
    zIndex: 1000,
    bottom: 10,
  },
  textContainer: {
    flex: 2,
    height: 90,
    width: '100%',
    backgroundColor: '#ebf9f8',
    zIndex: 0,
    justifyContent: 'center',
  },
  textStyle: {
    marginLeft: 70,
    marginBottom: 6,
    fontSize: 15,
  },
});

export default HealthIndexBanner;
