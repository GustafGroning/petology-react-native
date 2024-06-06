import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// API's
import getDogById from '../../api_calls/dog/getDogById';
import getTasksForDog from '../../api_calls/task/getTaskForDog';
import getLatestHealthIndexRowForDog from '../../api_calls/healthIndex/getLatestHealthIndexRowForDog';

// COMPONENTS
import HealthIndexBanner from '../../components/DogProfileComponents/HealthIndexBanner';

// STYLING
import Footer from '../../components/common/Footer';
import Task from '../../components/common/task/Task';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const DogMainScreen = ({ navigation, route }) => {
  const [selectedDog, setSelectedDog] = useState(null);
  const [dogTasks, setDogTasks] = useState([]);
  const [healthIndexLatestRow, setHealthIndexLatestRow] = useState(null);

  const { dogId } = route.params;
  console.log('dogId in Main ', dogId);

  useFocusEffect(
    useCallback(() => {
      fetchSelectedDog();
      fetchDogTasks();
      fetchLatestHealthIndexRowForDog();
    }, [dogId])
  );

  useEffect(() => {
    if (selectedDog?.birthday) {
      const age = calculateAge(selectedDog.birthday);
      console.log('Age:', age);
    }
  }, [selectedDog]);

  const fetchSelectedDog = async () => {
    try {
      const dogDetails = await getDogById(dogId);
      setSelectedDog(dogDetails);
    } catch (error) {
      console.error('Error fetching selected dog:', error);
    }
  };

  const fetchDogTasks = async () => {
    try {
      const tasks = await getTasksForDog(dogId);
      setDogTasks(tasks);
    } catch (error) {
      console.error('Error fetching dog tasks:', error);
    }
  };

  const fetchLatestHealthIndexRowForDog = async () => {
    try {
      const row = await getLatestHealthIndexRowForDog(dogId);
      setHealthIndexLatestRow(row);
      console.log(row);
    } catch (error) {
      console.error('Error fetching latest health index row:', error);
    }
  };

  const calculateAge = (birthday) => {
    const birthDate = new Date(birthday);
    const ageDifMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.dogHeaderContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>{selectedDog?.name}</Text>
          </View>
        </View>

        <View style={styles.diagramContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Status</Text>
          </View>
        </View>

        <View style={styles.dogInfoContainer}>
          <View style={styles.infoHeaderContainer}>
            <Text style={styles.infoHeaderText}>Information</Text>
            <TouchableOpacity
              style={styles.editInformationButton}
              onPress={() => navigation.navigate('DogDetailsScreen', { dogId: dogId })}
            >
              <FontAwesome name='arrow-right' size={20} color='#000' />
            </TouchableOpacity>
          </View>

          <Text style={styles.dogInfoText}>Stamtavlenamn: {selectedDog?.pedigree_name}</Text>
          <Text style={styles.dogInfoText}>Ras: {selectedDog?.breed}</Text>
          <Text style={styles.dogInfoText}>Födelsedag: {selectedDog?.birthday}</Text>
          <Text style={styles.dogInfoText}>Kön: {selectedDog?.sex}</Text>
          <Text style={styles.dogInfoText}>Färg: {selectedDog?.color}</Text>

          <View style={styles.spaceBetweenFields}></View>

          <Text style={styles.dogInfoText}>ID-nummer: {selectedDog?.id_number}</Text>
          <Text style={styles.dogInfoText}>Registreringsnummer: {selectedDog?.registration_number}</Text>
          <Text style={styles.dogInfoText}>Passnummer: {selectedDog?.passport_number}</Text>

          <View style={styles.spaceBetweenFields}></View>

          <Text style={styles.dogInfoText}>Försäkringsbolag: {selectedDog?.insurance_company}</Text>
          <Text style={styles.dogInfoText}>Försäkringsnummer: {selectedDog?.insurance_number}</Text>

          <View style={styles.spaceBetweenFields}></View>

          <Text style={styles.dogInfoText}>Foder: {selectedDog?.feed}</Text>
          <Text style={styles.dogInfoText}>Eventuella foderintoleranser: {selectedDog?.possible_feed_intolerance}</Text>
        </View>

        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Pågående vårdplaner</Text>
        </View>
        <View style={styles.carePlanListContainer}>
          {healthIndexLatestRow && (
            <>
              <HealthIndexBanner 
                batches_in_row={healthIndexLatestRow.batches_in_row}          // Only for displaying streak.
                last_performed_date={healthIndexLatestRow.date_performed}     // Disables button if survey has been performed within 24h.
                latest_batch = {healthIndexLatestRow.latest_run_batch_id}
                navigation={navigation}
                dog_id={dogId}
              />
            </>
          )}
        </View>

        <View style={styles.taskListContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Dog's Tasks:</Text>
          </View>
          {dogTasks.map(task => (
            <Task
              key={task.id}
              taskId={task.id}
              taskName={task.name}
              startTime={task.start_time}
              notes={task.notes}
              location={task.location}
              dogName={task.dog}
              isCompleted={task.completed}
              onCheckChange={(newCheckState) => {/* Handle task completion */}}
              onDeleteTask={(taskId) => {/* Handle task deletion */}}
              onUpdateTask={(taskId, updatedTask) => {/* Handle task update */}}
            />
          ))}
        </View>
      </ScrollView>
      <Footer style={styles.footer} navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#92cdca',
  },
  scrollContent: {
    flexGrow: 1,
  },
  dogHeaderContainer: {
    marginTop: 40,
    height: 100,
    alignItems: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  diagramContainer: {
    height: 350,
    backgroundColor: '#F3EAC2',
    alignItems: 'center',
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 10,
  },
  dogInfoContainer: {
    backgroundColor: '#CDECE8',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    marginHorizontal: 20,
  },
  infoHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoHeaderText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  dogInfoText: {
    fontSize: 16,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    opacity: 0.7,
  },
  taskListContainer: {
    borderRadius: 10,
    marginHorizontal: 20,
    padding: 10,
    marginBottom: 20,
  },
  taskListHeader: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  editInformationButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
  },
  spaceBetweenFields: {
    marginBottom: 20,
  },
  carePlanListContainer: {
    height: 180,
    marginBottom: 25,
    alignItems: 'center',
  },
  footer: {
    position: 'absolute',
    top: 15,
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default DogMainScreen;
