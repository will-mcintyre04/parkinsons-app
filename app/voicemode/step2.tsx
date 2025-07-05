import { useRouter } from 'expo-router';
import { Text, TouchableOpacity } from 'react-native';

export default function Step2() {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#EFE9E1' }}
      onPress={() => router.push('/voicemode/step3')}
    >
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Lets do a session</Text>
      {/* mic icon and new background here */}
    </TouchableOpacity>
  );
}
