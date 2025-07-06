import { Stack } from 'expo-router';

export default function VoiceModeLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Hides the top header
      }}
    />
  );
}
