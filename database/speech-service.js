import { Audio } from 'expo-av';

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
  await recording.stopAndUnloadAsync();
  const uri = recording.getURI();
  console.log('Recording stopped. File saved at:', uri);
  return uri
};

const API_KEY = "6a7d7af4e5cd484fb8f6ac368b19a2f6";

export const transcribeWithAssembly = async (uri) => {
  console.log("Starting AssemblyAI transcription for", uri);

  // 1. Upload the audio file
  const audioBlob = await fetch(uri).then(r => r.blob());
  const uploadRes = await fetch("https://api.assemblyai.com/v2/upload", {
    method: "POST",
    headers: { "authorization": API_KEY },
    body: audioBlob,
  });
  const { upload_url } = await uploadRes.json();
  console.log("Uploaded to:", upload_url);

  // 2. Request transcription
  const transcriptRes = await fetch("https://api.assemblyai.com/v2/transcript", {
    method: "POST",
    headers: {
      "authorization": API_KEY,
      "content-type": "application/json",
    },
    body: JSON.stringify({ audio_url: upload_url, auto_chapters: false }),
  });
  const { id } = await transcriptRes.json();
  console.log("Transcript requested, ID:", id);

  // 3. Poll until complete
  let transcript;
  while (true) {
    transcript = await fetch(`https://api.assemblyai.com/v2/transcript/${id}`, {
      headers: { "authorization": API_KEY },
    }).then(r => r.json());
    console.log("Status:", transcript.status);
    if (transcript.status !== "processing") break;
    await new Promise(res => setTimeout(res, 1000));
  }

  if (transcript.status === "completed") {
    console.log("Transcription complete:", transcript.text);
    return transcript.text;
  }

  throw new Error("Transcription failed: " + transcript.error);
};
