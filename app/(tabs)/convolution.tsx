import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, StatusBar } from 'react-native';
import { convolve } from '@/utils/dsp';
import GlowSignalPlot from '@/components/charts/GlowSignalPlot';
import NeonSlider from '@/components/inputs/NeonSlider';
import GlassCard from '@/components/ui/GlassCard';
import Colors from '@/constants/Colors';

export default function ConvolutionScreen() {
  const [pulseWidth, setPulseWidth] = useState(20);
  const [kernelSize, setKernelSize] = useState(15);
  const totalSamples = 120;

  // Dynamic input: Pulse with adjustable width
  const input = useMemo(() => {
    const arr = new Float32Array(totalSamples);
    arr.fill(0);
    const start = Math.floor((totalSamples - pulseWidth) / 2);
    const end = start + pulseWidth;
    for (let i = start; i < end; i++) {
        if (i >= 0 && i < totalSamples) arr[i] = 1.0;
    }
    return arr;
  }, [pulseWidth, totalSamples]);

  // Dynamic kernel: Moving average (Rect) with adjustable size
  const kernel = useMemo(() => {
    const arr = new Float32Array(kernelSize);
    arr.fill(1.0 / kernelSize);
    return arr;
  }, [kernelSize]);

  const output = useMemo(() => {
    return convolve(input, kernel);
  }, [input, kernel]);

  return (
    <View className="flex-1 bg-slate-950">
      <StatusBar barStyle="light-content" />
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
        
        {/* Header */}
        <View className="mb-8 pt-6">
          <Text className="text-white text-3xl font-bold tracking-tight">Wave <Text style={{ color: Colors.neon.amber }}>Convolution</Text></Text>
          <Text className="text-slate-500 text-xs font-mono mt-1 tracking-widest uppercase">Linear System Processing</Text>
        </View>

        {/* Plots Section */}
        <View className="mb-8">
            <GlowSignalPlot 
                data={input} 
                color={Colors.neon.cyan} 
                label="Input Signal x(n)" 
                height={140}
            />
            <View className="h-4" />
            <GlowSignalPlot 
                data={kernel} 
                color={Colors.neon.amber} 
                label="Impulse Response h(n)" 
                height={100}
            />
            <View className="h-4" />
            <GlowSignalPlot 
                data={output} 
                color="#ffffff" 
                label="System Output y(n) = x(n) * h(n)" 
                height={160}
            />
        </View>

        {/* Controls Section */}
        <GlassCard className="mb-8">
          <Text className="text-slate-500 text-[10px] uppercase font-mono tracking-widest mb-6">Simulation Parameters</Text>
          
          <NeonSlider
            label="Input Pulse Width"
            value={pulseWidth}
            min={2}
            max={80}
            step={1}
            suffix=" Samples"
            onValueChange={setPulseWidth}
            color={Colors.neon.cyan}
          />

          <NeonSlider
            label="Kernel Smoothing (LTI)"
            value={kernelSize}
            min={1}
            max={40}
            step={1}
            suffix=" Taps"
            onValueChange={setKernelSize}
            color={Colors.neon.amber}
          />
        </GlassCard>

        {/* Education Section */}
        <GlassCard borderAlpha={0.1}>
          <Text className="text-white font-bold mb-3">Mathematical Insight</Text>
          <Text className="text-slate-400 text-xs font-mono leading-relaxed">
            Convolution "slides" the kernel <Text className="text-amber-400">h(n)</Text> across the input <Text className="text-teal-400">x(n)</Text>. 
            The resulting <Text className="text-white">y(n)</Text> represents the cumulative overlap. Note how a wider kernel creates a smoother, 
            more delayed output, demonstrating the low-pass nature of a moving average filter.
          </Text>
        </GlassCard>

      </ScrollView>
    </View>
  );
}
