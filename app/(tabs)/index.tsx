import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Button, StyleSheet } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import TremorMonitor from '@/components/TremorMonitor';
import { initDatabase } from '@/database/db-service';
import { useEffect } from 'react';

export default function HomeScreen() {

  const router = useRouter();
  useEffect(() => {
    initDatabase();
  }, []);
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>

      {/* Tremor Monitor */}
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Tremor Monitor</ThemedText>
        <TremorMonitor />
      </ThemedView>

      <Button title="Start session" onPress={() => router.push('/voicemode/journalReading')}></Button>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
