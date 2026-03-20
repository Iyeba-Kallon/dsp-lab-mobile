import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SymbolView } from 'expo-symbols';

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
    <ScrollView className="flex-1 bg-slate-950 p-4">
      <View className="mb-4">
        <Text className="text-white text-2xl font-bold mb-2">Signal Library</Text>
        <Text className="text-slate-400 mb-4">Saved waveforms and configurations.</Text>
      </View>

      {signals.length === 0 ? (
        <View className="items-center justify-center py-20">
          <SymbolView name="folder.badge.questionmark" tintColor="#334155" size={64} />
          <Text className="text-slate-500 mt-4 text-center">Your library is empty.</Text>
          <Text className="text-slate-600 text-xs mt-1">Save signals from the Generate or Mixer screens.</Text>
        </View>
      ) : (
        signals.map(signal => (
          <View key={signal.id} className="bg-slate-900 p-4 rounded-xl mb-3 flex-row justify-between items-center">
            <View>
              <Text className="text-white font-bold">{signal.name}</Text>
              <Text className="text-slate-500 text-xs">
                {signal.type.toUpperCase()} • {signal.frequency}Hz
              </Text>
            </View>
            <Pressable onPress={() => deleteSignal(signal.id)}>
              <SymbolView name="trash" tintColor="#ef4444" size={20} />
            </Pressable>
          </View>
        ))
      )}

      <View className="mt-8 p-4 border border-teal-500/20 bg-teal-500/5 rounded-xl">
        <Text className="text-teal-500 font-bold mb-1">Coming Soon</Text>
        <Text className="text-slate-400 text-xs text-center">
          Exporting signals to WAV format and Cloud backup integration.
        </Text>
      </View>
    </ScrollView>
  );
}
