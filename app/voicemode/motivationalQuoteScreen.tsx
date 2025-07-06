import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';


export default function MotivationalQuoteScreen() {
  const router = useRouter();
  const { quote } = useLocalSearchParams();


  // Manual navigation
  const handleNext = () => {
    router.push('/voicemode/step1');
  };

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.quote}>{quote || 'Small wins add up, great job'}</Text>
      </View>

      <TouchableOpacity style={styles.bottomStack} onPress={handleNext} activeOpacity={0.6}>
        <View style={styles.arcTop} />
        <View style={styles.nextContainer}>
          <Text style={styles.nextText}>Next &gt;</Text>
        </View>
      </TouchableOpacity>
        </>
  );
}


const CIRCLE_SIZE = {
    top: 600,
  };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFE9E1',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  quote: {
    fontSize: 32,
    fontWeight: '800',
    width: '85%',
    color: '#000',
    fontFamily: 'SFProDisplay-Light',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    marginTop: 96,
  },
  nextContainer: {
    position: 'absolute',
    bottom: 130,
    zIndex: 10,
  },
  bottomStack: {
    backgroundColor: '#EFE9E1',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  arcTop: {
    position: 'absolute',
    bottom: -250,
    width: CIRCLE_SIZE.top,
    height: CIRCLE_SIZE.top,
    borderRadius: CIRCLE_SIZE.top / 2,
    backgroundColor: '#000000',
  },
  nextText: {
    fontFamily: 'SFProDisplay-Black',
    fontWeight: '800',
    fontSize: 32,
    lineHeight: 35.2,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#DED7CD',
  },
});
