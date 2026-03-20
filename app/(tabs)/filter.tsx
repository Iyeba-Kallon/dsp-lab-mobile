import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useSignal } from '@/hooks/useSignal';
import { useFilter } from '@/hooks/useFilter';
import { SignalType } from '@/utils/dsp';
import SignalPlot from '@/components/charts/SignalPlot';

export default function FilterScreen() {
  const { signal: inputSignal } = useSignal({
    type: SignalType.SQUARE, // Use square wave as it has many harmonics to filter
    frequency: 200,
    amplitude: 0.7,
    sampleRate: 44100,
    numSamples: 1024,
  });

  const { filteredSignal, cutoff, setCutoff, order, setOrder } = useFilter(inputSignal);

  return (
    <ScrollView className="flex-1 bg-slate-950 p-4">
      <View className="mb-4">
        <Text className="text-white text-2xl font-bold mb-2">FIR Filtering</Text>
        <Text className="text-slate-400 mb-4">Apply a Sinc low-pass filter to the signal.</Text>
      </View>

      <Text className="text-teal-400 font-mono mb-2 uppercase text-xs font-bold">Input Signal (Square)</Text>
      <SignalPlot data={inputSignal} color="#2dd4bf" />

      <Text className="text-amber-400 font-mono mb-2 mt-4 uppercase text-xs font-bold">Filtered Output (Low Pass)</Text>
      <SignalPlot data={filteredSignal} color="#fbbf24" />

      <View className="bg-slate-900 p-4 rounded-xl mt-4">
        <View className="mb-6">
          <View className="flex-row justify-between mb-2">
            <Text className="text-slate-400">Cutoff Frequency</Text>
            <Text className="text-teal-400 font-mono">{cutoff} Hz</Text>
          </View>
          <View className="flex-row gap-2">
            {[500, 1000, 2000, 5000].map(c => (
              <Text 
                key={c}
                onPress={() => setCutoff(c)}
                className={`flex-1 text-center py-2 rounded-lg text-xs font-mono ${cutoff === c ? 'bg-slate-700 text-teal-400' : 'bg-slate-800 text-slate-500'}`}
              >
                {c}
              </Text>
            ))}
          </View>
        </View>

        <View className="mb-2">
          <View className="flex-row justify-between mb-2">
            <Text className="text-slate-400">Filter Order (Taps)</Text>
            <Text className="text-teal-400 font-mono">{order}</Text>
          </View>
          <View className="flex-row gap-2">
            {[32, 64, 128, 256].map(o => (
              <Text 
                key={o}
                onPress={() => setOrder(o)}
                className={`flex-1 text-center py-2 rounded-lg text-xs font-mono ${order === o ? 'bg-slate-700 text-teal-400' : 'bg-slate-800 text-slate-500'}`}
              >
                {o}
              </Text>
            ))}
          </View>
        </View>
      </View>

      <View className="mt-6 p-4 border border-slate-800 rounded-xl">
        <Text className="text-slate-500 text-xs italic">
          Tip: A higher filter order (more taps) creates a steeper roll-off but increases computational cost. 
          The Sinc filter used here is windowed with a Hamming window for better stop-band attenuation.
        </Text>
      </View>
    </ScrollView>
  );
}
