import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Text, View } from 'react-native';

export default function NavigateByKeywordScreen() {
  const router = useRouter();

  // Example input string — replace this dynamically as needed
  const input = "take me to explore section"; // could be user input or voice text

  useEffect(() => {
    const lower = input.toLowerCase();

    if (lower.includes('explore')) {
      console.log('Navigating to explore...');
      router.replace('/explore'); // navigates to the Explore tab
    } else if (lower.includes('index') || lower.includes('home')) {
      console.log('Navigating to index...');
      router.replace('/'); // navigates to the Index (Home) tab
    } else {
      console.log('Keyword not found.');
    }
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Parsing input: "{input}"</Text>
    </View>
  );
}
