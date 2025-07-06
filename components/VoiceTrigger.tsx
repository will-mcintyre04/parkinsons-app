import { startRecording, stopRecording, transcribeWithAssembly } from '@/database/speech-service';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface VoiceTriggerProps {
  onTranscript: (text: string) => void;
  prompt?: string;
}

export const VoiceTrigger = ({ onTranscript, prompt = 'talk anytime.' }: VoiceTriggerProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');

  const colorAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(colorAnim, {
      toValue: isRecording ? 1 : 0,
      duration: 300,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [isRecording]);

  const arcBottomColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#3D3D3D', '#8F8E8E'],
  });

  const arcMiddleColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#2C2C2C', '#A1A1A1'],
  });

  const arcTopColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#000000', '#EFE9E1'],
  });

  const boxColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#000000', '#EFE9E1'],
  });

  const handleMicPress = async () => {
    try {
      if (!isRecording) {
        setTranscript('');
        setIsRecording(true);
        await startRecording();
      } else {
        setIsRecording(false);
        const uri = await stopRecording();
        const text = await transcribeWithAssembly(uri);
        setTranscript(text);
        onTranscript(text);
      }
    } catch (err) {
      console.error(err);
      setIsRecording(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{prompt}</Text>
        {transcript && <Text style={styles.transcriptText}>“{transcript}”</Text>}
      </View>

      <TouchableOpacity style={styles.bottomStack} onPress={handleMicPress} activeOpacity={1}>
        <Animated.View style={[styles.arcBottom, { backgroundColor: arcBottomColor }]} />
        <Animated.View style={[styles.arcMiddle, { backgroundColor: arcMiddleColor }]} />
        <Animated.View style={[styles.arcTop, { backgroundColor: arcTopColor }]} />

        <View style={styles.micContainer}>
          <MaterialIcons
            name="mic"
            size={48}
            color={isRecording ? '#3B3B3B' : '#DED7CD'}
          />
        </View>

        <Animated.View style={[styles.bottomBox, { backgroundColor: boxColor }]} />
      </TouchableOpacity>
    </View>
  );
};

const CIRCLE_SIZE = {
  bottom: 800,
  middle: 700,
  top: 600,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFE9E1',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 24,
  },
  title: {
    color: '#5E5E5E',
    fontSize: 32,
    fontWeight: '300',
    fontFamily: 'System',
    width: 283,
    textAlign: 'center',
  },
  transcriptText: {
    marginTop: 16,
    paddingHorizontal: 24,
    fontSize: 16,
    color: '#333',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  arcBottom: {
    position: 'absolute',
    bottom: -350,
    width: CIRCLE_SIZE.bottom,
    height: CIRCLE_SIZE.bottom,
    borderRadius: CIRCLE_SIZE.bottom / 2,
  },
  arcMiddle: {
    position: 'absolute',
    bottom: -300,
    width: CIRCLE_SIZE.middle,
    height: CIRCLE_SIZE.middle,
    borderRadius: CIRCLE_SIZE.middle / 2,
  },
  arcTop: {
    position: 'absolute',
    bottom: -250,
    width: CIRCLE_SIZE.top,
    height: CIRCLE_SIZE.top,
    borderRadius: CIRCLE_SIZE.top / 2,
  },
  micContainer: {
    position: 'absolute',
    bottom: 124,
    zIndex: 10,
  },
  bottomBox: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomStack: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
});
