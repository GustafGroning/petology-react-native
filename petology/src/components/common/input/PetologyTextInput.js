import React from 'react';
import { View, StyleSheet, TextInput } from 'react-native';

const PetologyTextInput = ({ placeholder, value, onUpdateText }) => {

  const onHandleChangeText = () => {
    console.log(value);
    onUpdateText(value);
  };
  
  return (
    <View style={styles.container}>
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
  container: {},
  textInputStyling: {
    textAlign: 'center',
    height: 42,
    borderColor: 'black',
    borderWidth: 0.5,
    borderRadius: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    marginBottom: 15,
    fontSize: 16,
  },
});

export default PetologyTextInput;
