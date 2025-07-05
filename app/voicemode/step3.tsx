import { useRouter } from 'expo-router';
import { Text, TouchableOpacity } from 'react-native';

export default function Step3() {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#EFE9E1' }}
      onPress={() => console.log("DONE")} // or wherever you want to go
    >
      <Text style={{ fontSize: 20, textAlign: 'center' }}>
        Sounds good, pick up your phone
      </Text>
      {/* phone icon here */}
    </TouchableOpacity>
  );
}
