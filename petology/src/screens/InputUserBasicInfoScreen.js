import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import updateUserNames from '../api_calls/user/updateUserNames';
import Header from '../components/common/Header';

const InputUserBasicInfoScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = 
    useState('');

  const handleUpdateUserInfo = async () => {
    try {
      // Call the updateUserNames API with first name and last name
      await updateUserNames(firstName, lastName);
      // If successful, navigate to the next screen
      // Replace 'NextScreen' with the name of your next screen
      navigation.navigate('DogIntroduction');
    } catch (error) {
      console.error('Error updating user names:', error);
    }
  };

  return (
    <View style={styles.container}> 
      <Header> </Header>
      <TextInput
        style={styles.textInput}
        placeholder='Förnamn'
        placeholderTextColor={'black'}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.textInput}
        placeholder='Efternamn'
        placeholderTextColor={'black'}
        onChangeText={setLastName}
      />
      <Button
        mode='contained'
        onPress={handleUpdateUserInfo}
        style={{ width: '60%', height: 45 }}
        buttonColor='#4a8483'
      > Gå vidare </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 160,
    backgroundColor: '#92cdca',
    alignItems: 'center',
  },
  textInput: {
    width: '80%',
    height: 50,
    backgroundColor: '#e8f5f5',
    borderColor: 'grey',
    borderWidth: 1,
    borderRadius: 20,
    marginBottom: 18,
    textAlign: 'center',
  },
});

export default InputUserBasicInfoScreen;
