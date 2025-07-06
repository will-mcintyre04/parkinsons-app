import { Dimensions, ScrollView, View } from 'react-native';
import TremorFrequencyGraph from './TremorFrequencyGraph';
import TremorIntensityGraph from './TremorIntensityGraph';

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

      {/* Page 2: Intensity */}
      <View style={{ width: screenWidth, alignItems: 'center' }}>
        <TremorIntensityGraph since={since} />
      </View>
    </ScrollView>
  );
}
