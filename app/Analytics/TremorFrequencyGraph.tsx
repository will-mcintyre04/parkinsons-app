import { getTremorLogsByFilter } from '@/database/db-tremor';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { VictoryAxis, VictoryChart, VictoryLine } from 'victory-native';

const TremorFrequencyGraph = ({ since, medicineId }: { since: string, medicineId: number | null }) => {
    const [data, setData] = useState<{ x: Date; y: number }[]>([]);
  
    useEffect(() => {
      const logs = getTremorLogsByFilter(since, medicineId);
    
      const maxPoints = 40;
      const chunkSize = Math.ceil(logs.length / maxPoints);
    
      const averaged = [];
      for (let i = 0; i < logs.length; i += chunkSize) {
        const chunk = logs.slice(i, i + chunkSize);
        const avgY = chunk.reduce((sum, e) => sum + e.frequency, 0) / chunk.length;
    
        averaged.push({
          x: averaged.length + 1,
          y: parseFloat(avgY.toFixed(2)),
        });
      }
    
      setData(averaged);
    }, [since, medicineId]);    
  
    const avg = data.length ? data.reduce((sum, d) => sum + d.y, 0) / data.length : 0;
    const change = data.length > 1 ? ((data[data.length - 1].y - data[0].y) / data[0].y) * 100 : 0;
  
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Tremor Frequency</Text>
        <Text style={styles.subtitle}>
          Avg score: <Text style={styles.bold}>{avg.toFixed(0)}</Text> •{' '}
          <Text style={[styles.change, change < 0 ? styles.negative : styles.positive]}>
            {change < 0 ? 'Down' : 'Up'} {Math.abs(change.toFixed(0))}% {change < 0 ? '↓' : '↑'}
          </Text>
        </Text>
  
        {/* Minimal Chart: no axis */}
        <VictoryChart
            width={318}
            height={287}
            padding={{ top: 10, bottom: 10, left: 25, right: 10 }}
            domain={{ y: [0, 12] }} 
            >
            <VictoryAxis
                style={{
                axis: { stroke: 'transparent' },
                ticks: { stroke: 'transparent' },
                tickLabels: { fill: 'transparent' },
                grid: { stroke: 'transparent' },
                }}
            />
            <VictoryAxis
              dependentAxis
              tickValues={[0, 2, 4, 6, 8, 10, 12]}
              tickFormat={(t) => `${t}`}
              style={{
                axis: { stroke: 'transparent' },
                tickLabels: { fill: '#000', fontSize: 10 },
                grid: { stroke: '#E5E5E5', strokeDasharray: '4,4' },
              }}
            />
            <VictoryLine
                data={data}
                interpolation="linear"
                style={{
                data: { stroke: '#000', strokeWidth: 2 },
                }}
            />
            </VictoryChart>
      </View>
    );
  };
  
export default TremorFrequencyGraph;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 24,
        paddingVertical: 24,
        backgroundColor: '#C3BDB6',
        borderRadius: 12,
        width: '90%',
      },      
    title: {
      fontSize: 20,
      fontFamily: 'SFProDisplay-Bold',
      color: '#000',
    },
    subtitle: {
      fontSize: 14,
      color: '#000',
      marginBottom: 12,
    },
    bold: {
      fontWeight: 'bold',
    },
    change: {
      fontWeight: 'bold',
    },
    positive: {
      color: 'green',
    },
    negative: {
      color: 'red',
    },
  });
  