import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useSignal } from '@/hooks/useSignal';
import { useFFT } from '@/hooks/useFFT';
import { SignalType } from '@/utils/dsp';
import { SignalPlot } from '@/components/charts/SignalPlot';
import { SpectrumPlot } from '@/components/charts/SpectrumPlot';

export default function AnalyzeScreen() {
  const { signal, config } = useSignal({
    type: SignalType.SINE,
    frequency: 440,
    amplitude: 0.8,
    sampleRate: 44100,
    numSamples: 2048,
  });

  const { magnitude } = useFFT(signal);

  return (
    <ScrollView className="flex-1 bg-slate-950 p-4">
      <View className="mb-4">
        <Text className="text-white text-2xl font-bold mb-2">Signal Analysis</Text>
        <Text className="text-slate-400 mb-4">Time and Frequency domain visualization.</Text>
      </View>

      <Text className="text-teal-400 font-mono mb-2 uppercase text-xs font-bold">Time Domain</Text>
      <SignalPlot data={signal} color="#2dd4bf" />

      <Text className="text-amber-400 font-mono mb-2 mt-4 uppercase text-xs font-bold">Frequency Spectrum (FFT)</Text>
      <SpectrumPlot magnitude={magnitude} sampleRate={config.sampleRate} />

      <View className="bg-slate-900 p-4 rounded-xl mt-4">
        <Text className="text-white font-bold mb-2">Signal Stats</Text>
        <View className="flex-row justify-between mb-1">
          <Text className="text-slate-400">RMS Amplitude</Text>
          <Text className="text-teal-400 font-mono">0.57</Text>
        </View>
        <View className="flex-row justify-between mb-1">
          <Text className="text-slate-400">Peak-to-Peak</Text>
          <Text className="text-teal-400 font-mono">1.60</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-slate-400">Dominant Freq</Text>
          <Text className="text-teal-400 font-mono">{config.frequency} Hz</Text>
        </View>
      </View>
    </ScrollView>
  );
}
