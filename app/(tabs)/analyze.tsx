import React, { useMemo } from 'react';
import { View, Text, ScrollView, StatusBar, Dimensions } from 'react-native';
import { generateSignal, SignalType } from '@/utils/dsp';
import { useFFT } from '@/hooks/useFFT';
import GlowSignalPlot from '@/components/charts/GlowSignalPlot';
import SpectrumPlot from '@/components/charts/SpectrumPlot';
import WaterfallSpectrogram from '@/components/charts/WaterfallSpectrogram';
import GlassCard from '@/components/ui/GlassCard';
import Colors from '@/constants/Colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function AnalyzeScreen() {
  const sampleRate = 8000;
  const numSamples = 1024;
  
  // Create a slightly more complex signal for analysis (Sine + Sine)
  const signal = useMemo(() => {
    const s1 = generateSignal(SignalType.SINE, 440, 0.6, sampleRate, numSamples);
    const s2 = generateSignal(SignalType.SINE, 880, 0.3, sampleRate, numSamples);
    const combined = new Float32Array(numSamples);
    for (let i = 0; i < numSamples; i++) {
        combined[i] = s1[i] + s2[i];
    }
    return combined;
  }, []);

  const { magnitudes, frequencies, rms, peak, mean } = useFFT(signal, sampleRate);

  const StatCard = ({ label, value, color }: { label: string; value: number; color: string }) => (
    <View className="flex-1 bg-white/5 border border-white/10 p-4 rounded-2xl mx-1 backdrop-blur-md">
      <Text className="text-slate-500 text-[10px] font-mono uppercase tracking-widest mb-1">{label}</Text>
      <Text style={{ color }} className="font-mono text-lg font-bold">{value.toFixed(3)}</Text>
    </View>
  );

  return (
    <View className="flex-1 bg-slate-950">
      <StatusBar barStyle="light-content" />
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
        
        {/* Header */}
        <View className="mb-8 pt-6">
          <Text className="text-white text-3xl font-bold tracking-tight">Signal <Text style={{ color: Colors.neon.yellow }}>Analysis</Text></Text>
          <Text className="text-slate-500 text-xs font-mono mt-1 tracking-widest uppercase">Deep Spectral Insights</Text>
        </View>

        {/* Time Domain Section */}
        <View className="mb-8">
            <GlowSignalPlot 
                data={signal} 
                color={Colors.neon.cyan} 
                label="Raw Waveform (Time Domain)" 
                height={200}
            />
        </View>

        {/* Frequency Domain Section */}
        <View className="mb-8">
            <SpectrumPlot 
                magnitudes={magnitudes} 
                frequencies={frequencies} 
                color={Colors.neon.yellow}
                label="Frequency Distribution (FFT)"
                height={220}
            />
        </View>

        {/* Waterfall Section */}
        <View className="mb-8">
            <WaterfallSpectrogram 
                magnitudes={magnitudes}
                label="Waterfall Spectrogram (History)"
                height={240}
            />
        </View>

        {/* Signal Stats Section */}
        <View className="mb-8">
          <Text className="text-slate-500 text-[10px] uppercase font-mono tracking-widest mb-4 ml-2">Real-time Metrics</Text>
          <View className="flex-row -mx-1">
            <StatCard label="RMS" value={rms} color={Colors.neon.green} />
            <StatCard label="Peak" value={peak} color={Colors.neon.violet} />
            <StatCard label="Mean" value={mean} color={Colors.neon.blue} />
          </View>
        </View>

        <GlassCard className="mt-4">
             <Text className="text-slate-400 text-xs font-mono leading-relaxed">
                Analysis performed at <Text className="text-white">{sampleRate} Hz</Text> using a <Text className="text-white">{numSamples}</Text> point FFT window. Peaks indicate dominant harmonic frequencies.
             </Text>
        </GlassCard>

      </ScrollView>
    </View>
  );
}
