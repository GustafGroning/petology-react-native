import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

const PetologyTextInput = ({ placeholder, value, onUpdateText, style }) => {
  return (
    <View style={[styles.container, style]}>
      <TextInput
        style={styles.textInputStyling}
        placeholder={placeholder}
        value={value}
        onChangeText={onUpdateText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    width: '100%',
  },
  textInputStyling: {
    textAlign: 'center',
    height: 40,
    borderColor: 'black',
    borderWidth: 0.5,
    borderRadius: 22,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
});

export default PetologyTextInput;
