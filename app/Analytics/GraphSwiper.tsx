import { Dimensions, ScrollView, View } from 'react-native';
import TremorAmplitudeGraph from './TremorAmplitudeGraph';
import TremorFrequencyGraph from './TremorFrequencyGraph';

const screenWidth = Dimensions.get('window').width;

export default function GraphSwiper({ since }: { since: string }) {
  return (
    <ScrollView
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      style={{ width: screenWidth }}
    >
      {/* Page 1: Frequency */}
      <View style={{ width: screenWidth, alignItems: 'center' }}>
        <TremorFrequencyGraph since={since} />
      </View>

      {/* Page 2: Amplitude */}
      <View style={{ width: screenWidth, alignItems: 'center' }}>
        <TremorAmplitudeGraph since={since} />
      </View>
    </ScrollView>
  );
}
