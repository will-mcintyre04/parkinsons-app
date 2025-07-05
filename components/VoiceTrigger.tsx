import { startRecording, stopRecording, transcribeWithAssembly } from '@/database/speech-service';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface VoiceTriggerProps {
  onTranscript: (text: string) => void;
  prompt?: string;
}

export const VoiceTrigger = ({ onTranscript, prompt = 'talk anytime.' }: VoiceTriggerProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');

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
        onTranscript(text); // 🔥 this is the only thing the parent cares about
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

      <View style={styles.bottomStack}>
        <View style={styles.arcBottom} />
        <View style={styles.arcMiddle} />
        <View style={styles.arcTop} />

        <TouchableOpacity style={styles.micContainer} onPress={handleMicPress}>
          <MaterialIcons
            name={isRecording ? 'stop-circle' : 'mic'}
            size={48}
            color={isRecording ? '#FF6A6A' : '#DED7CD'}
          />
        </TouchableOpacity>

        <View style={styles.bottomBox} />
      </View>
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
    textAlign: "center"
  },
  transcriptText: {
    marginTop: 16,
    paddingHorizontal: 24,
    fontSize: 16,
    color: '#333',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  bottomStack: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  arcBottom: {
    position: 'absolute',
    bottom: -350,
    width: CIRCLE_SIZE.bottom,
    height: CIRCLE_SIZE.bottom,
    borderRadius: CIRCLE_SIZE.bottom / 2,
    backgroundColor: '#3D3D3D',
  },
  arcMiddle: {
    position: 'absolute',
    bottom: -300,
    width: CIRCLE_SIZE.middle,
    height: CIRCLE_SIZE.middle,
    borderRadius: CIRCLE_SIZE.middle / 2,
    backgroundColor: '#2C2C2C',
  },
  arcTop: {
    position: 'absolute',
    bottom: -250,
    width: CIRCLE_SIZE.top,
    height: CIRCLE_SIZE.top,
    borderRadius: CIRCLE_SIZE.top / 2,
    backgroundColor: '#000000',
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
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
