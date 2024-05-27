import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
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

  useEffect(() => {
    fetchSelectedDog();
    fetchDogTasks();
    fetchLatestHealthIndexRowForDog();
  }, [dogId]);

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
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Information</Text>
          </View>
          <TouchableOpacity
            style={styles.editInformationButton}
            onPress={() => navigation.navigate('DogDetailsScreen', { dogId: dogId })}
          >
            <FontAwesome name='arrow-right' size={20} color='#000' />
          </TouchableOpacity>

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

        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Pågående vårdplaner</Text>
        </View>
        <View style={styles.carePlanListContainer}>
          {healthIndexLatestRow && (
            <>
              {/* <Text>batches_in_row: {healthIndexLatestRow.batches_in_row}</Text> */}
              <HealthIndexBanner batches_in_row={healthIndexLatestRow.batches_in_row} last_performed_date={healthIndexLatestRow.date_performed}/>
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
      <Footer navigation={navigation} />
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
    paddingBottom: 80, // Adjust this value as needed to ensure the Footer is visible
  },
  dogHeaderContainer: {
    marginTop: 150,
    height: 100,
    alignItems: 'center',
  },
  headerContainer: {
    alignItems: 'center',
  },
  diagramContainer: {
    height: 350,
    backgroundColor: 'gold',
    alignItems: 'center',
  },
  dogInfoContainer: {
    backgroundColor: 'red',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  dogInfoText: {
    fontSize: 18,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 36,
    fontFamily: 'Cochin',
    opacity: 0.7,
  },
  taskListContainer: {
    // padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,

    // marginTop: 20,
    height: 200,
  },
  taskListHeader: {
    fontSize: 24,
    fontWeight: 'bold',
  },

  editInformationButton: {
    zIndex: 1, // Set a higher zIndex for the button
    position: 'absolute', // Position the button absolutely
    top: 28, // Adjust the top position as needed
    right: 30, // Adjust the right position as needed
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
  },
  editInformationButtonText: {
    color: 'black',
    fontSize: 15,
    fontWeight: 'bold',
  },

  spaceBetweenFields: {
    marginBottom: 20,
  },
  carePlanListContainer: {
    height: 180,
  }
});

export default DogMainScreen;