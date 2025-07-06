import React, { useState } from 'react';
import {
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function MedicineDropdown({ medicines, selectedMedicine, setSelectedMedicine }) {
  const [open, setOpen] = useState(false);

  const selectedLabel = medicines.find((m) => m.id === selectedMedicine)?.medication || 'Select Medicine';

  return (
    <View style={styles.medicinePickerContainer}>
      <Text style={styles.pickerLabel}>Filter by Medicine</Text>

      {/* Dropdown trigger */}
      <TouchableOpacity style={styles.dropdownButton} onPress={() => setOpen(true)} activeOpacity={0.8}>
        <Text style={styles.dropdownText}>{selectedLabel}</Text>
        <Text style={styles.arrow}>⌄</Text>
      </TouchableOpacity>

      {/* Modal Dropdown */}
      <Modal visible={open} transparent animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <View style={styles.dropdownMenu}>
            <ScrollView style={styles.scrollContainer}>
              {medicines.map((med) => (
                <TouchableOpacity
                  key={med.id}
                  style={[
                    styles.medicineItem,
                    selectedMedicine === med.id && styles.selectedMedicineItem,
                  ]}
                  onPress={() => {
                    setSelectedMedicine(med.id);
                    setOpen(false);
                  }}
                >
                  <Text style={styles.medicineText}>{med.medication}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
    medicinePickerContainer: {
      marginTop: 24,
      paddingHorizontal: 16,
    },
    pickerLabel: {
      fontSize: 16,
      fontWeight: '500',
      marginBottom: 8,
      color: '#333',
    },
    dropdownButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#D7D1C9',
      borderRadius: 24,
      paddingVertical: 10,
      paddingHorizontal: 20,
    },
    dropdownText: {
      fontSize: 16,
      color: '#333',
      flex: 1,
    },
    arrow: {
      fontSize: 16,
      color: '#333',
      marginLeft: 8,
    },
    overlay: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: 'rgba(0,0,0,0.2)',
    },
    dropdownMenu: {
      backgroundColor: '#fff',
      marginHorizontal: 40,
      borderRadius: 12,
      maxHeight: 300,
    },
    scrollContainer: {
      paddingVertical: 4,
    },
    medicineItem: {
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
    selectedMedicineItem: {
      backgroundColor: '#DED7CD',
      borderRadius: 8,
    },
    medicineText: {
      fontSize: 16,
      color: '#333',
    },
  });
  
