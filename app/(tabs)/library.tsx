import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SymbolView } from 'expo-symbols';
import GlassCard from '@/components/ui/GlassCard';
import Colors from '@/constants/Colors';

interface SavedSignal {
  id: string;
  name: string;
  type: string;
  frequency: number;
  timestamp: number;
}

export default function LibraryScreen() {
  const [signals, setSignals] = useState<SavedSignal[]>([]);

  useEffect(() => {
    loadLibrary();
  }, []);

  const loadLibrary = async () => {
    try {
      const data = await AsyncStorage.getItem('dsp_library');
      if (data) setSignals(JSON.parse(data));
    } catch (e) {
      console.error(e);
    }
  };

  const deleteSignal = async (id: string) => {
    const updated = signals.filter(s => s.id !== id);
    setSignals(updated);
    await AsyncStorage.setItem('dsp_library', JSON.stringify(updated));
  };

  return (
    <View className="flex-1 bg-slate-950">
      <StatusBar barStyle="light-content" />
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
        
        {/* Header */}
        <View className="mb-8 pt-6">
          <Text className="text-white text-3xl font-bold tracking-tight">Signal <Text style={{ color: Colors.neon.green }}>Library</Text></Text>
          <Text className="text-slate-500 text-xs font-mono mt-1 tracking-widest uppercase">Vault of Waveforms</Text>
        </View>

        {signals.length === 0 ? (
          <View className="items-center justify-center py-24 px-8 opacity-40">
            <SymbolView name="folder.badge.questionmark" tintColor="#64748b" size={48} />
            <Text className="text-slate-500 mt-6 text-center font-mono text-xs uppercase tracking-widest leading-loose">
              Archive records are currently empty. Save oscillators from simulation.
            </Text>
          </View>
        ) : (
          <View>
            <Text className="text-slate-500 text-[10px] uppercase font-mono tracking-widest mb-4 ml-2">Stored Signals</Text>
            {signals.map(signal => (
              <GlassCard key={signal.id} className="mb-4">
                <View className="flex-row justify-between items-center">
                  <View>
                    <Text className="text-white font-bold text-base tracking-tight">{signal.name}</Text>
                    <View className="flex-row items-center mt-1">
                      <View className="bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20 mr-2">
                        <Text className="text-teal-400 text-[8px] font-mono uppercase font-bold">{signal.type}</Text>
                      </View>
                      <Text className="text-slate-500 text-[10px] font-mono">{signal.frequency}Hz</Text>
                    </View>
                  </View>
                  
                  <Pressable 
                    onPress={() => deleteSignal(signal.id)}
                    className="p-3 bg-rose-500/5 rounded-full border border-rose-500/10"
                  >
                    <SymbolView name="trash" tintColor={Colors.neon.magenta} size={18} />
                  </Pressable>
                </View>
              </GlassCard>
            ))}
          </View>
        )}

        {/* Futures Section */}
        <View className="mt-12">
            <Text className="text-slate-500 text-[10px] uppercase font-mono tracking-widest mb-6 ml-2">Protocol Roadmap</Text>
            <GlassCard borderAlpha={0.1} className="bg-indigo-500/5">
                <View className="flex-row gap-4">
                    <SymbolView name="sparkles" tintColor={Colors.neon.blue} size={22} />
                    <View className="flex-1">
                        <Text className="text-white font-bold text-sm mb-1">Coming Soon: Export Engine</Text>
                        <Text className="text-slate-400 text-[11px] leading-relaxed">
                            Integration with high-fidelity WAV export and Cloud backend synchronization protocols. 
                            Stay tuned for the next DSP release.
                        </Text>
                    </View>
                </View>
            </GlassCard>
        </View>

      </ScrollView>
    </View>
  );
}
