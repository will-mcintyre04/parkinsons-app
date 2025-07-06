  import { VoiceTrigger } from '@/components/VoiceTrigger';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
  

  
  export default function JournalPrompt() {
    const router = useRouter();
    const { frequency, amplitude } = useLocalSearchParams<{ frequency?: string; amplitude?: string }>();

    const handleTranscript = (text: string) => {
      const lower = text.toLowerCase();

      if (lower.includes('yes')) {
        router.push({
          pathname: '/voicemode/journalWrite',
          params: {
            frequency,
            amplitude,
          },
        });
      } else if (lower.includes('no')) {
        router.push({
          pathname: '/voicemode/databaseDone',
          params: {
            frequency,
            amplitude,
          },
        });
      } else {
        console.warn('No recognized keyword found:', text);
      }
    };

    return (
      <>
        <StatusBar hidden />
        <VoiceTrigger onTranscript={handleTranscript} prompt="Do you want to journal how you feel?"/>
      </>
    );
  }
