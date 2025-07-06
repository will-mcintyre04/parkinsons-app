import { getTremorLogByMedicineLogId } from '@/database/db-tremor';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

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
        <Text style={styles.journal}>No journal found for this session.</Text>
      </View>
    );
  }

  const date = new Date(log.timestamp);
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.date}>{formattedDate}</Text>
      <Text style={styles.time}>{formattedTime}</Text>

      <Text style={styles.journal}>{log.journal}</Text>

      <View style={styles.metricRow}>
        <View style={styles.metricBox}>
          <Text style={styles.metricValue}>{log.frequency.toFixed(1)}<Text style={styles.unit}> Hz</Text></Text>
          <Text style={styles.metricLabel}>Frequency</Text>
        </View>

        <View style={styles.metricBox}>
          <Text style={styles.metricValue}>{log.intensity.toFixed(1)}</Text>
          <Text style={styles.metricLabel}>Intensity</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 84,
    paddingHorizontal: 24,
    backgroundColor: 'white',
    flexGrow: 1,
  },
  date: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1C1C1C',
    marginBottom: 4,
  },
  time: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1C',
    marginBottom: 20,
  },
  journal: {
    fontSize: 18,
    color: '#3A3A3A',
    lineHeight: 28,
    marginBottom: 32,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  metricBox: {
    flex: 1,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1C1C1C',
  },
  unit: {
    fontSize: 18,
    fontWeight: '500',
    color: '#1C1C1C',
  },
  metricLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
    marginTop: 4,
  },
});
