import React from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

interface SignalPlotProps {
  data: Float32Array | number[];
  color?: string;
  label?: string;
}

const screenWidth = Dimensions.get('window').width;

export default function SignalPlot({ data, color = '#14b8a6', label = 'Signal' }: SignalPlotProps) {
  // Downsample to 100 points max so the chart stays fast
  const maxPoints = 100;
  const step = Math.max(1, Math.floor(data.length / maxPoints));
  
  // Convert Float32Array to number[] if needed
  const samples = Array.from(data).filter((_, i) => i % step === 0).slice(0, maxPoints);

  return (
    <View style={styles.container}>
      <LineChart
        data={{
          labels: [],
          datasets: [{ data: samples.length > 0 ? samples : [0], color: () => color }],
        }}
        width={screenWidth - 32}
        height={200}
        withDots={false}
        withInnerLines={false}
        withOuterLines={true}
        withHorizontalLabels={true}
        withVerticalLabels={false}
        chartConfig={{
          backgroundColor: '#0f172a',
          backgroundGradientFrom: '#0f172a',
          backgroundGradientTo: '#0f172a',
          decimalPlaces: 2,
          color: () => color,
          labelColor: () => '#64748b',
          propsForBackgroundLines: { stroke: '#1e293b' },
        }}
        bezier={false} // Disabled bezier for more accurate DSP signal representation
        style={styles.chart}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 8 },
  chart: { borderRadius: 12 },
});
