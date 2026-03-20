import React, { useState } from 'react';
import { View, Text, ScrollView, Switch } from 'react-native';
import { useSignal } from '@/hooks/useSignal';
import { SignalType } from '@/utils/dsp';
import { SignalPlot } from '@/components/charts/SignalPlot';
// Actually, I'll use a simple View-based slider or just text inputs for now if I don't have a slider library.
// Wait, I can use react-native-slider or just custom view.
// I'll implement a simple slider component or use basic buttons for frequency selection.

export default function GenerateScreen() {
  const { signal, config, updateConfig } = useSignal({
    type: SignalType.SINE,
    frequency: 440,
    amplitude: 0.8,
    sampleRate: 44100,
    numSamples: 1024,
  });

  return (
    <ScrollView className="flex-1 bg-slate-950 p-4">
      <View className="mb-4">
        <Text className="text-white text-2xl font-bold mb-2">Signal Generator</Text>
        <Text className="text-slate-400 mb-4">Create basic periodic waveforms.</Text>
      </View>

      <SignalPlot data={signal} color="#2dd4bf" />

      <View className="bg-slate-900 p-4 rounded-xl mt-4">
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-white font-mono">Type: {config.type.toUpperCase()}</Text>
          <View className="flex-row gap-2">
            {[SignalType.SINE, SignalType.SQUARE, SignalType.SAWTOOTH].map((t) => (
              <Text 
                key={t}
                onPress={() => updateConfig({ type: t })}
                className={`px-3 py-1 rounded-full text-xs font-bold ${config.type === t ? 'bg-teal-500 text-black' : 'bg-slate-800 text-white'}`}
              >
                {t.toUpperCase()}
              </Text>
            ))}
          </View>
        </View>

        <View className="mb-6">
          <View className="flex-row justify-between mb-2">
            <Text className="text-slate-400">Frequency</Text>
            <Text className="text-teal-400 font-mono">{config.frequency.toFixed(0)} Hz</Text>
          </View>
          {/* Using a simple view-based slider proxy for now */}
          <View className="h-2 bg-slate-800 rounded-full overflow-hidden">
             <View style={{ width: `${(config.frequency / 2000) * 100}%` }} className="h-full bg-teal-500" />
          </View>
          <View className="flex-row justify-around mt-2">
             <Text onPress={() => updateConfig({ frequency: Math.max(20, config.frequency - 10) })} className="text-white bg-slate-800 p-2 rounded">-10</Text>
             <Text onPress={() => updateConfig({ frequency: Math.min(2000, config.frequency + 10) })} className="text-white bg-slate-800 p-2 rounded">+10</Text>
          </View>
        </View>

        <View className="mb-6">
          <View className="flex-row justify-between mb-2">
            <Text className="text-slate-400">Amplitude</Text>
            <Text className="text-teal-400 font-mono">{config.amplitude.toFixed(2)}</Text>
          </View>
          <View className="h-2 bg-slate-800 rounded-full overflow-hidden">
             <View style={{ width: `${config.amplitude * 100}%` }} className="h-full bg-teal-500" />
          </View>
          <View className="flex-row justify-around mt-2">
             <Text onPress={() => updateConfig({ amplitude: Math.max(0, config.amplitude - 0.1) })} className="text-white bg-slate-800 p-2 rounded">-0.1</Text>
             <Text onPress={() => updateConfig({ amplitude: Math.min(1.0, config.amplitude + 0.1) })} className="text-white bg-slate-800 p-2 rounded">+0.1</Text>
          </View>
        </View>

        <View className="mb-2">
          <View className="flex-row justify-between mb-2">
            <Text className="text-slate-400">Sample Rate</Text>
            <Text className="text-teal-400 font-mono">{config.sampleRate} Hz</Text>
          </View>
          <View className="flex-row gap-2">
            {[8000, 16000, 44100].map(sr => (
              <Text 
                key={sr}
                onPress={() => updateConfig({ sampleRate: sr })}
                className={`flex-1 text-center py-2 rounded-lg text-xs font-mono ${config.sampleRate === sr ? 'bg-slate-700 text-teal-400' : 'bg-slate-800 text-slate-500'}`}
              >
                {sr}
              </Text>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
