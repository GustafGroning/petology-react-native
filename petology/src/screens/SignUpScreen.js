import React, { useState } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { Button, Text } from 'react-native-paper';
import signUpUser from '../api_calls/user/signUpUser';
import { LinearGradient } from 'expo-linear-gradient';

const SignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignUp = async () => {
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Invalid email address');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Lösenordet måste vara minst 8 tecken ');
      return;
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]*$/;
    if (!passwordRegex.test(password)) {
      setErrorMessage('Lösenordet måste innehålla minst en bokstav och en siffra');
      return;
    }

    const result = await signUpUser(email, password);  // Use the new API function

    if (result.success) {
      console.log('Registration successful', result.token);
      navigation.navigate('Login');
    } else {
      setErrorMessage(result.message);
    }
  };

  return (
    <LinearGradient
      colors={['#86c8c5', '#e4f4f2']}
      style={styles.container}
    >
      <View style={styles.headerBox}>
        <View style={styles.headerContainer}>
          <Text variant='headlineMedium'> Skapa konto </Text>
        </View>
      </View>
      <View style={styles.inputBox}>
        <TextInput
          style={styles.input}
          placeholder='Email'
          value={email}
          onChangeText={setEmail}
          autoCapitalize='none'
          textAlign={'center'}
        />
        <TextInput
          style={styles.input}
          placeholder='Lösenord'
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize='none'
          textAlign={'center'}
        />
        <Text style={styles.errorTextStatic}>
          Lösenordet måste vara minst 8 tecken och innehålla minst en bokstav och en siffra
        </Text>
        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
        <Button
          mode='contained'
          style={{ borderRadius: 2, width: '85%' }}
          onPress={handleSignUp}
        >
          Skapa konto
        </Button>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <Text> Har du redan ett konto?</Text>
          <Button onPress={() => navigation.navigate('Login')}>
            Logga in
          </Button>
        </View>
      </View>
      <View style={styles.boxFour}></View>
    </LinearGradient>
  );  
};

const styles = StyleSheet.create({
  container: {
    // backgroundColor: '#92cdca',
    flex: 1,
    justifyContent: 'space-around',
    paddingTop: 40,
  },
  headerBox: {
    flex: 1,
    // backgroundColor: '#92cdca',
    alignItems: 'center',
    padding: 10,
  },
  headerContainer: {
    paddingTop: 25,
  },
  inputBox: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  input: {
    width: '85%',
    height: 45,
    backgroundColor: 'white',
    marginBottom: 14,
    alignContent: 'center',
    justifyContent: 'center',
  },
  boxFour: {
    flex: 3,
    padding: 10,
  },
  errorTextStatic: {
    marginBottom: 10,
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
});


export default SignUpScreen;
