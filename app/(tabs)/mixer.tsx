import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Switch, StatusBar } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence } from 'react-native-reanimated';
import { SignalType } from '@/utils/dsp';
import { useMixer, SlotConfig } from '@/hooks/useMixer';
import GlowSignalPlot from '@/components/charts/GlowSignalPlot';
import NeonSlider from '@/components/inputs/NeonSlider';
import GlassCard from '@/components/ui/GlassCard';
import Colors from '@/constants/Colors';

export default function MixerScreen() {
  const sampleRate = 8000;
  const numSamples = 1024;

  const [slots, setSlots] = useState<SlotConfig[]>([
    { type: SignalType.SINE, frequency: 440, gain: 0.5, enabled: true },
    { type: SignalType.SQUARE, frequency: 880, gain: 0.3, enabled: true },
    { type: SignalType.SAWTOOTH, frequency: 220, gain: 0.2, enabled: false },
  ]);

  const { mixedSignal, clipping, clipRatio } = useMixer({
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
        withSequence(withTiming(1.05, { duration: 400 }), withTiming(1, { duration: 400 })),
        -1,
        true
      );
    } else {
      pulse.value = 1;
    }
  }, [clipping]);

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: clipping ? withTiming(1) : withTiming(0),
    transform: [{ scale: pulse.value }],
  }));

  const signalMetadata = {
    [SignalType.SINE]: { label: 'Sine', color: Colors.neon.cyan },
    [SignalType.SQUARE]: { label: 'Square', color: Colors.neon.violet },
    [SignalType.SAWTOOTH]: { label: 'Saw', color: Colors.neon.magenta },
  };

  const renderSlot = (slot: SlotConfig, index: number) => {
    const meta = signalMetadata[slot.type];
    
    return (
      <GlassCard key={index} className={`mb-6 ${!slot.enabled ? 'opacity-50' : ''}`}>
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-white font-bold tracking-tight">Signal Slot {index + 1}</Text>
            <Text className="text-slate-500 text-[10px] font-mono uppercase tracking-widest mt-1">Oscillator Channel</Text>
          </View>
          <Switch 
            value={slot.enabled} 
            onValueChange={(val) => updateSlot(index, { enabled: val })}
            trackColor={{ false: '#1e293b', true: meta.color }}
            thumbColor={slot.enabled ? '#fff' : '#64748b'}
          />
        </View>

        <View className="flex-row gap-2 mb-8">
          {Object.entries(signalMetadata).map(([type, data]) => (
            <Pressable
              key={type}
              onPress={() => updateSlot(index, { type: type as SignalType })}
              className={`flex-1 py-3 rounded-xl border items-center ${slot.type === type ? 'border-white/10 bg-white/5' : 'border-transparent bg-black/20'}`}
            >
              <View 
                className="w-1.5 h-1.5 rounded-full mb-2" 
                style={{ backgroundColor: data.color, opacity: slot.type === type ? 1 : 0.3 }} 
              />
              <Text className={`text-[9px] font-mono uppercase tracking-tighter ${slot.type === type ? 'text-white' : 'text-slate-500'}`}>
                {data.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <NeonSlider
          label="Frequency"
          value={slot.frequency}
          min={20}
          max={2000}
          step={1}
          suffix="Hz"
          onValueChange={(val) => updateSlot(index, { frequency: val })}
          color={meta.color}
        />

        <NeonSlider
          label="Gain"
          value={slot.gain}
          min={0}
          max={1.0}
          step={0.01}
          suffix="V"
          onValueChange={(val) => updateSlot(index, { gain: val })}
          color={meta.color}
        />
      </GlassCard>
    );
  };

  return (
    <View className="flex-1 bg-slate-950">
      <StatusBar barStyle="light-content" />
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
        
        {/* Header Section */}
        <View className="mb-8 pt-6">
          <Text className="text-white text-3xl font-bold tracking-tight">Signal <Text style={{ color: Colors.neon.violet }}>Mixer</Text></Text>
          <Text className="text-slate-500 text-xs font-mono mt-1 tracking-widest uppercase">Multi-track Summation Lab</Text>
        </View>

        {/* Individual Slots */}
        {slots.map(renderSlot)}

        {/* Master Output Section */}
        <View className="mt-4 mb-8">
          <Text className="text-slate-500 text-[10px] uppercase font-mono tracking-widest mb-4 ml-2">Composite Output</Text>
          
          <GlowSignalPlot 
            data={mixedSignal} 
            color={clipping ? Colors.neon.magenta : Colors.neon.cyan} 
            label="Mixed Resultant Waveform"
            height={220}
          />

          <View className="mt-6 flex-row justify-between items-center px-2">
             <View>
               <Text className="text-slate-500 text-[10px] font-mono uppercase tracking-tight">Clip Headroom</Text>
               <Text className={`font-mono text-lg font-bold ${clipping ? 'text-rose-400' : 'text-emerald-400'}`}>
                 {(clipRatio * 100).toFixed(1)}% {clipping ? 'OVER' : 'OK'}
               </Text>
             </View>
             
             <Animated.View style={pulseStyle} className="bg-rose-500/10 border border-rose-500/30 px-4 py-2 rounded-full">
                <Text className="text-rose-500 text-[10px] font-bold font-mono tracking-tighter uppercase">Gain Warning</Text>
             </Animated.View>
          </View>

          {clipping && (
            <GlassCard className="mt-6 border-rose-500/20 bg-rose-500/5">
              <Text className="text-rose-200 text-xs font-mono leading-relaxed">
                <Text className="font-bold uppercase">Signal Distortion Detected:</Text> Summed amplitude exceeds 1.0 peak-to-peak. Reduce individual channel gains to normalize the output.
              </Text>
            </GlassCard>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
