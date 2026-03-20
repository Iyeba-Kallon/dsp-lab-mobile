import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { generateSignal, SignalType } from '@/utils/dsp';
import SignalPlot from '@/components/charts/SignalPlot';

export default function AliasingScreen() {
  const [freq, setFreq] = useState(1000);
  const sampleRate = 4000; // Low sample rate to demonstrate aliasing easily
  const nyquist = sampleRate / 2;

  // Generate the "true" signal at a high sample rate for reference
  const trueSignal = useMemo(() => {
    return generateSignal(SignalType.SINE, freq, 0.8, 44100, 1024);
  }, [freq]);

  // Generate the "sampled" signal at the low sample rate
  const sampledSignal = useMemo(() => {
    return generateSignal(SignalType.SINE, freq, 0.8, sampleRate, 128);
  }, [freq]);

  // The aliased frequency formula: |f - N * fs|
  const aliasedFreq = useMemo(() => {
    const f = freq;
    const fs = sampleRate;
    if (f <= nyquist) return f;
    
    // Simplistic aliasing model for display
    const fold = Math.round(f / fs);
    return Math.abs(f - fold * fs);
  }, [freq, sampleRate]);

  return (
    <ScrollView className="flex-1 bg-slate-950 p-4">
      <View className="mb-4">
        <Text className="text-white text-2xl font-bold mb-2">Aliasing Demo</Text>
        <Text className="text-slate-400 mb-4">
          See what happens when frequency exceeds Nyquist ({nyquist} Hz).
        </Text>
      </View>

      <Text className="text-teal-400 font-mono mb-2 uppercase text-xs font-bold">Actual Waveform</Text>
      <SignalPlot data={trueSignal} color="#2dd4bf" />

      <Text className="text-coral font-mono mb-2 mt-4 uppercase text-xs font-bold">
        Sampled @ {sampleRate}Hz {freq > nyquist ? '(ALIASED!)' : ''}
      </Text>
      <SignalPlot data={sampledSignal} color="#fb7185" />

      <View className="bg-slate-900 p-4 rounded-xl mt-4">
        <View className="mb-6">
          <View className="flex-row justify-between mb-2">
            <Text className="text-slate-400">Input Frequency</Text>
            <Text className={`font-mono ${freq > nyquist ? 'text-coral' : 'text-teal-400'}`}>
              {freq} Hz
            </Text>
          </View>
          <View className="flex-row gap-2 flex-wrap">
            {[500, 1500, 2500, 3500, 4500, 5500].map(f => (
              <Text 
                key={f}
                onPress={() => setFreq(f)}
                className={`px-4 py-2 rounded-lg text-xs font-mono ${freq === f ? 'bg-slate-700 text-white' : 'bg-slate-800 text-slate-500'}`}
              >
                {f} Hz
              </Text>
            ))}
          </View>
        </View>

        {freq > nyquist && (
          <View className="p-3 bg-rose-900/40 rounded-lg border border-rose-800">
            <Text className="text-rose-200 text-sm font-bold mb-1">Observation:</Text>
            <Text className="text-rose-300 text-xs">
              The input frequency ({freq} Hz) is above the Nyquist limit ({nyquist} Hz). 
              The sampler can't keep up, causing the signal to "fold back" and appear as a lower frequency 
              of approx. {aliasedFreq.toFixed(0)} Hz.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
