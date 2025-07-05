import { VoiceTrigger } from '@/components/VoiceTrigger';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function Step1() {
  const router = useRouter();

  const handleTranscript = (text: string) => {
    const lower = text.toLowerCase();

    if (lower.includes('medication')) {
      router.push('/voicemode/step2');
    } else if (lower.includes('session')) {
      router.push('/voicemode/sessionStart');
    } else {
      console.warn('No recognized keyword found:', text);
    }
  };

  return (
    <>
      <StatusBar hidden />
      <VoiceTrigger onTranscript={handleTranscript} />
    </>
  );
}
