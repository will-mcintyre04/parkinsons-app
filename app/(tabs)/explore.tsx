import { ActivityIndicator, Button, StyleSheet } from 'react-native';

import LogViewer from '@/components/LogViewer';
import SubmitForm from '@/components/SubmitForm';

import { Collapsible } from '@/components/Collapsible';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

import { startRecording, stopRecording, transcribeWithAssembly } from '@/database/speech-service';
import React, { useState } from 'react';



export default function TabTwoScreen() {

  // Temporary Speech Variables
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRecordPress = async () => {
    try {
      if (isRecording) {
        setIsRecording(false);
        const uri = await stopRecording();
        setLoading(true);
        const text = await transcribeWithAssembly(uri);
        setTranscription(text);
      } else {
        setTranscription("");
        await startRecording();
        setIsRecording(true);
      }
    } catch (e) {
      console.error(e);
      setTranscription("Error: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Explore</ThemedText>
      </ThemedView>

      
      <Collapsible title="Speech to Text (AssemblyAI)">
        <Button
          title={isRecording ? 'Stop Recording' : 'Start Recording'}
          onPress={handleRecordPress}
        />
        {loading && <ActivityIndicator />}
        {transcription ? <ThemedText>📝 {transcription}</ThemedText> : null}
      </Collapsible>

      <Collapsible title="Add a medication log to the database">
        <SubmitForm></SubmitForm>
      </Collapsible>

      <Collapsible title="View Logs">
        <LogViewer></LogViewer>
      </Collapsible>

    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
