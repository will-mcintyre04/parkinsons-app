import { startRecording, stopRecording, transcribeWithAssembly } from '@/database/speech-service';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Step1() {
  const router = useRouter();
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
      }
    } catch (err) {
      console.error(err);
      setIsRecording(false);
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={() => router.push('/voicemode/step2')}>
      <StatusBar hidden />

      <View style={styles.textContainer}>
        <Text style={styles.title}>talk anytime.</Text>
        {transcript !== '' && (
          <Text style={styles.transcriptText}>“{transcript}”</Text>
        )}
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
    </TouchableOpacity>
  );
}


const CIRCLE_SIZE = {
  bottom: 500,
  middle: 460,
  top: 420,
};

const styles = StyleSheet.create({
  transcriptText: {
    marginTop: 16,
    paddingHorizontal: 24,
    fontSize: 16,
    color: '#333',
    fontStyle: 'italic',
    textAlign: 'center',
  },
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
  },
  bottomStack: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  arcBottom: {
    position: 'absolute',
    bottom: -25,
    width: CIRCLE_SIZE.bottom,
    height: CIRCLE_SIZE.bottom,
    borderRadius: CIRCLE_SIZE.bottom / 2,
    backgroundColor: '#3D3D3D',
  },
  arcMiddle: {
    position: 'absolute',
    bottom: -50,
    width: CIRCLE_SIZE.middle,
    height: CIRCLE_SIZE.middle,
    borderRadius: CIRCLE_SIZE.middle / 2,
    backgroundColor: '#2C2C2C',
  },
  arcTop: {
    position: 'absolute',
    bottom: -75,
    width: CIRCLE_SIZE.top,
    height: CIRCLE_SIZE.top,
    borderRadius: CIRCLE_SIZE.top / 2,
    backgroundColor: '#000000',
  },
  micContainer: {
    position: 'absolute',
    bottom: 200,
    zIndex: 10,
  },
  bottomBox: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,               // or width: '100%'
    height: 100,             // you can adjust this
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    },
});
