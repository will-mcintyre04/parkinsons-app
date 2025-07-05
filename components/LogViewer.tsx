import { Collapsible } from '@/components/Collapsible';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { deleteMedicineLog, getAllMedicineLogs } from '@/database/db-medical';
import { addTremorLog, deleteTremorLog, getAllTremorLogs } from '@/database/db-tremor';
import React, { useState } from 'react';
import { Alert, Button, StyleSheet, TextInput, View } from 'react-native';

import { printAllData, resetDatabase } from '@/database/db-service';

interface TremorLog {
  id: number;
  timestamp: string;
  frequency: number;
  amplitude: number;
  journal?: string;
  medicine_log_id: number | null;
}

interface MedicineLog {
  id: number;
  timestamp: string;
  medication: string;
  dosage: string;
  tremors: TremorLog[];
}

export default function LogViewer() {
  const [logs, setLogs] = useState<MedicineLog[]>([]);
  const [newFreq, setNewFreq] = useState<{ [key: number]: string }>({});
  const [newAmp, setNewAmp] = useState<{ [key: number]: string }>({});
  const [newNotes, setNewNotes] = useState<{ [key: number]: string }>({});

  const handleLoadLogs = () => {
    const meds = getAllMedicineLogs();
    const tremors = getAllTremorLogs();

    const joined = meds.map((med) => ({
      ...med,
      tremors: tremors.filter((t) => t.medicine_log_id === med.id),
    }));

    setLogs(joined);
  };

  const handleDeleteMed = (id: number) => {
    deleteMedicineLog(id);
    handleLoadLogs();
  };

  const handleDeleteTremor = (id: number) => {
    deleteTremorLog(id);
    handleLoadLogs();
  };

  const handleAddTremor = (medId: number) => {
    const timestamp = new Date().toISOString();
    const freq = parseFloat(newFreq[medId]);
    const amp = parseFloat(newAmp[medId]);
    const note = newNotes[medId]?.trim() || '';

    if (isNaN(freq) || isNaN(amp)) {
      Alert.alert('Invalid Input', 'Please enter valid numbers for frequency and amplitude');
      return;
    }

    addTremorLog(timestamp, freq, amp, note, medId);

    setNewFreq({ ...newFreq, [medId]: '' });
    setNewAmp({ ...newAmp, [medId]: '' });
    setNewNotes({ ...newNotes, [medId]: '' });
    handleLoadLogs();
  };

  return (
    <Collapsible title="📋 View all medication & tremor logs">
      <Button title="Print all data" onPress={printAllData} />
      <Button title="Reset Db" onPress={resetDatabase} />
      <Button title="Refresh Logs" onPress={handleLoadLogs} />

      {logs.length === 0 ? (
        <ThemedText>No logs yet.</ThemedText>
      ) : (
        logs.map((log) => (
          <ThemedView key={log.id} style={styles.card}>
            <View style={styles.row}>
              <ThemedText type="defaultSemiBold">💊 {log.medication}</ThemedText>
              <Button title="🗑️" onPress={() => handleDeleteMed(log.id)} />
            </View>
            <ThemedText>{log.dosage} — {log.timestamp}</ThemedText>

            <View style={styles.tremorContainer}>
              <ThemedText type="defaultSemiBold">Tremors:</ThemedText>
              {log.tremors.length > 0 ? (
                log.tremors.map((tremor) => (
                  <View key={tremor.id} style={styles.tremorRow}>
                    <ThemedText>
                      • {tremor.frequency} Hz, {tremor.amplitude} amp
                      {'\n'}🕒 {new Date(tremor.timestamp).toLocaleString()}
                      {tremor.journal ? `\n📝 ${tremor.journal}` : ''}
                    </ThemedText>
                    <Button title="❌" onPress={() => handleDeleteTremor(tremor.id)} />
                  </View>
                ))
              ) : (
                <ThemedText>No tremor logs</ThemedText>
              )}
            </View>

            <View style={styles.newTremorInputs}>
              <TextInput
                style={styles.input}
                placeholder="Freq"
                keyboardType="numeric"
                value={newFreq[log.id] || ''}
                onChangeText={(text) => setNewFreq({ ...newFreq, [log.id]: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Amp"
                keyboardType="numeric"
                value={newAmp[log.id] || ''}
                onChangeText={(text) => setNewAmp({ ...newAmp, [log.id]: text })}
              />
              <TextInput
                style={[styles.input, { minWidth: 100 }]}
                placeholder="Notes"
                value={newNotes[log.id] || ''}
                onChangeText={(text) => setNewNotes({ ...newNotes, [log.id]: text })}
              />
              <Button title="Add Tremor" onPress={() => handleAddTremor(log.id)} />
            </View>
          </ThemedView>
        ))
      )}
    </Collapsible>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 10,
    padding: 12,
    borderWidth: 1,
    borderRadius: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tremorContainer: {
    marginTop: 8,
  },
  tremorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  newTremorInputs: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    marginTop: 8,
    flexWrap: 'wrap',
  },
  input: {
    borderBottomWidth: 1,
    padding: 4,
    minWidth: 60,
  },
});
