import React, { useMemo } from 'react';
import { View, Text, ScrollView, Dimensions, StyleSheet } from 'react-native';
import { generateSignal, SignalType } from '@/utils/dsp';
import { useFFT } from '@/hooks/useFFT';
import SignalPlot from '@/components/charts/SignalPlot';
import { BarChart } from 'react-native-gifted-charts';

const screenWidth = Dimensions.get('window').width;

export default function AnalyzeScreen() {
  // Hardcoded test signal for Day 5
  const sampleRate = 8000;
  const numSamples = 4096;
  const signal = useMemo(() => {
    return generateSignal(SignalType.SINE, 440, 1.0, sampleRate, numSamples);
  }, []);

  const { magnitudes, frequencies, rms, peak, mean } = useFFT(signal, sampleRate);

  // Downsample FFT for BarChart (max 60 bars)
  const barData = useMemo(() => {
    const maxBars = 60;
    const step = Math.max(1, Math.floor(magnitudes.length / maxBars));
    return magnitudes
      .filter((_, i) => i % step === 0)
      .slice(0, maxBars)
      .map((mag, i) => ({
        value: mag,
        label: i % 10 === 0 ? `${Math.round(frequencies[i * step])}` : '',
        frontColor: '#f59e0b',
      }));
  }, [magnitudes, frequencies]);

  const StatCard = ({ label, value }: { label: string; value: number }) => (
    <View className="flex-1 bg-slate-900 border border-slate-800 p-3 rounded-xl mx-1">
      <Text className="text-slate-500 text-[10px] uppercase mb-1">{label}</Text>
      <Text className="text-teal-400 font-mono text-sm font-bold">{value.toFixed(3)}</Text>
    </View>
  );

  return (
    <ScrollView className="flex-1 bg-slate-950">
      <View className="p-4">
        <View className="mb-6">
          <Text className="text-white text-2xl font-bold mb-2">Signal Analysis</Text>
          <Text className="text-slate-400">View time and frequency characteristics.</Text>
        </View>

        {/* Section 1: Time Domain */}
        <View className="mb-8">
          <Text className="text-slate-500 text-[11px] uppercase tracking-widest mb-3">Time Domain</Text>
          <SignalPlot data={signal} color="#14b8a6" label="Raw Waveform" />
        </View>

        {/* Section 2: Frequency Spectrum */}
        <View className="mb-8">
          <Text className="text-slate-500 text-[11px] uppercase tracking-widest mb-3">Frequency Spectrum (FFT)</Text>
          <View className="bg-slate-900 p-4 rounded-xl">
            <BarChart
              data={barData}
              width={screenWidth - 64}
              height={180}
              barWidth={Math.max(2, (screenWidth - 100) / 60)}
              noOfSections={4}
              yAxisThickness={0}
              xAxisThickness={0}
              yAxisTextStyle={styles.axisText}
              xAxisLabelTextStyle={styles.axisText}
              isAnimated
              animationDuration={500}
              maxValue={1}
            />
          </View>
        </View>

        {/* Section 3: Signal Stats */}
        <View className="mb-8">
          <Text className="text-slate-500 text-[11px] uppercase tracking-widest mb-3">Signal Statistics</Text>
          <View className="flex-row -mx-1">
            <StatCard label="RMS" value={rms} />
            <StatCard label="Peak" value={peak} />
            <StatCard label="Mean" value={mean} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  axisText: {
    color: '#64748b',
    fontSize: 8,
  },
});
