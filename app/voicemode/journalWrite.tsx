import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function VoicePromptScreen() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHour = ((hours + 11) % 12 + 1); // convert to 12h format
    setTime(`${formattedHour}:${minutes}${ampm}`);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.date}>July 5</Text>
      <Text style={styles.time}>{time}</Text>
      <Text style={styles.message}>Awesome, I’m listening</Text>

      <TouchableOpacity style={styles.micButton}>
        <MaterialIcons name="keyboard-voice" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFE9E1',
    padding: 24,
    justifyContent: 'flex-start',
  },
  date: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1C1C1C',
    marginTop: 40,
  },
  time: {
    fontSize: 16,
    marginTop: 4,
    color: '#1C1C1C',
  },
  message: {
    marginTop: 24,
    fontSize: 18,
    color: '#5E5E5E',
  },
  micButton: {
    position: 'absolute',
    bottom: 40,
    right: 24,
    backgroundColor: '#1C1C1C',
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
  },
});

