import LiftToTalk from '@/assets/LiftToTalk';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress'; // Install if not already

export default function Step3() {
  const router = useRouter();
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    const delay = setTimeout(() => {
      setCountdown(3);
    }, 2000); // Wait 2 seconds before starting

    return () => clearTimeout(delay);
  }, []);

  useEffect(() => {
    if (countdown === null || countdown === 0) return;
    const interval = setInterval(() => {
      setCountdown((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearInterval(interval);
  }, [countdown]);

  useEffect(() => {
    if (countdown === 0) {
      router.push('/voicemode/sessionTracking')
    }
  }, [countdown]);

  return (
    <TouchableOpacity
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#EFE9E1',
      }}
      onPress={() => console.log('Skip countdown')}
    >
      {countdown !== null ? (
        <>
          <AnimatedCircularProgress
            size={120}
            width={10}
            fill={(3 - countdown) * (100 / 3)}
            tintColor="#1C1C1C"
            backgroundColor="#EFE9E1"
            rotation={0}
            lineCap="round"
          >
            {() => <Text style={{ fontSize: 36, color: '#1C1C1C' }}>{countdown}</Text>}
          </AnimatedCircularProgress>
          <Text style={{ fontSize: 20, marginTop: 20 }}>Starting in</Text>
        </>
      ) : (
        <>
          {/* Your SVG or LiftToTalk animation */}
          <LiftToTalk width={100} height={100}/>
          <Text style={{ fontSize: 20, textAlign: 'center' }}>
            Sounds good, pick up your phone.
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}
