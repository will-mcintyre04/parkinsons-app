import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Step1() {
  const router = useRouter();

  return (
    <TouchableOpacity style={styles.container} onPress={() => router.push('/voicemode/step2')}>
      <StatusBar hidden />

      {/* Top Message */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>talk anytime.</Text>
      </View>

      {/* Arcs + Mic */}
      <View style={styles.bottomStack}>
        {/* Circles stacked from bottom to top */}
        <View style={styles.arcBottom} />
        <View style={styles.arcMiddle} />
        <View style={styles.arcTop} />

        <View style={styles.micContainer}>
          <MaterialIcons name="mic" size={48} color="#DED7CD" />
        </View>
        <View style={styles.bottomBox}></View>
      </View>
    </TouchableOpacity>
  );
}

const CIRCLE_SIZE = {
  bottom: 500,
  middle: 460,
  top: 420,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFE9E1',
  },
    textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 24,
    
  },
  title: {
    color: '#5E5E5E',
    fontSize: 32,
    fontWeight: '300',
    fontFamily: 'System',
  },
  bottomStack: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  arcBottom: {
    position: 'absolute',
    bottom: -25,
    width: CIRCLE_SIZE.bottom,
    height: CIRCLE_SIZE.bottom,
    borderRadius: CIRCLE_SIZE.bottom / 2,
    backgroundColor: '#3D3D3D',
  },
  arcMiddle: {
    position: 'absolute',
    bottom: -50,
    width: CIRCLE_SIZE.middle,
    height: CIRCLE_SIZE.middle,
    borderRadius: CIRCLE_SIZE.middle / 2,
    backgroundColor: '#2C2C2C',
  },
  arcTop: {
    position: 'absolute',
    bottom: -75,
    width: CIRCLE_SIZE.top,
    height: CIRCLE_SIZE.top,
    borderRadius: CIRCLE_SIZE.top / 2,
    backgroundColor: '#000000',
  },
  micContainer: {
    position: 'absolute',
    bottom: 200,
    zIndex: 10,
  },
  bottomBox: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,               // or width: '100%'
    height: 100,             // you can adjust this
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    },
});
