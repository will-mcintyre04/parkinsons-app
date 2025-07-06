import { getTremorLogByMedicineLogId } from '@/database/db-tremor';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

type TremorLog = {
  id: number;
  timestamp: string;
  frequency: number;
  intensity: number;
  journal: string;
};

export default function SessionDetail() {
  const { medicineLogId } = useLocalSearchParams<{ medicineLogId: string }>();
  const [log, setLog] = useState<TremorLog | null>(null);

  useEffect(() => {
    if (!medicineLogId) return;
    const result = getTremorLogByMedicineLogId(Number(medicineLogId));
    if (result) setLog(result);
  }, [medicineLogId]);

  if (!log) {
    return (
      <View style={styles.container}>
        <Text style={styles.journal}>(No journal found for this session)</Text>
      </View>
    );
  }

  const formattedDate = new Date(log.timestamp).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
  });

  const formattedTime = new Date(log.timestamp).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <View style={styles.container}>
      <Text style={styles.date}>{formattedDate}</Text>
      <Text style={styles.time}>{formattedTime}</Text>

      <Text style={styles.label}>Tremor Frequency</Text>
      <Text style={styles.value}>{log.frequency} Hz</Text>

      <Text style={styles.label}>Tremor Intensity</Text>
      <Text style={styles.value}>{log.intensity}</Text>

      <Text style={styles.label}>Journal Entry</Text>
      <Text style={styles.journal}>{log.journal}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 24,
  },
  date: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1C1C1C',
    marginBottom: 2,
  },
  time: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1C',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 16,
    color: '#1C1C1C',
  },
  value: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  journal: {
    fontSize: 16,
    color: '#3A3A3A',
    lineHeight: 26,
    marginTop: 12,
  },
});
