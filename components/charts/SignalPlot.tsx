import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';

interface SignalPlotProps {
  data: Float32Array | number[];
  color?: string;
  label?: string;
}

const screenWidth = Dimensions.get('window').width;

export default function SignalPlot({
  data,
  color = '#14b8a6',
  label = 'Signal',
}: SignalPlotProps) {
  // Downsample to 80 points max for performance
  const chartData = useMemo(() => {
    const maxPoints = 80;
    const step = Math.max(1, Math.floor(data.length / maxPoints));
    const rawData = Array.from(data);
    return rawData
      .filter((_, i) => i % step === 0)
      .slice(0, maxPoints)
      .map((value) => ({ value }));
  }, [data]);

  if (!chartData.length) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No signal yet</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <LineChart
        data={chartData}
        width={screenWidth - 48}
        height={180}
        color={color}
        thickness={2}
        hideDataPoints
        curved
        noOfSections={4}
        yAxisColor="#1e293b"
        xAxisColor="#1e293b"
        rulesColor="#1e293b"
        yAxisTextStyle={styles.axisText}
        backgroundColor="#0f172a"
        initialSpacing={0}
        endSpacing={0}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    paddingHorizontal: 16,
  },
  label: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 6,
    fontFamily: 'monospace',
  },
  axisText: {
    color: '#64748b',
    fontSize: 10,
  },
  empty: {
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f172a',
    borderRadius: 12,
    marginVertical: 8,
  },
  emptyText: {
    color: '#334155',
    fontSize: 13,
  },
});
