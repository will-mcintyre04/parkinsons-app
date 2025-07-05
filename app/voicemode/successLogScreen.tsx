import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';


export default function SuccessLogScreen() {
    const { medication, dosage } = useLocalSearchParams();

  return (
    <>
      <View style={styles.container}>
      <MaterialIcons name="check-circle" size={80} color="#1C1C1C" style={{ marginTop: 126 }}/>
        <Text style={styles.title}>Successfully Logged</Text>
        <Text style={styles.subtitle}>
        {`You logged ${dosage} of ${medication}`}
        </Text>
      </View>
  
        <View style={styles.bottomStack}>
            <View style={styles.arcTop} />
            <View style={styles.nextContainer}>
            <Text style={styles.nextText}>Next &gt;</Text>
            </View>
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
    flex: 1,
    backgroundColor: '#EFE9E1',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#000',
    fontFamily: 'SFProDisplay-Light',
    marginBottom: 16,
    marginTop: 64,
  },
  subtitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#000',
    fontFamily: 'SFProDisplay-Bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  nextContainer: {
    position: 'absolute',
    bottom: 130,
    zIndex: 10,
  },
  icon: {
    zIndex: 1,
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
