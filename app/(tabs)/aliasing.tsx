import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, StatusBar } from 'react-native';
import { generateSignal, SignalType } from '@/utils/dsp';
import GlowSignalPlot from '@/components/charts/GlowSignalPlot';
import NeonSlider from '@/components/inputs/NeonSlider';
import GlassCard from '@/components/ui/GlassCard';
import Colors from '@/constants/Colors';

export default function AliasingScreen() {
  const [freq, setFreq] = useState(1000);
  const sampleRate = 4000; // Demostration sample rate
  const nyquist = sampleRate / 2;

  // Reference "analog" signal (high sample rate)
  const trueSignal = useMemo(() => {
    return generateSignal(SignalType.SINE, freq, 0.8, 44100, 1024);
  }, [freq]);

  // Sampled "digital" signal (low sample rate)
  const sampledSignal = useMemo(() => {
    return generateSignal(SignalType.SINE, freq, 0.8, sampleRate, 128);
  }, [freq]);

  const aliasedFreq = useMemo(() => {
    const f = freq;
    const fs = sampleRate;
    if (f <= nyquist) return f;
    const fold = Math.round(f / fs);
    return Math.abs(f - fold * fs);
  }, [freq, sampleRate]);

  const isAliased = freq > nyquist;

  return (
    <View className="flex-1 bg-slate-950">
      <StatusBar barStyle="light-content" />
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
        
        {/* Header */}
        <View className="mb-8 pt-6">
          <Text className="text-white text-3xl font-bold tracking-tight">Spectral <Text style={{ color: Colors.neon.magenta }}>Aliasing</Text></Text>
          <Text className="text-slate-500 text-xs font-mono mt-1 tracking-widest uppercase">The Nyquist Limit Demo</Text>
        </View>

        {/* Visualizer Section */}
        <View className="mb-8">
            <GlowSignalPlot 
                data={trueSignal} 
                color={Colors.neon.cyan} 
                label="Ideal Waveform (Pre-Sampling)" 
                height={160}
            />
            <View className="h-6" />
            <GlowSignalPlot 
                data={sampledSignal} 
                color={isAliased ? Colors.neon.magenta : Colors.neon.green} 
                label={`Reconstructed @ ${sampleRate}Hz ${isAliased ? '(ALIASED)' : '(SAFE)'}`} 
                height={200}
            />
        </View>

        {/* Simulation Dashboard */}
        <GlassCard className="mb-8">
          <View className="flex-row justify-between items-center mb-6">
             <View>
               <Text className="text-slate-500 text-[10px] uppercase font-mono tracking-widest mb-1">Target Frequency</Text>
               <Text className={`text-xl font-bold font-mono ${isAliased ? 'text-rose-400' : 'text-teal-400'}`}>
                 {freq.toLocaleString()} Hz
               </Text>
             </View>
             <View className="items-end">
               <Text className="text-slate-500 text-[10px] uppercase font-mono tracking-widest mb-1">Nyquist Zone</Text>
               <Text className="text-white text-xs font-mono">{nyquist} Hz</Text>
             </View>
          </View>

          <NeonSlider
            label="Adjust Oscillator"
            value={freq}
            min={100}
            max={8000}
            step={50}
            suffix="Hz"
            onValueChange={setFreq}
            color={isAliased ? Colors.neon.magenta : Colors.neon.cyan}
          />
        </GlassCard>

        {/* Diagnostic Box */}
        {isAliased ? (
          <GlassCard borderAlpha={0.2} className="bg-rose-500/5 mb-8">
             <View className="flex-row gap-3 items-center mb-3">
                <View className="w-2 h-2 rounded-full bg-rose-500" />
                <Text className="text-rose-400 font-bold uppercase text-[10px] tracking-widest">Folding Violation</Text>
             </View>
             <Text className="text-rose-200/80 text-xs font-mono leading-relaxed">
               The frequency exceeds the Nyquist limit. The sampler cannot distinguish cycles, causing 
               the energy to fold back to <Text className="text-white font-bold">{aliasedFreq.toFixed(0)} Hz</Text>. 
               This is a permanent loss of information.
             </Text>
          </GlassCard>
        ) : (
          <GlassCard borderAlpha={0.2} className="bg-emerald-500/5 mb-8">
             <View className="flex-row gap-3 items-center mb-3">
                <View className="w-2 h-2 rounded-full bg-emerald-500" />
                <Text className="text-emerald-400 font-bold uppercase text-[10px] tracking-widest">Sampling Valid</Text>
             </View>
             <Text className="text-emerald-200/80 text-xs font-mono leading-relaxed">
               The current frequency is within the safe zone (< Nyquist). The Whittaker–Shannon 
               interpolation formula can perfectly reconstruct this signal from its discrete samples.
             </Text>
          </GlassCard>
        )}

      </ScrollView>
    </View>
  );
}
