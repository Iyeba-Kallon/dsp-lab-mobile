import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Switch } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence } from 'react-native-reanimated';
import { SignalType } from '@/utils/dsp';
import { useMixer, SlotConfig } from '@/hooks/useMixer';
import SignalPlot from '@/components/charts/SignalPlot';

export default function MixerScreen() {
  const sampleRate = 8000;
  const numSamples = 1024;

  const [slots, setSlots] = useState<SlotConfig[]>([
    { type: SignalType.SINE, frequency: 440, gain: 0.5, enabled: true },
    { type: SignalType.SQUARE, frequency: 880, gain: 0.3, enabled: true },
    { type: SignalType.SAWTOOTH, frequency: 220, gain: 0.2, enabled: false },
  ]);

  const { individualSignals, mixedSignal, clipping, clipRatio } = useMixer({
    slots,
    sampleRate,
    numSamples,
  });

  const updateSlot = (index: number, updates: Partial<SlotConfig>) => {
    const newSlots = [...slots];
    newSlots[index] = { ...newSlots[index], ...updates };
    setSlots(newSlots);
  };

  // Clipping Pulse Animation
  const pulse = useSharedValue(1);
  useEffect(() => {
    if (clipping) {
      pulse.value = withRepeat(
        withSequence(withTiming(1.2, { duration: 400 }), withTiming(1, { duration: 400 })),
        -1,
        true
      );
    } else {
      pulse.value = 1;
    }
  }, [clipping]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  const renderSlot = (slot: SlotConfig, index: number) => (
    <View 
      key={index}
      className={`bg-slate-900 border border-slate-800 p-4 rounded-xl mb-4 ${!slot.enabled ? 'opacity-40' : 'opacity-100'}`}
    >
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-white font-bold">Signal {index + 1}</Text>
        <Switch 
          value={slot.enabled} 
          onValueChange={(val) => updateSlot(index, { enabled: val })}
          trackColor={{ false: '#334155', true: '#14b8a6' }}
        />
      </View>

      <View className="flex-row gap-2 mb-4">
        {(['sine', 'square', 'sawtooth'] as SignalType[]).map((t) => (
          <Pressable
            key={t}
            onPress={() => updateSlot(index, { type: t })}
            className={`flex-1 py-1 rounded-md items-center ${slot.type === t ? 'bg-teal-500' : 'bg-slate-800'}`}
          >
            <Text className={`text-[10px] font-bold ${slot.type === t ? 'text-black' : 'text-slate-400'}`}>
              {t.toUpperCase()}
            </Text>
          </Pressable>
        ))}
      </View>

      <View className="flex-row justify-between mb-2">
        <Text className="text-slate-500 text-[10px]">Freq: {slot.frequency}Hz</Text>
        <Text className="text-slate-500 text-[10px]">Gain: {slot.gain.toFixed(2)}</Text>
      </View>

      <View className="flex-row gap-4 items-center">
        <View className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
           <View style={{ width: `${(slot.frequency / 2000) * 100}%` }} className="h-full bg-teal-500" />
        </View>
        <View className="flex-row gap-1">
          <Pressable onPress={() => updateSlot(index, { frequency: Math.max(20, slot.frequency - 50) })} className="bg-slate-800 px-2 py-1 rounded">
            <Text className="text-white text-[10px]">-</Text>
          </Pressable>
          <Pressable onPress={() => updateSlot(index, { frequency: Math.min(2000, slot.frequency + 50) })} className="bg-slate-800 px-2 py-1 rounded">
            <Text className="text-white text-[10px]">+</Text>
          </Pressable>
        </View>
      </View>

      <View className="flex-row gap-4 items-center mt-3">
        <View className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
           <View style={{ width: `${slot.gain * 100}%` }} className="h-full bg-teal-500" />
        </View>
        <View className="flex-row gap-1">
          <Pressable onPress={() => updateSlot(index, { gain: Math.max(0, slot.gain - 0.1) })} className="bg-slate-800 px-2 py-1 rounded">
            <Text className="text-white text-[10px]">-</Text>
          </Pressable>
          <Pressable onPress={() => updateSlot(index, { gain: Math.min(1.0, slot.gain + 0.1) })} className="bg-slate-800 px-2 py-1 rounded">
            <Text className="text-white text-[10px]">+</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView className="flex-1 bg-slate-950">
      <View className="p-4">
        <View className="mb-6">
          <Text className="text-white text-2xl font-bold mb-2">Signal Mixer</Text>
          <Text className="text-slate-400">Combine multiple waves and check for clipping.</Text>
        </View>

        {slots.map(renderSlot)}

        <View className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800 mt-4 mb-8">
          <Text className="text-slate-500 text-[11px] uppercase tracking-widest mb-4">Mixed Output</Text>
          
          <SignalPlot data={mixedSignal} color="#f43f5e" label="Summed Waveform" />

          {clipping && (
            <Animated.View style={pulseStyle} className="bg-rose-500 p-3 rounded-lg mt-4 items-center">
              <Text className="text-white font-bold text-xs">CLIPPING DETECTED — REDUCE GAIN</Text>
            </Animated.View>
          )}

          <View className="mt-4 flex-row justify-between items-center">
             <Text className="text-slate-400 text-xs">Clip Ratio:</Text>
             <Text className={`font-mono font-bold ${clipping ? 'text-rose-400' : 'text-emerald-400'}`}>
               {(clipRatio * 100).toFixed(1)}%
             </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
