import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { Dimensions, ScrollView, StyleSheet, Text } from 'react-native';
import {
  VictoryAxis,
  VictoryChart,
  VictoryContainer,
  VictoryLine,
  VictoryTheme,
} from 'victory-native';

const SAMPLE_RATE = 200;
const screenWidth = Dimensions.get('window').width;
const chartWidth = screenWidth - 32;

export default function SteadyDone() {
  const { std, freq, graph, fft } = useLocalSearchParams<{
    std?: string;
    freq?: string;
    graph?: string;
    fft?: string;
  }>();

  const graphData = graph ? JSON.parse(graph) : [];
  const fftData = fft ? JSON.parse(fft) : [];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <MaterialIcons name="check-circle" size={80} color="#1C1C1C" />
      <Text style={styles.title}>Steady check done</Text>
      <Text style={styles.score}>Tremor STD: {std ?? '—'}</Text>
      <Text style={styles.score}>Dominant Freq: {freq ?? '—'} Hz</Text>

      {graphData.length > 0 && (
        <>
          <Text style={styles.chartTitle}>Acceleration Over Time</Text>
          <VictoryChart
            height={300}
            width={chartWidth}
            domain={{ y: [0, 9] }}
            theme={VictoryTheme.clean}
            containerComponent={<VictoryContainer responsive={false} />}
          >
            <VictoryAxis
              label="Time (s)"
              tickFormat={(t) => (t / SAMPLE_RATE).toFixed(1)}
            />
            <VictoryAxis dependentAxis label="Acceleration (m/s²)" />
            <VictoryLine
              data={graphData}
              style={{ data: { stroke: '#7b61ff', strokeWidth: 2 } }}
            />
          </VictoryChart>

          <Text style={styles.chartTitle}>Frequency Spectrum</Text>
          <VictoryChart
            height={300}
            width={chartWidth}
            domain={{ x: [0, 20] }}
            theme={VictoryTheme.clean}
            containerComponent={<VictoryContainer responsive={false} />}
          >
            <VictoryAxis label="Frequency (Hz)" />
            <VictoryAxis dependentAxis label="Magnitude" />
            <VictoryLine
              data={fftData}
              style={{ data: { stroke: '#ff3d00', strokeWidth: 2 } }}
            />
          </VictoryChart>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    paddingBottom: 80,
    alignItems: 'center',
    backgroundColor: '#EFE9E1',
  },
  title: {
    fontSize: 24,
    marginTop: 20,
    color: '#1C1C1C',
  },
  score: {
    fontSize: 18,
    marginTop: 8,
    color: '#333',
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 30,
    color: '#1C1C1C',
  },
});
