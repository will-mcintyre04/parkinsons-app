import { VoiceTrigger } from '@/components/VoiceTrigger';
import { extractMedicationAndDosage } from '@/database/interactwithAI';
import * as Font from 'expo-font';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, StyleSheet, Text, View } from 'react-native';


export default function Step2() {

  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [fontError, setFontError] = useState<string | null>(null);

  useEffect(() => {
    const loadFonts = async () => {
      try {
        await Font.loadAsync({
          'SFProDisplay-Regular': require('@/assets/fonts/SF-Pro-Display-Regular.otf'),
          'SFProDisplay-Bold': require('@/assets/fonts/SF-Pro-Display-Bold.otf'),
          'SFProDisplay-Light': require('@/assets/fonts/SF-Pro-Display-Light.otf'),
          'SFProDisplay-Black': require('@/assets/fonts/SF-Pro-Display-Black.otf'),
        });
        setFontsLoaded(true);
      } catch (error) {
        console.error('Font loading failed:', error);
        setFontError('Font loading failed. Check file paths and names.');
      }
    };

    loadFonts();
  }, []);


  const router = useRouter();
  const { transcript } = useLocalSearchParams();
  const [result, setResult] = useState<{ medication: string | null; dosage: string | null } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (transcript) {
      extractMedicationAndDosage(String(transcript))
        .then(setResult)
        .finally(() => setLoading(false));
    }
  }, [transcript]);

  const handleAnswer = (text: string) => {
    const lower = text.toLowerCase();
  
    if (lower.includes('yes') && result?.medication && result?.dosage) {
      router.push({
        pathname: '/voicemode/successLogScreen',
        params: {
          medication: result.medication,
          dosage: result.dosage,
        },
      });
    } else if (lower.includes('no')) {
      router.push('/voicemode/step1');
    } else {
      console.warn('No recognized keyword found:', text);
    }
  };



  return (
    <>
      <StatusBar hidden />
      <VoiceTrigger onTranscript={handleAnswer} prompt=''/>
  
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#5E5E5E" />
        ) : (
          <>
            <Text style={styles.prompt}>Does this look right?</Text>
            <Text style={styles.text}>
              {result?.medication && result?.dosage
                ? `Log ${result.dosage} of ${result.medication}`
                : 'Not found'}
            </Text>
          </>
        )}
      </View>
    </>
  );
}
  

const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 96,
    width: '100%',
    alignItems: 'center',
    zIndex: 10,
  },
  prompt: {
    color: '#5E5E5E',
    textAlign: 'center',
    fontFamily: 'SFProDisplay-Light',
    fontSize: 32,
    fontStyle: 'normal',
    fontWeight: '300',
    lineHeight: 35.2,
    marginBottom: 56,
  },  
  text: {
    color: '#000',
    textAlign: 'center',
    fontFamily: 'SFProDisplay-Bold',
    fontSize: 32,
    fontStyle: 'normal',
    fontWeight: '800',
    lineHeight: 35.2,
    marginBottom: 20,
  },
});
