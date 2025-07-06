import { useTremorTracking } from '@/hooks/useTremorTracking';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import { useEffect, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';


export default function SteadyTracking() {
  const router = useRouter();
  const [progress] = useState(new Animated.Value(0));
  const { start, isMeasuring } = useTremorTracking();

  useEffect(() => {
    const run = async () => {
      const tremorPromise = start();
      const animationPromise = new Promise<void>((resolve) => {
        Animated.timing(progress, {
          toValue: 1,
          duration: 5000,
          useNativeDriver: false,
        }).start(() => resolve());
      });

      const [tremorData] = await Promise.all([tremorPromise, animationPromise]);

      router.push({
        pathname: '/voicemode/sessionDone',
        params: {
          intensity: tremorData.intensity?.toFixed(2),
          freq: tremorData.dominantFreq?.toFixed(2),
          graph: JSON.stringify(tremorData.graphData),
          fft: JSON.stringify(tremorData.fftData),
        },
      });
    };

    run();
  }, []);

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <LottieView
        source={require('@/assets/images/bouncy_boi.json')}
        loop
        autoPlay
        style={styles.icon}
      />
      <View style={styles.progressBackground}>
        <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
      </View>
      <Text style={styles.label}>
        {isMeasuring ? 'Tracking Tremor...' : 'Finishing Up...'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFE9E1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  animationWrapper: {
    alignItems: 'center',
    marginBottom: 20, // spacing below the progress bar before text
  },
  icon: {
    width: 150,
    height: 150,
  },
  progressBackground: {
    width: 200,
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: -26, // no gap between animation and progress
    marginBottom: 8
  },
  progressFill: {
    height: 8,
    backgroundColor: '#1C1C1C',
  },
  label: {
    fontSize: 18,
    color: '#1C1C1C',
  },
});