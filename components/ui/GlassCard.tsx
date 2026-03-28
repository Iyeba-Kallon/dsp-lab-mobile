import React from 'react';
import { View, ViewProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface GlassCardProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
}

export default function GlassCard({ children, className, style, ...props }: GlassCardProps) {
  return (
    <View 
      className={`rounded-3xl overflow-hidden border border-white/10 ${className}`}
      style={[{ backgroundColor: 'rgba(15, 23, 42, 0.5)' }, style]}
      {...props}
    >
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.05)', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />
      <View className="p-5">
        {children}
      </View>
    </View>
  );
}
