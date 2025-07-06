import { insertMockTremorLogs } from '@/database/InsertMockTremors';
import React, { useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../(tabs)/PatientHomeStyles';
import TremorAmplitudeGraph from './TremorAmplitudeGraph';
import TremorFrequencyGraph from './TremorFrequencyGraph';


const screenWidth = Dimensions.get('window').width;

export default function AnalyticsMain() {
    const getTimeSinceLabel = (label: string): string => {
        const now = new Date();
        switch (label) {
          case '1W':
            return new Date(now.setDate(now.getDate() - 7)).toISOString();
          case '1M':
            return new Date(now.setMonth(now.getMonth() - 1)).toISOString();
          case '6M':
            return new Date(now.setMonth(now.getMonth() - 6)).toISOString();
          case '1Y':
            return new Date(now.setFullYear(now.getFullYear() - 1)).toISOString();
          case 'All':
          default:
            return '1970-01-01T00:00:00Z';
        }
      };

    const [since, setSince] = useState<string>(() => getTimeSinceLabel('1W'));
    const [selectedRange, setSelectedRange] = useState<string>('1W');
  
    
  
    const handleRangeSelect = (label: string) => {
      setSelectedRange(label);
      setSince(getTimeSinceLabel(label));
    };
  
    return (
      <View style={styless.Container}>
        <Text style={styles.greetingTitleCaregiver}>Analytics</Text>
  
        {/* Bubble Row */}
        <View style={styless.bubbleRow}>
          {['1W', '1M', '6M', '1Y', 'All'].map((label, i) => (
            <TouchableOpacity
              key={i}
              style={[
                styless.bubbleButton,
                selectedRange === label && styless.selectedBubbleButton,
              ]}
              onPress={() => handleRangeSelect(label)}
            >
              <Text
                style={[
                  styless.bubbleText,
                  selectedRange === label && styless.selectedBubbleText,
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
  
        {/* Swipeable Graphs */}
        {since && (
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={{ width: screenWidth, marginTop: 12 }}
          >
            <View style={{ width: screenWidth, alignItems: 'center' }}>
              <TremorFrequencyGraph since={since} />
            </View>
            <View style={{ width: screenWidth, alignItems: 'center' }}>
              <TremorAmplitudeGraph since={since} />
            </View>
          </ScrollView>
        )}
  
        {/* Insert Button */}
        <TouchableOpacity onPress={insertMockTremorLogs} style={{ marginTop: 16 }}>
          <Text>Insert Mock Data</Text>
        </TouchableOpacity>
      </View>
    );
}

const styless = StyleSheet.create({
    bubbleRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'stretch',
        width: '100%',
        marginTop: 32,
        gap: 8,
      },
      bubbleButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 24,
        backgroundColor: '#DED7CD',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 60,
      },
      bubbleText: {
        color: '#4D4D4D',
        fontSize: 16,
        fontWeight: '500',
        alignItems: 'center',
        fontFamily: 'SFProDisplay-Light'
      },
      selectedBubbleButton: {
        backgroundColor: '#262626',
      },
      selectedBubbleText: {
        color: '#DED7CD',
      },
      Container:{
        backgroundColor: '#DED7CD',
        marginTop: -15,
        alignSelf: 'stretch',
      }
  });