import { getDb } from '@/database/db-service';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
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
    const router = useRouter();
    
    
  
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

        {/* Insert Button */}
        {/* <TouchableOpacity onPress={insertMockTremorLogs} style={{ marginTop: 16 }}>
          <Text>Insert Mock Data</Text>
        </TouchableOpacity> */}
  
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
                <TremorFrequencyGraph since={since} medicineId={selectedMedicine} />
            </View>


            {/* Amplitude Graph */}
            <View style={{ width: screenWidth, alignItems: 'center' }}>
                <TremorAmplitudeGraph since={since} medicineId={selectedMedicine} />
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
            onPress={() => setShowPicker(true)}
            style={styles.dropdownButton}
        >
            <Text style={styles.dropdownText}>{selectedMedicineLabel}</Text>
            <Text style={styles.dropdownArrow}>▼</Text>
        </TouchableOpacity>

        {/* Popup Modal */}
        <Modal
        visible={showPicker}
        animationType="slide"
        transparent
        onRequestClose={() => setShowPicker(false)}
        >
        <TouchableWithoutFeedback onPress={() => setShowPicker(false)}>
            <View style={styles.modalBackdrop}>
            <TouchableWithoutFeedback>
                <View style={styles.bottomSheet}>
                {/* Header */}
                <View style={styles.sheetHeader}>
                    <Text style={styles.sheetTitle}>Dosage History</Text>
                    <TouchableOpacity onPress={() => setShowPicker(false)}>
                    <Text style={styles.closeButton}>✕</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.sheetSubtitle}>Filter data based on dosage</Text>

                {/* General Dosage Option */}
                <TouchableOpacity
                    style={styles.medicineItem}
                    onPress={() => {
                    setSelectedMedicine(null);
                    setSelectedMedicineLabel('General Dosage');
                    setShowPicker(false);
                    }}
                >
                    <Text style={styles.medicineText}>General Dosage</Text>
                    <Text style={styles.medicineSubText}>Show tremor data from all sessions</Text>
                    {selectedMedicine === null && <View style={styles.radioCircle} />}
                </TouchableOpacity>

                {/* Medicine Options */}
                <ScrollView style={{ marginTop: 12 }}>
                    {medicines.map((med) => (
                    <TouchableOpacity
                        key={med.id}
                        style={styles.medicineItem}
                        onPress={() => {
                        setSelectedMedicine(med.id);
                        setSelectedMedicineLabel(`${med.dosage} of  ${med.medication}`);
                        setShowPicker(false);
                        }}
                    >
                        <Text style={styles.medicineText}>{`${med.dosage} of  ${med.medication}`}</Text>
                        {selectedMedicine === med.id && <View style={styles.radioCircle} />}
                    </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Exit */}
                <TouchableOpacity onPress={() => setShowPicker(false)} style={{ marginTop: 20 }}>
                    <Text style={styles.exitText}>Exit</Text>
                </TouchableOpacity>
                </View>
            </TouchableWithoutFeedback>
            </View>
        </TouchableWithoutFeedback>
        </Modal>

        </View>

        <TouchableOpacity
          style={styles.sessionCard}
          onPress={() => router.push('/Analytics/SessionHistory')}
        >
          <View>
            <Text style={styles.sessionTitle}>Session History</Text>
            <Text style={styles.sessionSubtitle}>Take a look at past sessions</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
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
        marginLeft: 20,
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
        marginTop: 70,
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
      modalBackdrop: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
      },
      bottomSheet: {
        width: '80%',
        backgroundColor: '#3A3938',
        justifyContent: 'center',
        maxHeight: 400,
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
      },
      sheetHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      sheetTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
      },
      sheetSubtitle: {
        color: '#D0CDC9',
        marginTop: 4,
        marginBottom: 16,
      },
      closeButton: {
        fontSize: 20,
        color: '#fff',
      },
      medicineItem: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#555',
      },
      medicineText: {
        color: '#fff',
        fontSize: 16,
      },
      medicineSubText: {
        fontSize: 12,
        color: '#AAA',
      },
      radioCircle: {
        width: 16,
        height: 16,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#fff',
        position: 'absolute',
        right: 12,
        top: '50%',
        transform: [{ translateY: -8 }],
      },
      exitText: {
        color: '#fff',
        fontWeight: '600',
        textAlign: 'center',
        fontSize: 16,
      },
      selectedMedicineItem: {
        backgroundColor: '#DED7CD',
        borderRadius: 8,
      },
      dropdownButton: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
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