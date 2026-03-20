import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { convolve } from '@/utils/dsp';
import SignalPlot from '@/components/charts/SignalPlot';

export default function ConvolutionScreen() {
  // Simple signal: Pulse
  const input = useMemo(() => {
    const arr = new Float32Array(100);
    arr.fill(0);
    for(let i=40; i<60; i++) arr[i] = 1.0;
    return arr;
  }, []);

  // Simple kernel: Moving average (Rect)
  const kernel = useMemo(() => {
    const arr = new Float32Array(20);
    arr.fill(1.0 / 10);
    return arr;
  }, []);

  const output = useMemo(() => {
    return convolve(input, kernel);
  }, [input, kernel]);

  return (
    <ScrollView className="flex-1 bg-slate-950 p-4">
      <View className="mb-4">
        <Text className="text-white text-2xl font-bold mb-2">Convolution</Text>
        <Text className="text-slate-400 mb-4">
          The fundamental operation of linear systems: y(n) = x(n) * h(n).
        </Text>
      </View>

      <Text className="text-teal-400 font-mono mb-2 uppercase text-xs font-bold">Input x(n)</Text>
      <SignalPlot data={input} color="#2dd4bf" />

      <Text className="text-amber-400 font-mono mb-2 mt-4 uppercase text-xs font-bold">Kernel h(n)</Text>
      <SignalPlot data={kernel} color="#fbbf24" />

      <Text className="text-white font-mono mb-2 mt-4 uppercase text-xs font-bold">Output y(n)</Text>
      <SignalPlot data={output} color="#ffffff" />

      <View className="mt-6 p-4 bg-slate-900 rounded-xl">
        <Text className="text-white font-bold mb-2">How it works</Text>
        <Text className="text-slate-400 text-sm">
          Convolution slides the kernel across the input signal. At each step, it multiplies the overlapping 
          samples and sums them up. This specific example shows a square pulse being "smoothed" by a moving 
          average kernel, resulting in a trapezoidal shape.
        </Text>
      </View>
    </ScrollView>
  );
}
