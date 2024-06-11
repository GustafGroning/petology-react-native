import React from 'react';
import { StyleSheet } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';

const PetologyDropdown = ({ setSelected, placeholder, data, save }) => {
  return (
    <SelectList
      setSelected={setSelected}
      placeholder={placeholder}
      data={data}
      save={save}
      boxStyles={styles.dropdownBox}
      dropdownStyles={styles.dropdown}
      dropdownItemStyles={styles.dropdownItem}
      dropdownTextStyles={styles.dropdownText}
    />
  );
};

const styles = StyleSheet.create({
  dropdownBox: {
    width: '45%',
    borderRadius: 90,
    backgroundColor: '#e8f5f5',
    marginBottom: 18,
  },
  dropdown: {
    borderRadius: 10,
    backgroundColor: '#fff',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  dropdownText: {
    fontSize: 16,
  },
});

export default PetologyDropdown;
