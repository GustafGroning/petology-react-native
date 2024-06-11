import React from 'react';
import { View, StyleSheet, TextInput } from 'react-native';

const PetologyNumericInput = ({ placeholder, value, onUpdateText }) => {
  const handleChange = (text) => {
    // Ensure that the input only contains numbers
    const numericText = text.replace(/[^0-9]/g, '');
    onUpdateText(numericText);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInputStyling}
        placeholder={placeholder}
        value={value}
        onChangeText={handleChange}
        keyboardType='numeric'
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  textInputStyling: {
    textAlign: 'center',
    height: 40,
    borderColor: 'black',
    borderWidth: 0.5,
    borderRadius: 22,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    marginBottom: 15,
    width: '100%',
  },
});

export default PetologyNumericInput;
