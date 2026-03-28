import React from 'react';
import { Tabs } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.neon.cyan,
        tabBarInactiveTintColor: '#64748b',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#020617',
          borderTopColor: 'rgba(255,255,255,0.05)',
          paddingTop: 8,
          height: 88,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontFamily: 'SpaceMono',
          paddingBottom: 8,
        }
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Generate',
          tabBarIcon: ({ color }) => <SymbolView name="waveform.path" tintColor={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="filter"
        options={{
          title: 'Filter',
          tabBarIcon: ({ color }) => <SymbolView name="f.cursive" tintColor={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="analyze"
        options={{
          title: 'Analyze',
          tabBarIcon: ({ color }) => <SymbolView name="chart.bar.xaxis" tintColor={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="mixer"
        options={{
          title: 'Mixer',
          tabBarIcon: ({ color }) => <SymbolView name="slider.horizontal.3" tintColor={color} size={24} />,
        }}
      />
      < Tabs.Screen
        name="aliasing"
        options={{
          title: 'Aliasing',
          tabBarIcon: ({ color }) => <SymbolView name="waveform.path.badge.minus" tintColor={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="convolution"
        options={{
          title: 'Convolution',
          tabBarIcon: ({ color }) => <SymbolView name="asterisk.circle" tintColor={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: 'Library',
          tabBarIcon: ({ color }) => <SymbolView name="folder" tintColor={color} size={24} />,
        }}
      />
    </Tabs>
  );
}
