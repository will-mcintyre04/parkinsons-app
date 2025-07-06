import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { getLatestMedicineLog } from '@/database/db-medical'; // make sure this is implemented
import { addTremorLog } from '@/database/db-tremor';

export default function DatabaseDone() {
  const { frequency, intensity, journal } = useLocalSearchParams<{
    frequency?: string;
    intensity?: string;
    journal?: string;
  }>();
  console.log(journal)

  const router = useRouter();

  useEffect(() => {
    if (frequency && intensity) {
      const timestamp = new Date().toISOString();
      const freqVal = parseFloat(frequency);
      const ampVal = parseFloat(intensity);
      const journalText = journal ?? '';

      // Get the latest med log ID
      const latestMed = getLatestMedicineLog();
      const medicineLogId = latestMed?.id ?? null;

      addTremorLog(timestamp, freqVal, ampVal, journalText, medicineLogId);

      setTimeout(() => {
        router.push('/')
      }, 3000)
    }
  }, [frequency, intensity, journal, router]);

  return (
    <View style={styles.container}>
      <MaterialIcons name="check-circle" size={80} color="#1C1C1C" />
      <Text style={styles.title}>Session logged.</Text>
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
