import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useSignal } from '@/hooks/useSignal';
import { SignalType, mixSignals } from '@/utils/dsp';
import SignalPlot from '@/components/charts/SignalPlot';

export default function MixerScreen() {
  const signal1 = useSignal({
    type: SignalType.SINE,
    frequency: 440,
    amplitude: 0.5,
    sampleRate: 44100,
    numSamples: 1024,
  });

  const signal2 = useSignal({
    type: SignalType.SINE,
    frequency: 880,
    amplitude: 0.3,
    sampleRate: 44100,
    numSamples: 1024,
  });

  const mixedSignal = useMemo(() => {
    return mixSignals([
      { data: signal1.signal, gain: 1.0 },
      { data: signal2.signal, gain: 1.0 },
    ]);
  }, [signal1.signal, signal2.signal]);

  return (
    <ScrollView className="flex-1 bg-slate-950 p-4">
      <View className="mb-4">
        <Text className="text-white text-2xl font-bold mb-2">Signal Mixer</Text>
        <Text className="text-slate-400 mb-4">Combine multiple signals and preview the output.</Text>
      </View>

      <Text className="text-slate-500 uppercase text-xs font-bold mb-2">Mixed Output</Text>
      <SignalPlot data={mixedSignal} color="#ffffff" />

      <View className="mt-4">
        <View className="bg-slate-900 p-4 rounded-xl mb-4 border-l-4 border-teal-500">
          <Text className="text-teal-400 font-bold mb-2">Signal 1 (440 Hz Sine)</Text>
          <View className="flex-row justify-between">
            <Text className="text-slate-400">Gain</Text>
            <Text className="text-white font-mono">1.0</Text>
          </View>
        </View>

        <View className="bg-slate-900 p-4 rounded-xl mb-4 border-l-4 border-amber-500">
          <Text className="text-amber-400 font-bold mb-2">Signal 2 (880 Hz Sine)</Text>
          <View className="flex-row justify-between">
            <Text className="text-slate-400">Gain</Text>
            <Text className="text-white font-mono">1.0</Text>
          </View>
        </View>
      </View>

      <View className="mt-6 p-4 bg-blue-900/20 border border-blue-900 rounded-xl">
        <Text className="text-blue-200 text-xs">
          Mixing signals is simply point-by-point addition. If the sum exceeds 1.0 or drops below -1.0, 
          clipping (distortion) will occur unless the signals are attenuated first.
        </Text>
      </View>
    </ScrollView>
  );
}
