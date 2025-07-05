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

        <View style={styles.bottomStack}>
                <View style={styles.arcTop} />
                <TouchableOpacity style={styles.nextContainer} onPress={handleNext}>
                  <Text style={styles.nextText}>Next &gt;</Text>
                </TouchableOpacity>
            </View>
        </>
  );
}


const CIRCLE_SIZE = {
    bottom: 500,
    middle: 460,
    top: 420,
  };

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#EFE9E1',
    alignItems: 'center',
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
    bottom: -130,
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
