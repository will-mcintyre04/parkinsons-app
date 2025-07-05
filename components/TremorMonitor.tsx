import { DeviceMotion } from 'expo-sensors';
import React, { useRef, useState } from 'react';
import {
    ActivityIndicator,
    Button,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { ThemedText } from './ThemedText';

const SAMPLE_RATE = 50;
const SAMPLE_INTERVAL = 1000 / SAMPLE_RATE;
const WINDOW_SIZE = 256;

export default function TremorMonitor() {
  const [buffer, setBuffer] = useState<number[]>([]);
  const [std, setStd] = useState<number | null>(null);
  const [isMeasuring, setIsMeasuring] = useState(false);
  const subscriptionRef = useRef<any>(null);

  const startMeasurement = () => {
    setBuffer([]);
    setStd(null);
    setIsMeasuring(true);

    DeviceMotion.setUpdateInterval(SAMPLE_INTERVAL);
    subscriptionRef.current = DeviceMotion.addListener(({ acceleration }) => {
      if (!acceleration) return;
      const { x = 0, y = 0, z = 0 } = acceleration;
      const mag = Math.sqrt(x ** 2 + y ** 2 + z ** 2);

      setBuffer(prev => {
        const updated = [...prev, mag];
        if (updated.length >= WINDOW_SIZE) {
          subscriptionRef.current?.remove();
          computeSTD(updated.slice(-WINDOW_SIZE));
          setIsMeasuring(false);
        }
        return updated;
      });
    });
  };

  const computeSTD = (samples: number[]) => {
    const mean = samples.reduce((a, b) => a + b, 0) / samples.length;
    const std = Math.sqrt(
      samples.reduce((sum, val) => sum + (val - mean) ** 2, 0) / samples.length
    );
    setStd(std);
  };

  const getLevel = () => {
    if (std === null) return { label: '—', color: '#ccc', emoji: '❔' };
    if (std < 0.3) return { label: 'None', color: '#4caf50', emoji: '✅' };
    if (std < 0.7) return { label: 'Mild', color: '#ffc107', emoji: '🟡' };
    if (std < 1.5) return { label: 'Moderate', color: '#ff9800', emoji: '🟠' };
    return { label: 'Severe', color: '#f44336', emoji: '🔴' };
  };

  const { label, color, emoji } = getLevel();

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <Button
        title={isMeasuring ? 'Collecting...' : 'Start 5s Test'}
        onPress={startMeasurement}
        disabled={isMeasuring}
        color={isMeasuring ? 'gray' : '#7b61ff'}
      />

      {isMeasuring && (
        <ActivityIndicator size="large" color="#7b61ff" style={{ marginTop: 20 }} />
      )}

      {!isMeasuring && std !== null && (
        <View style={[styles.resultBox, { borderColor: color }]}>
          <ThemedText type="subtitle">
            Tremor Intensity: <Text style={styles.bold}>{std.toFixed(3)}</Text>
          </ThemedText>
          <Text style={[styles.levelText, { color }]}>{emoji} {label}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    paddingBottom: 100,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 30,
  },
  resultBox: {
    marginTop: 40,
    padding: 20,
    borderWidth: 2,
    borderRadius: 12,
    alignItems: 'center',
  },
  levelText: {
    fontSize: 22,
    fontWeight: '600',
    marginTop: 10,
  },
  bold: {
    fontWeight: 'bold',
  },
});
