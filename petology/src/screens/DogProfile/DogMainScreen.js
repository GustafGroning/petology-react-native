import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RadarChart from '../../components/common/RadarChart';
import getDogById from '../../api_calls/dog/getDogById';
import getTasksForDog from '../../api_calls/task/getTaskForDog';
import getLatestHealthIndexRowForDog from '../../api_calls/healthIndex/getLatestHealthIndexRowForDog';
import getLatestToothbrushingForDog from '../../api_calls/healthIndex/getLatestToothbrushingForDog';
import HealthIndexBanner from '../../components/DogProfileComponents/HealthIndexBanner';
import ToothbrushingBanner from '../../components/DogProfileComponents/ToothbrushingBanner';
import Footer from '../../components/common/Footer';
import Task from '../../components/common/task/Task';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';

const screenWidth = Dimensions.get('window').width;
const labels = [
  'Munhälsa',
  'Ögon',
  'Allmäntillstånd',
  'Övrigt',
  'Hud och päls',
  'Rörelseapparat'
];
const chartSize = Dimensions.get('window').width - 150;

const DogMainScreen = ({ navigation, route }) => {
  const [selectedDog, setSelectedDog] = useState(null);
  const [dogTasks, setDogTasks] = useState([]);
  const [healthIndexLatestRow, setHealthIndexLatestRow] = useState(null);
  const [toothbrushingLatestRow, setToothbrushingLatestRow] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState(true);  // Add loading state

  const { dogId } = route.params;

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        await fetchSelectedDog();
        await fetchDogTasks();
        await fetchLatestToothbrushingForDog();
        setLoading(false);  // Set loading to false after data is fetched
      };
      fetchData();
    }, [navigation])
  );

  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      console.log('currently at DogMainScreen');
      fetchLatestHealthIndexRowForDog();
    }
  }, [isFocused]
);
    

  // useEffect(
  //   useCallback(() => {
  //     fetchLatestHealthIndexRowForDog();
  //   }, [dogId])
  // );

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
      setHealthIndexLatestRow(row || null);
    } catch (error) {
      console.error('Error fetching latest health index row:', error);
      setHealthIndexLatestRow(null);
    }
  };

  const fetchLatestToothbrushingForDog = async () => {
    try {
      const row = await getLatestToothbrushingForDog(dogId);
      setToothbrushingLatestRow(row || null);
    } catch (error) {
      console.error('Error fetching latest toothbrushing row:', error);
      setToothbrushingLatestRow(null);
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

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
          {healthIndexLatestRow ? (
            <>
              <RadarChart
                data={[
                  { label: 'Munhälsa', value: healthIndexLatestRow.dental_health },
                  { label: 'Ögon', value: healthIndexLatestRow.eyes },
                  { label: 'Allmäntillstånd', value: healthIndexLatestRow.general_condition },
                  { label: 'Övrigt', value: healthIndexLatestRow.other },
                  { label: 'Hud och päls', value: healthIndexLatestRow.skin_and_coat },
                  { label: 'Rörelseapparat', value: healthIndexLatestRow.locomotor_system }
                ]}
                size={chartSize}
              />
              {labels.map((label, i) => {
                const angle = (i * (2 * Math.PI)) / labels.length;
                const x = (chartSize / 2) + (chartSize / 2.5 * 1.35) * Math.cos(angle);
                const y = (chartSize / 2) + (chartSize / 2.5 * 1.2) * Math.sin(angle);
                return (
                  <Text key={i} style={[styles.label, { top: y + 50, left: x + 30 }]}>
                    {label}
                  </Text>
                );
              })}
            </>
          ) : (
            <Text style={styles.noDataText}>No health data available</Text>
          )}
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
          <HealthIndexBanner 
            navigation={navigation}
            dog_id={dogId}
            batches_in_row={healthIndexLatestRow?.batches_in_row || 0}
          />
          <ToothbrushingBanner 
            navigation={navigation}
            dog_id={dogId}
          />
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
              dogName={task.dog_name}
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
    marginTop: 120,
    height: 60,
    alignItems: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  diagramContainer: {
    height: 350,
    // backgroundColor: '#F3EAC2',
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
    height: 220,
    marginBottom: 25,
    alignItems: 'center',
  },
  label: {
    position: 'absolute',
    fontSize: 14,
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
