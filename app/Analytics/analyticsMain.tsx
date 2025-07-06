import { insertMockTremorLogs } from '@/database/InsertMockTremors';
import { getDb } from '@/database/db-service';
import React, { useEffect, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import TremorFrequencyGraph from './TremorFrequencyGraph';
import TremorAmplitudeGraph from './TremorIntensityGraph';

type Medicine = { id: number; medication: string; dosage: string };

const screenWidth = Dimensions.get('window').width;

export default function AnalyticsMain() {
    const [medicines, setMedicines] = useState<Medicine[]>([]);
    const [selectedMedicine, setSelectedMedicine] = useState<number | null>(null);
    const [selectedMedicineLabel, setSelectedMedicineLabel] = useState('General Dosage');
    const [showPicker, setShowPicker] = useState(false); 

      useEffect(() => {
        const db = getDb();
        const results = db.getAllSync(`SELECT * FROM MedicineLogs ORDER BY timestamp DESC`);
        setMedicines(results);
      }, []);

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
    const [graphIndex, setGraphIndex] = useState(0);
    
    
  
    const handleRangeSelect = (label: string) => {
      setSelectedRange(label);
      setSince(getTimeSinceLabel(label));
    };
  
    return (
      <View style={styles.Container}>
        <Text style={styles.greetingTitleCaregiver}>Analytics</Text>
  
        {/* Bubble Row */}
        <View style={styles.bubbleRow}>
          {['1W', '1M', '6M', '1Y', 'All'].map((label, i) => (
            <TouchableOpacity
              key={i}
              style={[
                styles.bubbleButton,
                selectedRange === label && styles.selectedBubbleButton,
              ]}
              onPress={() => handleRangeSelect(label)}
            >
              <Text
                style={[
                  styles.bubbleText,
                  selectedRange === label && styles.selectedBubbleText,
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
  
        {/* Swipeable Graphs */}
        {since && (
        <>
            <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(e) => {
                const index = Math.round(e.nativeEvent.contentOffset.x / screenWidth);
                setGraphIndex(index);
            }}
            scrollEventThrottle={16}
            style={{ width: screenWidth, marginTop: 12 }}
            >
            {/* Frequency Graph */}
            <View style={{ width: screenWidth, alignItems: 'center' }}>
                <TremorFrequencyGraph since={since} />
            </View>

            {/* Amplitude Graph */}
            <View style={{ width: screenWidth, alignItems: 'center' }}>
                <TremorAmplitudeGraph since={since} />
            </View>
            </ScrollView>

            {/* Pagination Dots */}
            <View style={styles.pagination}>
            {[0, 1].map((i) => (
                <View
                key={i}
                style={[
                    styles.dot,
                    graphIndex === i ? styles.activeDot : styles.inactiveDot,
                ]}
                />
            ))}
            </View>
        </>
        )}

        {/* Medicine Picker */}
        <View style={styles.medicinePickerContainer}>
            <TouchableOpacity
                onPress={() => setShowPicker((prev) => !prev)}
                style={styles.dropdownButton}
            >
                <Text style={styles.dropdownText}>{selectedMedicineLabel}</Text>
                <Text style={styles.dropdownArrow}>▼</Text>
            </TouchableOpacity>

            {showPicker && (
                <ScrollView style={styles.scrollContainer}>
                {medicines.map((med) => (
                    <TouchableOpacity
                    key={med.id}
                    style={[
                        styles.medicineItem,
                        selectedMedicine === med.id && styles.selectedMedicineItem,
                    ]}
                    onPress={() => {
                        setSelectedMedicine(med.id);
                        setSelectedMedicineLabel(`${med.medication} - ${med.dosage}`);
                        setShowPicker(false);
                    }}
                    >
                    <Text style={styles.medicineText}>{med.medication} - {med.dosage}</Text>
                    </TouchableOpacity>
                ))}
                </ScrollView>
            )}
        </View>

        <TouchableOpacity style={styles.sessionCard} onPress={() => console.log('Navigate to Session History')}>
        <View>
            <Text style={styles.sessionTitle}>Session History</Text>
            <Text style={styles.sessionSubtitle}>Take a look at past sessions</Text>
        </View>
        <Text style={styles.chevron}></Text> {/* Use an icon if preferred */}
        </TouchableOpacity>


  
        {/* Insert Button */}
        <TouchableOpacity onPress={insertMockTremorLogs} style={{ marginTop: 16 }}>
          <Text>Insert Mock Data</Text>
        </TouchableOpacity>
      </View>
    );
}

const styles = StyleSheet.create({
    greetingTitleCaregiver: {
        fontFamily: 'SFProDisplay-Black',
        fontSize: 32,
        fontWeight: '800',
        color: 'black',
    },
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
      },
      pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 12,
        gap: 8,
      },
      dot: {
        borderRadius: 999,
        backgroundColor: '#C3BDB6',
      },
      activeDot: {
        width: 40,
        height: 12,
        backgroundColor: '#1C1C1C',
      },
      inactiveDot: {
        width: 12,
        height: 12,
        backgroundColor: '#C3BDB6',
        opacity: 0.6,
      },
      medicinePickerContainer: {
        marginTop: 20,
        paddingHorizontal: 16,
      },
      pickerLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',
      },
      medicineItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#DDD',
      },
      selectedMedicineItem: {
        backgroundColor: '#DED7CD',
        borderRadius: 8,
      },
      medicineText: {
        fontSize: 16,
        color: '#333',
      },
      dropdownButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#D3CCC4',
        borderRadius: 32,
        marginBottom: 8,
      },
      
      dropdownText: {
        fontSize: 16,
        color: '#333',
        fontFamily: 'SFProDisplay-Regular',
      },
      
      dropdownArrow: {
        fontSize: 16,
        color: '#333',
      },
      
      scrollContainer: {
        maxHeight: 160,
        borderRadius: 12,
        backgroundColor: '#F6EEE3',
        padding: 8,
      },
      sessionCard: {
        backgroundColor: '#D6D0C8',
        borderRadius: 16,
        padding: 20,
        marginHorizontal: 16,
        marginTop: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      sessionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1C1C1C',
        fontFamily: 'SFProDisplay-Bold',
      },
      sessionSubtitle: {
        fontSize: 14,
        color: '#1C1C1C',
        fontFamily: 'SFProDisplay-Regular',
        opacity: 0.8,
        marginTop: 4,
      },
      chevron: {
        fontSize: 24,
        color: '#1C1C1C',
        fontWeight: '500',
      },
      
      
  });