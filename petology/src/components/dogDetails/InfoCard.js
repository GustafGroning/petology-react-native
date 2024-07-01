import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Button } from 'react-native';
import { CheckBox } from "@rneui/themed";
import PetologyDatePicker from '../common/input/PetologyDatePicker';
import updateVaccinationById from '../../api_calls/healthRecords/vaccinations/updateVaccinationById';
import deleteVaccinationById from '../../api_calls/healthRecords/vaccinations/deleteVaccinationById';
import deleteCondition from "../../api_calls/healthRecords/conditions/deleteCondition";
import updateCondition from "../../api_calls/healthRecords/conditions/updateCondition";
import deleteMedication from "../../api_calls/healthRecords/medications/deleteMedication";
import updateMedication from "../../api_calls/healthRecords/medications/updateMedication";

const InfoCard = ({ type, data, onUpdate, onDelete }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editedData, setEditedData] = useState({ ...data });
  const [healed, setHealed] = useState(data.healed || false);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };
  const handleSave = () => {
    let updatedData;
    switch (type) {
        case 'condition':
            updatedData = {
                ...editedData,
                healed: healed, // Include the healed field for conditions
                onset_date: editedData.onsetDate,
                follow_up_date: editedData.followUpDate,
                vet_clinic: editedData.vetClinic,
                notes: editedData.notes,
                medication: editedData.medication,
            };
            break;
        case 'vaccination':
            updatedData = {
                ...editedData,
                vaccination_date: editedData.date,
                next_vaccination_date: editedData.followUpDate,
            };
            break;
        case 'medication':
            updatedData = {
                ...editedData,
                administration_method: editedData.administrationMethod,
                administration_start_date: editedData.administrationStartDate,
                administration_length: editedData.administrationLength,
            };
            break;
        default:
            updatedData = { ...editedData };
    }

    console.log('the stuff being passed to parent ', updatedData, type);
    onUpdate(updatedData, type); // Pass the entire updated data and type
    setIsModalVisible(false);
};

  


  

  const handleDelete = () => {
    onDelete(data.id);
    setIsModalVisible(false);
  };

  const renderContent = () => {
    switch (type) {
      case 'vaccination':
        return (
          <>
            <Text style={styles.cardTitle}>{data.name}</Text>
            <Text style={styles.cardSubTitle}>{data.vaccineName}</Text>
            <Text style={styles.cardText}>Datum: {data.date}</Text>
            <Text style={styles.cardText}>Nästa vaccination: {data.followUpDate}</Text>
          </>
        );
      case 'medication':
        return (
          <>
            <Text style={styles.cardTitle}>{data.name}</Text>
            <Text style={styles.cardText}>Styrka: {data.strength}</Text>
            <Text style={styles.cardText}>Administrationsmetod: {data.administrationMethod}</Text>
            <Text style={styles.cardText}>Mängd: {data.amount}</Text>
            <Text style={styles.cardText}>Frekvens: {data.frequency}</Text>
            <Text style={styles.cardText}>Startdatum: {data.administrationStartDate}</Text>
            <Text style={styles.cardText}>Längd: {data.administrationLength}</Text>
          </>
        );
      case 'condition':
        return (
          <>
            <Text style={styles.cardTitle}>{data.name}</Text>
            <Text style={styles.cardText}>Debut: {data.onsetDate}</Text>
            <Text style={styles.cardText}>Uppföljning: {data.followUpDate}</Text>
            <Text style={styles.cardText}>Veterinärklinik: {data.vetClinic}</Text>
            <Text style={styles.cardText}>Anteckningar: {data.notes}</Text>
          </>
        );
      default:
        return null;
    }
  };

  const renderModalContent = () => {
    switch (type) {
      case 'vaccination':
        return (
          <>
            <Text style={styles.inputLabel}>Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={editedData.name}
              onChangeText={(text) => setEditedData({ ...editedData, name: text })}
            />
            <Text style={styles.inputLabel}>Vaccine Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Vaccine Name"
              value={editedData.vaccineName}
              onChangeText={(text) => setEditedData({ ...editedData, vaccineName: text })}
            />
            <Text style={styles.inputLabel}>Date</Text>
            <PetologyDatePicker
              title="Date"
              date={editedData.date ? new Date(editedData.date) : new Date()}
              onDateTimeChange={(date) => setEditedData({ ...editedData, date: date.toISOString().split('T')[0] })}
            />
            <Text style={styles.inputLabel}>Next Vaccination Date</Text>
            <PetologyDatePicker
              title="Next Vaccination Date"
              date={editedData.followUpDate ? new Date(editedData.followUpDate) : new Date()}
              onDateTimeChange={(date) => setEditedData({ ...editedData, followUpDate: date.toISOString().split('T')[0] })}
            />
          </>
        );
      case 'medication':
        return (
          <>
            <Text style={styles.inputLabel}>Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={editedData.name}
              onChangeText={(text) => setEditedData({ ...editedData, name: text })}
            />
            <Text style={styles.inputLabel}>Strength</Text>
            <TextInput
              style={styles.input}
              placeholder="Strength"
              value={editedData.strength}
              onChangeText={(text) => setEditedData({ ...editedData, strength: text })}
            />
            <Text style={styles.inputLabel}>Administration Method</Text>
            <TextInput
              style={styles.input}
              placeholder="Administration Method"
              value={editedData.administrationMethod}
              onChangeText={(text) => setEditedData({ ...editedData, administrationMethod: text })}
            />
            <Text style={styles.inputLabel}>Amount</Text>
            <TextInput
              style={styles.input}
              placeholder="Amount"
              value={editedData.amount}
              onChangeText={(text) => setEditedData({ ...editedData, amount: text })}
            />
            <Text style={styles.inputLabel}>Frequency</Text>
            <TextInput
              style={styles.input}
              placeholder="Frequency"
              value={editedData.frequency}
              onChangeText={(text) => setEditedData({ ...editedData, frequency: text })}
            />
            <Text style={styles.inputLabel}>Start Date</Text>
            <PetologyDatePicker
              title="Start Date"
              date={editedData.administrationStartDate ? new Date(editedData.administrationStartDate) : new Date()}
              onDateTimeChange={(date) => setEditedData({ ...editedData, administrationStartDate: date.toISOString().split('T')[0] })}
            />
            <Text style={styles.inputLabel}>Length</Text>
            <PetologyDatePicker
              title="Length"
              date={editedData.administrationLength ? new Date(editedData.administrationLength) : new Date()}
              onDateTimeChange={(date) => setEditedData({ ...editedData, administrationLength: date.toISOString().split('T')[0] })}
            />
          </>
        );
      case 'condition':
        return (
          <>
            <Text style={styles.inputLabel}>Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={editedData.name}
              onChangeText={(text) => setEditedData({ ...editedData, name: text })}
            />
            <Text style={styles.inputLabel}>Onset Date</Text>
            <PetologyDatePicker
              title="Onset Date"
              date={editedData.onsetDate ? new Date(editedData.onsetDate) : new Date()}
              onDateTimeChange={(date) => setEditedData({ ...editedData, onsetDate: date.toISOString().split('T')[0] })}
            />
            <Text style={styles.inputLabel}>Follow Up Date</Text>
            <PetologyDatePicker
              title="Follow Up Date"
              date={editedData.followUpDate ? new Date(editedData.followUpDate) : new Date()}
              onDateTimeChange={(date) => setEditedData({ ...editedData, followUpDate: date.toISOString().split('T')[0] })}
            />
            <Text style={styles.inputLabel}>Vet Clinic</Text>
            <TextInput
              style={styles.input}
              placeholder="Vet Clinic"
              value={editedData.vetClinic}
              onChangeText={(text) => setEditedData({ ...editedData, vetClinic: text })}
            />
            <Text style={styles.inputLabel}>Notes</Text>
            <TextInput
              style={styles.input}
              placeholder="Notes"
              value={editedData.notes}
              onChangeText={(text) => setEditedData({ ...editedData, notes: text })}
            />
            <CheckBox
              center
              title="Healed"
              checkedIcon="check-square-o"
              uncheckedIcon="square-o"
              checked={healed}
              onPress={() => setHealed(!healed)}
              containerStyle={{ backgroundColor: "transparent" }}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={toggleModal}>
        {renderContent()}
      </TouchableOpacity>
      <Modal visible={isModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          {renderModalContent()}
          <Button title="Save" onPress={handleSave} />
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
          <Button title="Cancel" onPress={toggleModal} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardSubTitle: {
    fontSize: 16,
    marginBottom: 5,
  },
  cardText: {
    fontSize: 14,
    marginBottom: 5,
  },
  modalContainer: {
    paddingTop: 100,
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: "red",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});


export default InfoCard;
