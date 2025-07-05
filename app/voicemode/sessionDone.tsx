import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
  const [mode, setMode] = useState <'User' | 'Admin'>('User');
  const router = useRouter()

  const toggleMode = () => {
    setMode((prev) => (prev === 'User' ? 'Admin' : 'User'));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.modeSwitchRow}>
        <TouchableOpacity style={styles.modeToggle} onPress={toggleMode}>
          <MaterialIcons name="swap-horiz" size={20} color="black" />
          <Text style={styles.modeText}>{mode} Mode</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.contentWrapper}>
        <MaterialIcons name="check-circle" size={80} color="#1C1C1C" />
        <Text style={styles.title}>Steady check done</Text>
        <Text style={styles.score}>Tremor STD: {std ?? '—'}</Text>
        <Text style={styles.score}>Dominant Freq: {freq ?? '—'} Hz</Text>
      </View>

      {graphData.length > 0 && mode ==='User' && (
         <TouchableOpacity style={styles.bottomStack} onPress={() => {router.push('/voicemode/journalPrompt')}}>
            <View style={styles.arcTop} />
            <View style={styles.nextContainer}>
            <Text style={styles.nextText}>Next</Text>
            </View>
          </TouchableOpacity>
      )}

      {graphData.length > 0 && mode === 'Admin' && ( 
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

const CIRCLE_SIZE = {
    top: 420,
  };

const styles = StyleSheet.create({
  contentWrapper: {
    marginTop: 150, // adjust this value as needed
    alignItems: 'center',
  },
  // Mode Switch
  modeSwitchRow: {
    width: '100%',
    paddingHorizontal: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  modeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  modeText: {
    color: 'black',
    fontSize: 16,
    fontFamily: 'SFProDisplay-Light',
    fontWeight: '300',
    lineHeight: 18,
  },
  container: {
    paddingBottom: 0,
    alignItems: 'center',
    backgroundColor: '#EFE9E1',
    flexGrow:1
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
  bottomStack: {
    backgroundColor: '#EFE9E1',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  nextContainer: {
    position: 'absolute',
    bottom: 130,
    zIndex: 10,
  },
  arcTop: {
    position: 'absolute',
    bottom: -130,
    width: CIRCLE_SIZE.top,
    height: CIRCLE_SIZE.top,
    borderRadius: CIRCLE_SIZE.top / 2,
    backgroundColor: '#000000',
  },
    nextText: {
    fontFamily: 'SFProDisplay-Black',
    fontWeight: '800',
    fontSize: 32,
    lineHeight: 35.2,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#DED7CD',
  },
});
