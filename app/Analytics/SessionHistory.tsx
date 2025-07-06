// components/SessionHistory.tsx
import { getAllTremorSessionsWithMedication } from '@/database/db-tremor';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Session = {
  tremor_id: number;
  timestamp: string;
  medication: string;
  dosage: string;
};

export default function SessionHistory() {
  const [logs, setLogs] = useState<Session[]>([]);
  const router = useRouter();

  useEffect(() => {
    const data = getAllTremorSessionsWithMedication();
    setLogs(data || []);
  }, []);

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Session History</Text>
      <View style={styles.card}>
        <ScrollView>
          {logs.map((log) => (
            <TouchableOpacity
              key={log.tremor_id}
              style={styles.entry}
              onPress={() => {
                router.push({
                  pathname: '/Analytics/SessionDetail',
                  params: {
                    tremor_id: log.tremor_id.toString(), // assuming tremor_id is used
                  },
                });
              }}
            >
              <View>
                <Text style={styles.date}>{formatDate(log.timestamp)}</Text>
                <Text style={styles.details}>
                  {log.dosage} of {log.medication} | {formatTime(log.timestamp)}
                </Text>
              </View>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f1ece4',
  },
  title: {
    marginTop: 50,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#d9d4ce',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    maxHeight: '90%',
  },
  entry: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontWeight: '600',
    fontSize: 16,
  },
  details: {
    color: '#333',
    fontSize: 14,
    marginTop: 2,
  },
  arrow: {
    fontSize: 24,
    color: '#444',
  },
});
