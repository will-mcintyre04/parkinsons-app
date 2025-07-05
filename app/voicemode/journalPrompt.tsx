import { VoiceTrigger } from '@/components/VoiceTrigger';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function JournalPrompt() {
  const router = useRouter();

  const handleTranscript = (text: string) => {
    const lower = text.toLowerCase();

    if (lower.includes('yes')) {
      router.push('/voicemode/journalWrite');
    } else if (lower.includes('no')) {
      router.push('/');
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
