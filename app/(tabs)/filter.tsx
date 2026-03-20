import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { generateSignal, SignalType } from '@/utils/dsp';
import { useFilter, FilterType } from '@/hooks/useFilter';
import SignalPlot from '@/components/charts/SignalPlot';

export default function FilterScreen() {
  // Hardcoded test signal for Day 4
  const sampleRate = 8000;
  const numSamples = 4096;
  const inputSignal = useMemo(() => {
    return generateSignal(SignalType.SINE, 440, 1.0, sampleRate, numSamples);
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

  const renderSlider = (
    label: string, 
    value: number, 
    min: number, 
    max: number, 
    onUpdate: (v: number) => void,
    step: number = 10
  ) => (
    <View className="mb-4">
      <View className="flex-row justify-between mb-2">
        <Text className="text-slate-400 text-xs">{label}</Text>
        <Text className="text-amber-400 font-mono text-xs">{value} {label.includes('Freq') ? 'Hz' : ''}</Text>
      </View>
      <View className="h-1 bg-slate-800 rounded-full overflow-hidden">
        <View style={{ width: `${((value - min) / (max - min)) * 100}%` }} className="h-full bg-amber-500" />
      </View>
      <View className="flex-row justify-between mt-2">
        <Pressable onPress={() => onUpdate(Math.max(min, value - step))} className="bg-slate-800 px-3 py-1 rounded">
          <Text className="text-white text-xs">-</Text>
        </Pressable>
        <Pressable onPress={() => onUpdate(Math.min(max, value + step))} className="bg-slate-800 px-3 py-1 rounded">
          <Text className="text-white text-xs">+</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <ScrollView className="flex-1 bg-slate-950 p-4">
      <View className="mb-4">
        <Text className="text-white text-2xl font-bold mb-2">FIR Filter</Text>
        <Text className="text-slate-400">Design and apply Hamming-windowed FIR filters.</Text>
      </View>

      <Text className="text-teal-400 font-bold text-[10px] uppercase mb-1">Input (440Hz Sine)</Text>
      <SignalPlot data={inputSignal} color="#14b8a6" />

      <Text className="text-amber-400 font-bold text-[10px] uppercase mb-1 mt-2">Filtered Output</Text>
      <SignalPlot data={filteredSignal} color="#f59e0b" />

      <View className="bg-slate-900 p-4 rounded-xl mt-4 mb-8">
        {/* Filter Type Picker */}
        <View className="flex-row gap-2 mb-6">
          {(['lowpass', 'highpass', 'bandpass'] as FilterType[]).map((t) => (
            <Pressable
              key={t}
              onPress={() => setFilterType(t)}
              className={`flex-1 py-2 rounded-lg items-center ${filterType === t ? 'bg-amber-500' : 'bg-slate-800'}`}
            >
              <Text className={`text-[10px] font-bold ${filterType === t ? 'text-black' : 'text-slate-400'}`}>
                {t.toUpperCase()}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Sliders */}
        {renderSlider(
          filterType === 'bandpass' ? 'Low Cutoff Freq' : 'Cutoff Freq', 
          cutoff, 
          20, 
          sampleRate / 2, 
          setCutoff,
          50
        )}

        {filterType === 'bandpass' && renderSlider(
          'High Cutoff Freq', 
          cutoffHigh, 
          cutoff + 100, 
          sampleRate / 2, 
          setCutoffHigh,
          50
        )}

        {renderSlider(
          'Filter Order (Taps)', 
          order, 
          4, 
          64, 
          (v) => setOrder(Math.round(v / 2) * 2), // Ensure even
          2
        )}

        {/* Stats Row */}
        <View className="flex-row justify-between pt-4 border-t border-slate-800 mt-2">
          <View>
            <Text className="text-slate-500 text-[10px] uppercase">Type</Text>
            <Text className="text-white text-xs font-bold">{filterType.toUpperCase()}</Text>
          </View>
          <View className="items-center">
            <Text className="text-slate-500 text-[10px] uppercase">Cutoff</Text>
            <Text className="text-white text-xs font-bold">{cutoff}Hz{filterType === 'bandpass' ? `-${cutoffHigh}Hz` : ''}</Text>
          </View>
          <View className="items-end">
            <Text className="text-slate-500 text-[10px] uppercase">Order</Text>
            <Text className="text-white text-xs font-bold">{order} Taps</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
