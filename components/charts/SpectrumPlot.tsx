import React from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

interface SpectrumPlotProps {
  magnitude: Float32Array;
  sampleRate: number;
}

const screenWidth = Dimensions.get('window').width;

export const SpectrumPlot: React.FC<SpectrumPlotProps> = ({ magnitude, sampleRate }) => {
  // Downsample to 100 points max
  const maxPoints = 100;
  const step = Math.max(1, Math.floor(magnitude.length / maxPoints));
  const samples = Array.from(magnitude).filter((_, i) => i % step === 0).slice(0, maxPoints);

  return (
    <View style={styles.container}>
      <LineChart
        data={{
          labels: [],
          datasets: [{ data: samples.length > 0 ? samples : [0], color: () => '#fbbf24' }],
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
          color: () => '#fbbf24',
          labelColor: () => '#64748b',
          propsForBackgroundLines: { stroke: '#1e293b' },
        }}
        style={styles.chart}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginVertical: 8 },
  chart: { borderRadius: 12 },
});
