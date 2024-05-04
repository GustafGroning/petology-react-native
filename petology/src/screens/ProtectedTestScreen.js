import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProtectedTestScreen = () => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        console.log('token for protected ', token);
        const response = await fetch(
          'http://localhost:8000/api/users/getUsername/', // Updated URL
          {
            method: 'GET',
            headers: {
              Authorization: `JWT ${token}`,
            },
          },
        );
        const data = await response.json();
        if (response.ok) {
          setMessage(`Hello, ${data.username}`); // Display the username
        } else {
          // Handle error response
          setMessage('Access Denied or Username not found');
        }
      } catch (error) {
        console.error('Error:', error);
        setMessage('Error fetching data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      {isLoading ? <ActivityIndicator /> : <Text>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // ... add other styles if needed ...
});

export default ProtectedTestScreen;
