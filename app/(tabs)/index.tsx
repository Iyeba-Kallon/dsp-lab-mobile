import React from 'react';
import { View, Text, ScrollView, Pressable, StatusBar } from 'react-native';
import { useSignal } from '@/hooks/useSignal';
import { SignalType } from '@/utils/dsp';
import GlowSignalPlot from '@/components/charts/GlowSignalPlot';
import NeonSlider from '@/components/inputs/NeonSlider';
import GlassCard from '@/components/ui/GlassCard';
import Colors from '@/constants/Colors';

export default function GenerateScreen() {
  const { signal, config, updateConfig } = useSignal({
    type: SignalType.SINE,
    frequency: 440,
    amplitude: 0.8,
    sampleRate: 44100,
    numSamples: 1024,
  });

  const signalTypes = [
    { id: SignalType.SINE, label: 'Sine', color: Colors.neon.cyan },
    { id: SignalType.SQUARE, label: 'Square', color: Colors.neon.violet },
    { id: SignalType.SAWTOOTH, label: 'Saw', color: Colors.neon.magenta },
  ];

  return (
    <View className="flex-1 bg-slate-950">
      <StatusBar barStyle="light-content" />
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
        
        {/* Header Section */}
        <View className="mb-8 pt-6">
          <Text className="text-white text-3xl font-bold tracking-tight">Signal <Text style={{ color: Colors.neon.cyan }}>Gen</Text></Text>
          <Text className="text-slate-500 text-xs font-mono mt-1 tracking-widest uppercase">Precision Waveform Lab</Text>
        </View>

        {/* Visualizer Section */}
        <View className="mb-8">
           <GlowSignalPlot 
             data={signal} 
             color={signalTypes.find(t => t.id === config.type)?.color || Colors.neon.cyan}
             label="Real-time Oscilloscope"
             height={240}
           />
        </View>

        {/* Configuration Console */}
        <GlassCard>
          <View className="mb-8">
             <Text className="text-slate-400 text-[10px] uppercase font-mono tracking-widest mb-4">Oscillator Type</Text>
             <View className="flex-row gap-3">
               {signalTypes.map((type) => (
                 <Pressable
                   key={type.id}
                   onPress={() => updateConfig({ type: type.id })}
                   className={`flex-1 py-3 items-center rounded-xl border ${config.type === type.id ? 'border-white/20' : 'border-transparent'}`}
                   style={{ 
                     backgroundColor: config.type === type.id ? 'rgba(255, 255, 255, 0.05)' : 'transparent' 
                   }}
                 >
                   <View 
                      className="w-2 h-2 rounded-full mb-2" 
                      style={{ 
                        backgroundColor: type.color,
                        shadowColor: type.color,
                        shadowOpacity: config.type === type.id ? 1 : 0.3,
                        shadowRadius: 5
                      }} 
                   />
                   <Text className={`text-[10px] font-mono uppercase tracking-tighter ${config.type === type.id ? 'text-white font-bold' : 'text-slate-500'}`}>
                     {type.label}
                   </Text>
                 </Pressable>
               ))}
             </View>
          </View>

          <NeonSlider
            label="Frequency"
            value={config.frequency}
            min={20}
            max={2000}
            step={1}
            suffix="Hz"
            onValueChange={(val) => updateConfig({ frequency: val })}
            color={signalTypes.find(t => t.id === config.type)?.color}
          />

          <NeonSlider
            label="Amplitude"
            value={config.amplitude}
            min={0}
            max={1.0}
            step={0.01}
            suffix="V"
            onValueChange={(val) => updateConfig({ amplitude: val })}
            color={signalTypes.find(t => t.id === config.type)?.color}
          />

          {/* Sample Rate Selector */}
          <View>
            <Text className="text-slate-500 text-[10px] uppercase font-mono tracking-widest mb-4">Sampling Precision</Text>
            <View className="flex-row gap-2">
              {[8000, 16000, 44100].map(sr => (
                <Pressable 
                  key={sr}
                  onPress={() => updateConfig({ sampleRate: sr })}
                  className={`flex-1 items-center py-2 rounded-lg border ${config.sampleRate === sr ? 'bg-white/5 border-white/10' : 'border-transparent bg-black/20'}`}
                >
                  <Text className={`text-[10px] font-mono ${config.sampleRate === sr ? 'text-teal-400' : 'text-slate-600'}`}>
                    {sr} HZ
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </GlassCard>
      </ScrollView>
    </View>
  );
}
