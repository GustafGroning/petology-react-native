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
import { LinearGradient } from 'expo-linear-gradient';

const DogMainScreen = ({ navigation, route }) => {
  const [selectedDog, setSelectedDog] = useState(null);
  const [dogTasks, setDogTasks] = useState([]);
  const [healthIndexLatestRow, setHealthIndexLatestRow] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
      const incompleteTasks = tasks.filter(task => !task.completed);
      setDogTasks(incompleteTasks);
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

  const handleTaskCompletion = async (taskId, completed) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (token) {
        await fetch(`${process.env.EXPO_PUBLIC_DEV_URL}/api/tasks/patch/${taskId}/`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${token}`,
          },
          body: JSON.stringify({ completed }),
        });
        fetchDogTasks();
      }
    } catch (error) {
      console.error('Error updating task completion:', error);
    }
  };

  const handleTaskDeletion = async (taskId) => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (token) {
        await fetch(`${process.env.EXPO_PUBLIC_DEV_URL}/api/tasks/delete/${taskId}/`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${token}`,
          },
        });
        fetchDogTasks();
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <LinearGradient 
      colors={['#86c8c5', '#e4f4f2']}
      style={styles.container}
    >
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

  <Text style={styles.dogInfoLabel}>Stamtavlenamn: <Text style={styles.dogInfoText}>{selectedDog?.pedigree_name}</Text></Text>
  <Text style={styles.dogInfoLabel}>Ras: <Text style={styles.dogInfoText}>{selectedDog?.breed}</Text></Text>
  <Text style={styles.dogInfoLabel}>Födelsedag: <Text style={styles.dogInfoText}>{selectedDog?.birthday}</Text></Text>
  <Text style={styles.dogInfoLabel}>Kön: <Text style={styles.dogInfoText}>{selectedDog?.sex}</Text></Text>
  <Text style={styles.dogInfoLabel}>Färg: <Text style={styles.dogInfoText}>{selectedDog?.color}</Text></Text>

  <View style={styles.spaceBetweenFields}></View>

  <Text style={styles.dogInfoLabel}>ID-nummer: <Text style={styles.dogInfoText}>{selectedDog?.id_number}</Text></Text>
  <Text style={styles.dogInfoLabel}>Registreringsnummer: <Text style={styles.dogInfoText}>{selectedDog?.registration_number}</Text></Text>
  <Text style={styles.dogInfoLabel}>Passnummer: <Text style={styles.dogInfoText}>{selectedDog?.passport_number}</Text></Text>

  <View style={styles.spaceBetweenFields}></View>

  <Text style={styles.dogInfoLabel}>Försäkringsbolag: <Text style={styles.dogInfoText}>{selectedDog?.insurance_company}</Text></Text>
  <Text style={styles.dogInfoLabel}>Försäkringsnummer: <Text style={styles.dogInfoText}>{selectedDog?.insurance_number}</Text></Text>

  <View style={styles.spaceBetweenFields}></View>

  <Text style={styles.dogInfoLabel}>Foder: <Text style={styles.dogInfoText}>{selectedDog?.feed}</Text></Text>
  <Text style={styles.dogInfoLabel}>Eventuella foderintoleranser: <Text style={styles.dogInfoText}>{selectedDog?.possible_feed_intolerance}</Text></Text>
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
              onCheckChange={(newCheckState) => handleTaskCompletion(task.id, newCheckState)}
              onDeleteTask={handleTaskDeletion}
              onUpdateTask={(taskId, updatedTask) => {
                setDogTasks(prevTasks => prevTasks.map(task => task.id === taskId ? updatedTask : task));
              }}
            />
          ))}
        </View>
      </ScrollView>
      <Footer style={styles.footer} navigation={navigation} />
    </LinearGradient>
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
    marginTop: 55,
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
  dogInfoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  dogInfoText: {
    fontSize: 16,
    fontWeight: 'normal',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    opacity: 0.7,
  },
  taskListContainer: {
    borderRadius: 20,
    backgroundColor: '#e4f4f2',
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
