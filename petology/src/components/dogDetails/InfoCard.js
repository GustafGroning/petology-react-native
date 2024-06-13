import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const InfoCard = ({ type, data }) => {
  const renderContent = () => {
    switch (type) {
      case 'vaccination':
        return (
          <>
            <Text style={styles.cardTitle}>{data.name}</Text>
            <Text style={styles.cardSubTitle}>{data.vaccineName}</Text>
            <Text style={styles.cardText}>Datum: {data.date}</Text>
            <Text style={styles.cardText}>Nästa vaccination: {data.nextDate}</Text>
          </>
        );
      case 'medication':
        return (
          <>
            <Text style={styles.cardTitle}>{data.name}</Text>
            <Text style={styles.cardText}>{data.strength}</Text>
            <Text style={styles.cardText}>{data.administration_method}</Text>
            <Text style={styles.cardText}>{data.amount}</Text>
            <Text style={styles.cardText}>{data.frequency}</Text>
            <Text style={styles.cardText}>Startdatum: {data.administration_start_date}</Text>
            <Text style={styles.cardText}>Slutdatum: {data.administration_length}</Text>
          </>
        );
      case 'condition':
        return (
          <>
            <Text style={styles.cardTitle}>{data.name}</Text>
            <Text style={styles.cardText}>Debut: {data.onset_date}</Text>
            <Text style={styles.cardText}>Uppföljning: {data.follow_up_date}</Text>
            <Text style={styles.cardText}>Veterinärklinik: {data.vet_clinic}</Text>
            <Text style={styles.cardText}>Anteckningar: {data.notes}</Text>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.card}>
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardSubTitle: {
    fontSize: 16,
    marginBottom: 5,
  },
  cardText: {
    fontSize: 14,
    marginBottom: 5,
  },
});

export default InfoCard;
