import React, { useState, useRef, useMemo } from 'react';
import { View, Text, PanResponder, Animated, LayoutChangeEvent } from 'react-native';
import Colors from '@/constants/Colors';

interface NeonSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onValueChange: (value: number) => void;
  color?: string;
  suffix?: string;
}

export default function NeonSlider({
  label,
  value,
  min,
  max,
  step = 1,
  onValueChange,
  color = Colors.neon.cyan,
  suffix = '',
}: NeonSliderProps) {
  const [width, setWidth] = useState(0);
  const sliderWidth = useRef(new Animated.Value(0)).current;

  // Percentage for the track
  const percentage = useMemo(() => {
    return ((value - min) / (max - min)) * 100;
  }, [value, min, max]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt, gestureState) => {
        handleMove(evt.nativeEvent.locationX);
      },
      onPanResponderMove: (evt, gestureState) => {
        handleMove(evt.nativeEvent.locationX);
      },
    })
  ).current;

  const handleMove = (locationX: number) => {
    if (width <= 0) return;
    let newValue = (locationX / width) * (max - min) + min;
    newValue = Math.max(min, Math.min(max, newValue));
    
    // Round to step
    const steppedValue = Math.round(newValue / step) * step;
    onValueChange(steppedValue);
  };

  const onLayout = (event: LayoutChangeEvent) => {
    setWidth(event.nativeEvent.layout.width);
  };

  return (
    <View className="mb-6">
      <View className="flex-row justify-between mb-3 items-end">
        <Text className="text-slate-500 text-[10px] font-mono uppercase tracking-widest">{label}</Text>
        <View className="flex-row items-baseline">
            <Text 
                style={{ color }} 
                className="text-xl font-bold font-mono"
            >
                {value.toFixed(step < 1 ? 2 : 0)}
            </Text>
            <Text className="text-slate-600 text-[10px] ml-1 font-mono">{suffix}</Text>
        </View>
      </View>

      <View 
        onLayout={onLayout}
        {...panResponder.panHandlers}
        className="h-6 justify-center"
      >
        {/* Track Background */}
        <View className="h-[2px] w-full bg-slate-800 rounded-full" />
        
        {/* Active Track with Glow */}
        <View 
          style={{ 
            width: `${percentage}%`, 
            backgroundColor: color,
            shadowColor: color,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.8,
            shadowRadius: 10,
            elevation: 5
          }} 
          className="h-[2px] absolute left-0" 
        />

        {/* Knob */}
        <View 
           style={{ 
             left: `${percentage}%`, 
             marginLeft: -6,
             backgroundColor: '#0f172a',
             borderColor: color,
             shadowColor: color,
             shadowOffset: { width: 0, height: 0 },
             shadowOpacity: 1,
             shadowRadius: 15,
             elevation: 10
           }}
           className="h-4 w-4 rounded-full border-2 absolute" 
        />
      </View>
    </View>
  );
}
