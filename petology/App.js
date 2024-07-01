import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// USER FLOW SCREENS
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import LandingPage from './src/screens/LandingPage';
import RegisterDogScreen from './src/screens/RegisterDogScreen';
import DogIntroductionScreen from './src/screens/DogIntroductionScreen';
import DogSelectionScreen from './src/screens/DogSelectionScreen';
import CalendarScreen from './src/screens/CalenderScreen';
import CreateTaskScreen from './src/screens/CreateTaskScreen';
import DogMainScreen from './src/screens/DogProfile/DogMainScreen';
import DogDetailsScreen from './src/screens/DogProfile/DogDetailsScreen';
import UpdateDogDetailsScreen from './src/screens/DogProfile/UpdateDogDetailsScreen';
import InputUserBasicInfoScreen from './src/screens/InputUserBasicInfoScreen';
import HealthIndexSurveyScreen from './src/screens/DogProfile/HealthIndexSurveyScreen';
import PulseMonitorScreen from './src/screens/PulseMonitorScreen';
import AddTreatmentScreen from './src/screens/AddTreatmentScreen';
import CreateVaccinationScreen from './src/screens/DogProfile/CreateVaccinationScreen';
import CreateConditionScreen from './src/screens/DogProfile/CreateConditionScreen';
import CreateMedicationScreen from './src/screens/DogProfile/CreateMedicationScreen';

// LIBRARY SCREENS
import ArticleListScreen from './src/screens/Library/ArticleListScreen';
import ArticleScreen from './src/screens/Library/ArticleScreen';
import LibraryScreen from './src/screens/Library/LibraryScreen';
import FrequentlyAskedQuestionsScreen from './src/screens/Library/FrequentlyAskedQuestionsScreen';
import AboutUsScreen from './src/screens/Library/AboutUsScreen';
import ContactUsScreen from './src/screens/Library/ContactUsScreen';
import PolicyScreen from './src/screens/Library/PolicyScreen';
import { Input } from '@rneui/base';
/**************************************************************/
const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Login'   screenOptions={{
    headerShown: false
  }}>
          <Stack.Screen name='Login' component={LoginScreen} />
          <Stack.Screen name='SignUp' component={SignUpScreen} />
          <Stack.Screen name='Landing' component={LandingPage} />
          <Stack.Screen name='RegisterDog' component={RegisterDogScreen} />
          <Stack.Screen name='DogSelection' component={DogSelectionScreen} />
          <Stack.Screen name='DogIntroduction' component={DogIntroductionScreen} />
          <Stack.Screen name='Calendar' component={CalendarScreen} />
          <Stack.Screen name='CreateTask' component={CreateTaskScreen} />
          <Stack.Screen name='DogMainScreen' component={DogMainScreen} />
          <Stack.Screen name='DogDetailsScreen' component={DogDetailsScreen} />
          <Stack.Screen name='UpdateDogDetailsScreen' component={UpdateDogDetailsScreen} />
          <Stack.Screen name='InputUserBasicInfoScreen' component={InputUserBasicInfoScreen} />
          <Stack.Screen name='HealthIndexSurveyScreen' component={HealthIndexSurveyScreen} />
          <Stack.Screen name='PulseMonitorScreen' component={PulseMonitorScreen} />
          <Stack.Screen name='AddTreatmentScreen' component={AddTreatmentScreen} />
          <Stack.Screen name='CreateVaccinationScreen' component={CreateVaccinationScreen} />
          <Stack.Screen name='CreateConditionScreen' component={CreateConditionScreen} />
          <Stack.Screen name='CreateMedicationScreen' component={CreateMedicationScreen} />
          
          
          <Stack.Screen name='ArticleList' component={ArticleListScreen} />
          <Stack.Screen name='ArticleScreen' component={ArticleScreen} />
          <Stack.Screen name='LibraryScreen' component={LibraryScreen} />
          <Stack.Screen name='FrequentlyAskedQuestionsScreen' component={FrequentlyAskedQuestionsScreen} />
          <Stack.Screen name='ContactUsScreen' component={ContactUsScreen} />
          <Stack.Screen name='AboutUsScreen' component={AboutUsScreen} />
          <Stack.Screen name='PolicyScreen' component={PolicyScreen} />

          
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;
