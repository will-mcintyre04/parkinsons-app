import { VoiceTrigger } from '@/components/VoiceTrigger';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function Step1() {
  const router = useRouter();

  const handleKeyword = (keyword: string) => {
    if (keyword === 'medication') {
      router.push('/voicemode/step2');
    } else if (keyword === 'session') {
      router.push('/voicemode/step3');
    }
  };

  return (
    <>
      <StatusBar hidden />
      <VoiceTrigger onMatch={handleKeyword} />
    </>
  );
}
