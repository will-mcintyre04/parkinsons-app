import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

let recording;

export const startRecording = async () => {
    const permission = await Audio.requestPermissionsAsync();
    if (permission.status !== 'granted') throw new Error('Permission not granted');
  
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });
  
    recording = new Audio.Recording();
    await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
    await recording.startAsync();
    console.log('Recording started.');
  };
  

  export const stopRecording = async () => {
    if (!recording) return null;
  
    console.log('Stopping and unloading recording...');
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
  
    // Check file info
    const info = await FileSystem.getInfoAsync(uri, { size: true });
    console.log('Recording URI:', uri);
    console.log('File size (bytes):', info.size);
  
    if (!info.exists || info.size < 1000) {
      console.error('Recording failed or file is empty');
      throw new Error('Empty or corrupted recording file');
    }
  
    return uri;
  };
  

const API_KEY = "6a7d7af4e5cd484fb8f6ac368b19a2f6";

export const transcribeWithAssembly = async (uri) => {
    console.log("Starting AssemblyAI transcription for:", uri);
  
    // Step 1: Log file size to verify it's valid
    const info = await FileSystem.getInfoAsync(uri);
    console.log('File size (bytes):', info.size);
  
    if (!info.exists || info.size < 1000) {
      throw new Error('Audio file is too small or missing.');
    }
  
    // Step 2: Upload the audio file
    const uploadRes = await FileSystem.uploadAsync(
      "https://api.assemblyai.com/v2/upload",
      uri,
      {
        httpMethod: "POST",
        headers: {
          authorization: API_KEY,
        },
        uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
      }
    );
  
    if (!uploadRes.body || uploadRes.status !== 200) {
      console.error('Upload failed:', uploadRes.body);
      throw new Error('Upload failed.');
    }
  
    const { upload_url } = JSON.parse(uploadRes.body);
    console.log("File uploaded to:", upload_url);
  
    // Step 3: Request transcription
    const transcriptRes = await fetch("https://api.assemblyai.com/v2/transcript", {
      method: "POST",
      headers: {
        authorization: API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify({ audio_url: upload_url }),
    });
  
    const { id } = await transcriptRes.json();
    console.log("Transcript requested. ID:", id);
  
    // Step 4: Poll until status is 'completed' or 'error'
    let attempts = 0;
    const maxAttempts = 30;
  
    while (attempts < maxAttempts) {
      const pollingRes = await fetch(`https://api.assemblyai.com/v2/transcript/${id}`, {
        headers: { authorization: API_KEY },
      });
  
      const transcript = await pollingRes.json();
      console.log("Polling status:", transcript.status);
  
      if (transcript.status === "completed") {
        console.log("Transcription complete:", transcript.text);
        return transcript.text;
      }
  
      if (transcript.status === "error") {
        console.error("Transcription failed:", transcript);
        throw new Error("Transcription failed: " + (transcript.error || "Unknown error"));
      }
  
      await new Promise((res) => setTimeout(res, 1500));
      attempts++;
    }
  
    throw new Error("Transcription timed out after waiting.");
  };