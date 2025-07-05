
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as Font from 'expo-font';
import React, { useEffect, useState } from 'react';
import {
  Platform,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { styles } from './PatientHomeStyles';

export default function PatientHomeScreen() {
  const [mode, setMode] = useState <'Patient' | 'Caregiver'>('Patient');
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [fontError, setFontError] = useState<string | null>(null);

  const toggleMode = () => {
    setMode((prev) => (prev === 'Patient' ? 'Caregiver' : 'Patient'));
  };

  useEffect(() => {
    const loadFonts = async () => {
      try {
        await Font.loadAsync({
          'SFProDisplay-Regular': require('@/assets/fonts/SF-Pro-Display-Regular.otf'),
          'SFProDisplay-Bold': require('@/assets/fonts/SF-Pro-Display-Bold.otf'),
          'SFProDisplay-Light': require('@/assets/fonts/SF-Pro-Display-Light.otf'),
          'SFProDisplay-Black': require('@/assets/fonts/SF-Pro-Display-Black.otf'),
        });
        setFontsLoaded(true);
      } catch (error) {
        console.error('Font loading failed:', error);
        setFontError('Font loading failed. Check file paths and names.');
      }
    };

    loadFonts();
  }, []);

  if (fontError) {
    return (
      <View style={styles.container}>
        <Text>{fontError}</Text>
      </View>
    );
  }

  if (!fontsLoaded) {
    return (
      <View style={styles.container}>
        <Text>Loading fonts...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 48 }]}>
      {/* Mode Switch Header */}
      <View style={styles.modeSwitchRow}>
        <TouchableOpacity style={styles.modeToggle} onPress={toggleMode}>
          <MaterialIcons name="swap-horiz" size={20} color="black" />
          <Text style={styles.modeText}>{mode} Mode</Text>
        </TouchableOpacity>
      </View>

      {/* Greeting Section */}
      <View style={styles.greetingContainer}>
        <Text style={styles.greetingTitle}>Hi Dee!</Text>
        <Text style={styles.greetingSubtitle}>how can I help today?</Text>
      </View>

      {/* Cards */}
      <View style={styles.cardContainer}>
        <View style={styles.card1}>
        <MaterialIcons name="mic" size={40} color="#DED7CD" />
          <View style={styles.textRow}>
            <Text style={styles.cardText}>Activate voice mode</Text>
          </View>
        </View>

        <View style={styles.card2}>
          <View style={styles.textRow}>
            <Text style={styles.cardText}>Start a session</Text>
          </View>
        </View>

        <View style={styles.card3}>
          <View style={styles.textRow}>
            <Text style={styles.cardText}>Track your meds</Text>
          </View>
        </View>
      </View>
    </View>
  );
}