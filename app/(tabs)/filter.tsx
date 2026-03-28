import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Pressable, StatusBar } from 'react-native';
import { generateSignal, SignalType } from '@/utils/dsp';
import { useFilter, FilterType } from '@/hooks/useFilter';
import GlowSignalPlot from '@/components/charts/GlowSignalPlot';
import NeonSlider from '@/components/inputs/NeonSlider';
import GlassCard from '@/components/ui/GlassCard';
import Colors from '@/constants/Colors';

export default function FilterScreen() {
  const sampleRate = 8000;
  const numSamples = 1024;
  
  // Input: Sine (440Hz) + Noise (to show filtering effect)
  const inputSignal = useMemo(() => {
    const s1 = generateSignal(SignalType.SINE, 440, 0.7, sampleRate, numSamples);
    const noise = new Float32Array(numSamples);
    for (let i = 0; i < numSamples; i++) {
        noise[i] = (Math.random() * 2 - 1) * 0.2; // Add some random noise
    }
    const combined = new Float32Array(numSamples);
    for (let i = 0; i < numSamples; i++) {
        combined[i] = s1[i] + noise[i];
    }
    return combined;
  }, []);

  const [filterType, setFilterType] = useState<FilterType>('lowpass');
  const [cutoff, setCutoff] = useState(1000);
  const [cutoffHigh, setCutoffHigh] = useState(2000);
  const [order, setOrder] = useState(32);

  const { filteredSignal } = useFilter({
    signal: inputSignal,
    filterType,
    cutoff,
    order,
    sampleRate,
    cutoffHigh,
  });

  const filterTypes = [
    { id: 'lowpass' as FilterType, label: 'Low Pass', color: Colors.neon.green },
    { id: 'highpass' as FilterType, label: 'High Pass', color: Colors.neon.violet },
    { id: 'bandpass' as FilterType, label: 'Band Pass', color: Colors.neon.magenta },
  ];

  const currentColor = filterTypes.find(t => t.id === filterType)?.color || Colors.neon.cyan;

  return (
    <View className="flex-1 bg-slate-950">
      <StatusBar barStyle="light-content" />
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
        
        {/* Header */}
        <View className="mb-8 pt-6">
          <Text className="text-white text-3xl font-bold tracking-tight">Signal <Text style={{ color: Colors.neon.green }}>Filter</Text></Text>
          <Text className="text-slate-500 text-xs font-mono mt-1 tracking-widest uppercase">FIR DSP Core</Text>
        </View>

        {/* Input Signal View */}
        <View className="mb-8">
            <GlowSignalPlot 
                data={inputSignal} 
                color={Colors.neon.cyan} 
                label="Raw Input (Signal + Noise)" 
                height={160}
            />
        </View>

        {/* Filtered Output View */}
        <View className="mb-8">
            <GlowSignalPlot 
                data={filteredSignal} 
                color={currentColor} 
                label={`Filtered Output (${filterType.toUpperCase()})`} 
                height={200}
            />
        </View>

        {/* Control Console */}
        <GlassCard>
          <View className="mb-8">
             <Text className="text-slate-500 text-[10px] uppercase font-mono tracking-widest mb-4">Filter Architecture</Text>
             <View className="flex-row gap-2">
               {filterTypes.map((type) => (
                 <Pressable
                   key={type.id}
                   onPress={() => setFilterType(type.id)}
                   className={`flex-1 py-3 items-center rounded-xl border ${filterType === type.id ? 'bg-white/5 border-white/20' : 'border-transparent bg-black/20'}`}
                 >
                   <Text className={`text-[10px] font-mono uppercase tracking-tighter ${filterType === type.id ? 'text-white font-bold' : 'text-slate-600'}`}>
                     {type.label}
                   </Text>
                 </Pressable>
               ))}
             </View>
          </View>

          <NeonSlider
            label={filterType === 'bandpass' ? 'Low Cutoff' : 'Cutoff Frequency'}
            value={cutoff}
            min={20}
            max={sampleRate / 2}
            step={50}
            suffix="Hz"
            onValueChange={setCutoff}
            color={currentColor}
          />

          {filterType === 'bandpass' && (
            <NeonSlider
              label="High Cutoff"
              value={cutoffHigh}
              min={cutoff + 100}
              max={sampleRate / 2}
              step={50}
              suffix="Hz"
              onValueChange={setCutoffHigh}
              color={currentColor}
            />
          )}

          <NeonSlider
            label="Filter Order (Taps)"
            value={order}
            min={4}
            max={64}
            step={2}
            suffix="Points"
            onValueChange={(v) => setOrder(Math.round(v / 2) * 2)}
            color={currentColor}
          />

          {/* Performance Badge */}
          <View className="mt-4 pt-4 border-t border-white/5 flex-row justify-between items-center">
             <View>
                <Text className="text-slate-500 text-[10px] font-mono uppercase tracking-tight">Window Function</Text>
                <Text className="text-white text-xs font-bold font-mono">Hamming Window</Text>
             </View>
             <View className="bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                <Text className="text-green-500 text-[10px] font-bold font-mono uppercase">Optimized</Text>
             </View>
          </View>
        </GlassCard>

      </ScrollView>
    </View>
  );
}
