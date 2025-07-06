import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { getLatestMedicineLog } from '@/database/db-medical'; // make sure this is implemented
import { addTremorLog } from '@/database/db-tremor';

export default function DatabaseDone() {
  const { frequency, amplitude, journal } = useLocalSearchParams<{
    frequency?: string;
    amplitude?: string;
    journal?: string;
  }>();

  useEffect(() => {
    if (frequency && amplitude) {
      const timestamp = new Date().toISOString();
      const freqVal = parseFloat(frequency);
      const ampVal = parseFloat(amplitude);
      const journalText = journal ?? '';

      // Get the latest med log ID
      const latestMed = getLatestMedicineLog();
      const medicineLogId = latestMed?.id ?? null;

      addTremorLog(timestamp, freqVal, ampVal, journalText, medicineLogId);
    }
  }, [frequency, amplitude, journal]);

  return (
    <View style={styles.container}>
      <MaterialIcons name="check-circle" size={80} color="#1C1C1C" />
      <Text style={styles.title}>Journal entry logged.</Text>
      <Text style={styles.subtitle}>Thanks for doing that :)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFE9E1',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 150,
  },
  title: {
    fontSize: 24,
    marginTop: 16,
    fontWeight: '600',
    color: '#1C1C1C',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 8,
    color: '#1C1C1C',
  },
  bottomArc: {
    position: 'absolute',
    bottom: -130,
    width: 500,
    height: 500,
    borderRadius: 250,
    backgroundColor: '#1C1C1C',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
