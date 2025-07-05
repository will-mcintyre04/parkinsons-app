import { DeviceMotion } from 'expo-sensors';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Button,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import {
    VictoryAxis,
    VictoryChart,
    VictoryContainer,
    VictoryLine,
    VictoryTheme,
} from 'victory-native';
import { ThemedText } from './ThemedText';

const SAMPLE_RATE = 200;
const SAMPLE_INTERVAL = 1000 / SAMPLE_RATE;
const WINDOW_SIZE = 512;
const screenWidth = Dimensions.get('window').width;
const chartWidth = screenWidth - 32;
const NOISE_THRESHOLD = 0.1;

export default function TremorMonitor() {
  const [buffer, setBuffer] = useState<number[]>([]);
  const [graphData, setGraphData] = useState<{ x: number; y: number }[]>([]);
  const [fftData, setFftData] = useState<{ x: number; y: number }[]>([]);
  const [dominantFreq, setDominantFreq] = useState<number | null>(null);
  const [std, setStd] = useState<number | null>(null);
  const [isMeasuring, setIsMeasuring] = useState(false);
  const subscriptionRef = useRef<any>(null);
  const counterRef = useRef(0);

  const startMeasurement = () => {
    setBuffer([]);
    setGraphData([]);
    setFftData([]);
    setStd(null);
    setDominantFreq(null);
    setIsMeasuring(true);
    counterRef.current = 0;

    DeviceMotion.setUpdateInterval(SAMPLE_INTERVAL);
    subscriptionRef.current = DeviceMotion.addListener(({ acceleration }) => {
      if (!acceleration) return;
      const { x = 0, y = 0, z = 0 } = acceleration;
      const mag = Math.sqrt(x ** 2 + y ** 2 + z ** 2);

      setBuffer((prev) => {
        const updated = [...prev, mag];
        setGraphData((prevGraph) => [
          ...prevGraph,
          { x: counterRef.current++, y: mag },
        ]);
        if (updated.length >= WINDOW_SIZE) {
          subscriptionRef.current?.remove();
          const windowed = updated.slice(-WINDOW_SIZE);
          computeSTD(windowed);
          const { fft, correctedDominantFreq } = computeFFT(windowed, SAMPLE_RATE);
          setFftData(fft);
          setDominantFreq(correctedDominantFreq);
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

  const computeFFT = (samples: number[], sampleRate: number) => {
    const N = samples.length;
    const mean = samples.reduce((a, b) => a + b, 0) / N;
    const zeroMeanSamples = samples.map((val) => val - mean);
    const fft: { x: number; y: number }[] = [];

    for (let k = 0; k < N / 2; k++) {
      let real = 0;
      let imag = 0;
      for (let n = 0; n < N; n++) {
        const angle = (2 * Math.PI * k * n) / N;
        real += zeroMeanSamples[n] * Math.cos(angle);
        imag -= zeroMeanSamples[n] * Math.sin(angle);
      }
      const magnitude = Math.sqrt(real ** 2 + imag ** 2) / N;
      const frequency = (k * sampleRate) / N;
      fft.push({ x: frequency, y: magnitude });
    }

    const dominant = fft
      .filter((p) => p.x > 1 && p.x < 30) // up to 30 Hz (15 Hz corrected)
      .reduce((max, p) => (p.y > max.y ? p : max), { x: 0, y: 0 });

      // Each cycle produces two peaks, divide the freq by 2
    const correctedDominantFreq =
      dominant.y >= NOISE_THRESHOLD ? dominant.x / 2 : null;

    return { fft, correctedDominantFreq };
  };

  const smoothData = (data: { x: number; y: number }[], windowSize: number) => {
    if (data.length < windowSize) return data;
    const smoothed: { x: number; y: number }[] = [];
    for (let i = 0; i < data.length - windowSize + 1; i++) {
      const window = data.slice(i, i + windowSize);
      const avgY = window.reduce((sum, d) => sum + d.y, 0) / window.length;
      smoothed.push({ x: window[Math.floor(windowSize / 2)].x, y: avgY });
    }
    return smoothed;
  };

  const getLevel = () => {
    if (std === null) return { label: '—', color: '#ccc', emoji: '❔' };
    if (std < 0.3) return { label: 'None', color: '#4caf50', emoji: '✅' };
    if (std < 0.7) return { label: 'Mild', color: '#ffc107', emoji: '🟡' };
    if (std < 1.5) return { label: 'Moderate', color: '#ff9800', emoji: '🟠' };
    return { label: 'Severe', color: '#f44336', emoji: '🔴' };
  };

  const { label, color, emoji } = getLevel();

  useEffect(() => {
    return () => subscriptionRef.current?.remove();
  }, []);

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

      {graphData.length > 0 && (
        <>
          <Text style={styles.chartTitle}>Acceleration Magnitude Over Time</Text>
          <ScrollView horizontal>
            <VictoryChart
              height={400}
              width={chartWidth}
              domain={{ y: [0, 9] }}
              padding={{ top: 20, bottom: 60, left: 60, right: 20 }}
              theme={VictoryTheme.clean}
              containerComponent={<VictoryContainer responsive={false} />}
            >
              <VictoryAxis
                label="Time (s)"
                tickFormat={(t) => (t / SAMPLE_RATE).toFixed(1)}
                style={{
                  axisLabel: { padding: 30, fontSize: 14 },
                  tickLabels: { fontSize: 12 },
                  grid: { stroke: '#e0e0e0' },
                }}
              />
              <VictoryAxis
                dependentAxis
                label="Acceleration (m/s²)"
                style={{
                  axisLabel: { padding: 40, fontSize: 14 },
                  tickLabels: { fontSize: 12 },
                  grid: { stroke: '#e0e0e0' },
                }}
              />
              <VictoryLine
                data={smoothData(graphData, 5)}
                style={{ data: { stroke: '#7b61ff', strokeWidth: 2 } }}
                interpolation="linear"
              />
            </VictoryChart>
          </ScrollView>

          <Text style={styles.chartTitle}>Frequency Spectrum (FFT)</Text>
          <ScrollView horizontal>
            <VictoryChart
              height={300}
              width={chartWidth}
              domain={{ x: [0, 20] }}
              padding={{ top: 20, bottom: 60, left: 60, right: 20 }}
              theme={VictoryTheme.clean}
              containerComponent={<VictoryContainer responsive={false} />}
            >
              <VictoryAxis
                label="Frequency (Hz)"
                style={{
                  axisLabel: { padding: 35, fontSize: 14 },
                  tickLabels: { fontSize: 12 },
                  grid: { stroke: '#e0e0e0' },
                }}
              />
              <VictoryAxis
                dependentAxis
                label="Magnitude"
                style={{
                  axisLabel: { padding: 45, fontSize: 14 },
                  tickLabels: { fontSize: 12 },
                  grid: { stroke: '#e0e0e0' },
                }}
              />
              <VictoryLine
                data={fftData}
                style={{ data: { stroke: '#ff3d00', strokeWidth: 2 } }}
                interpolation="linear"
              />
              {dominantFreq && (
                <VictoryLine
                  data={[
                    { x: dominantFreq, y: 0 },
                    { x: dominantFreq, y: Math.max(...fftData.map((p) => p.y)) },
                  ]}
                  style={{
                    data: {
                      stroke: '#00bcd4',
                      strokeWidth: 4,
                      strokeDasharray: '4,4',
                    },
                  }}
                />
              )}
            </VictoryChart>
          </ScrollView>

          <Text style={styles.chartTitle}>
            {dominantFreq === null
              ? 'No Tremor Detected'
              : `Dominant Frequency: ${dominantFreq.toFixed(2)} Hz`}
          </Text>
        </>
      )}

      {!isMeasuring && std !== null && (
        <View style={[styles.resultBox, { borderColor: color }]}>
          <ThemedText type="subtitle">
            Tremor Intensity: <Text style={styles.bold}>{std.toFixed(3)}</Text>
          </ThemedText>
          <Text style={[styles.levelText, { color }]}>
            {emoji} {label}
          </Text>
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
    backgroundColor: '#fff',
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 10,
    color: '#000',
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
