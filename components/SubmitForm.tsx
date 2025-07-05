import React, { useState } from 'react';
import { ActivityIndicator, Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { addMedicineLog } from '../database/db-medical';
import { startRecording, stopRecording, transcribeWithAssembly } from '../database/speech-service';

export default function SubmitForm() {
  const [medication, setMedication] = useState('');
  const [dosage, setDosage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const handleSubmit = (): void => {
    if (!medication || !dosage) {
      Alert.alert('Missing info', 'Please provide medication and dosage');
      return;
    }

    const timestamp = new Date().toISOString();
    addMedicineLog(timestamp, medication, dosage);

    Alert.alert('Success', 'Medication log saved!');
    setMedication('');
    setDosage('');
  };

  const handleVoiceInput = async () => {
    try {
      if (isRecording) {
        setIsRecording(false);
        const uri = await stopRecording();
        setLoading(true);
        const text = await transcribeWithAssembly(uri);
        parseSpeechToForm(text);
      } else {
        setMedication('');
        setDosage('');
        await startRecording();
        setIsRecording(true);
      }
    } catch (e: any) {
      console.error(e);
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  const parseSpeechToForm = (text: string) => {
  console.log('🗣️ Transcribed:', text);

  // Remove punctuation for parsing
  const cleaned = text.replace(/[.,!?;]/g, '').toLowerCase();
  const segments = cleaned.split(/\s+/);

  let med = '', dose = ''
  let currentField: 'med' | 'dose' | null = null;

  for (const word of segments) {
    if (word.includes('medication')) {
      currentField = 'med';
      continue;
    } else if (word.includes('dosage')) {
      currentField = 'dose';
      continue;
    }

    if (currentField === 'med') med += word + ' ';
    else if (currentField === 'dose') dose += word + ' ';
  }

  const format = (val: string, isCapitalized: boolean = false) =>
    isCapitalized ? val.trim().toUpperCase() : val.trim();

  const finalMed = format(med, true);
  const finalDose = format(dose, true);;

  if (finalMed) setMedication(finalMed);
  if (finalDose) setDosage(finalDose);

  console.log(finalMed, finalDose)

  if (!finalMed && !finalDose) {
    Alert.alert('Could not extract fields', text);
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add Medication Log</Text>

      <Button
        title={isRecording ? '🎙️ Stop & Transcribe' : '🎤 Use Voice'}
        onPress={handleVoiceInput}
      />
      {loading && <ActivityIndicator style={{ marginVertical: 10 }} />}

      <TextInput
        style={styles.input}
        placeholder="Medication"
        value={medication}
        onChangeText={setMedication}
      />
      <TextInput
        style={styles.input}
        placeholder="Dosage"
        value={dosage}
        onChangeText={setDosage}
      />

      <Button title="Submit Log" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 20,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 10,
    padding: 8,
  },
});
