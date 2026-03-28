import React, { useMemo, useEffect, useState } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { 
  Canvas, 
  Rect, 
  Skia, 
  Group,
  LinearGradient,
  vec
} from '@shopify/react-native-skia';
import Colors from '@/constants/Colors';

interface WaterfallSpectrogramProps {
  magnitudes: Float32Array | number[];
  height?: number;
  maxHistory?: number;
  label?: string;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_WIDTH = SCREEN_WIDTH - 32;

export default function WaterfallSpectrogram({
  magnitudes,
  height = 240,
  maxHistory = 40,
  label = 'Waterfall Spectrogram',
}: WaterfallSpectrogramProps) {
  const [history, setHistory] = useState<number[][]>([]);
  const bins = 32; // Fixed resolution for performance

  useEffect(() => {
    if (!Skia) return;
    
    // Downsample current magnitudes to fixed bins
    const step = Math.max(1, Math.floor(magnitudes.length / bins));
    const currentBins: number[] = [];
    for (let i = 0; i < bins; i++) {
        currentBins.push(magnitudes[i * step] || 0);
    }

    setHistory(prev => {
        const next = [currentBins, ...prev];
        return next.slice(0, maxHistory);
    });
  }, [magnitudes, maxHistory]);

  if (!Skia) {
    return (
      <View className="my-4">
        {label && <Text className="text-slate-500 text-[10px] font-mono mb-2 uppercase tracking-widest pl-4">{label}</Text>}
        <View 
          style={{ width: CHART_WIDTH, height, alignSelf: 'center' }}
          className="bg-slate-900 rounded-2xl items-center justify-center border border-slate-800"
        >
          <Text className="text-slate-500 text-[10px] font-mono text-center px-6">
            Waterfall Spectrogram requires Skia.{"\n"}
            (Not supported on this platform/web)
          </Text>
        </View>
      </View>
    );
  }

  const rowHeight = height / maxHistory;
  const colWidth = CHART_WIDTH / bins;

  // Define heat map colors
  const gradientColors = [
      'transparent',
      '#06b6d4', // Cyan
      '#3b82f6', // Blue
      '#8b5cf6', // Violet
      '#ec4899', // Pink
      '#f43f5e', // Red
  ];

  return (
    <View className="my-4">
      {label && <Text className="text-slate-500 text-[10px] font-mono mb-2 uppercase tracking-widest pl-4">{label}</Text>}
      
      <View 
        style={{ width: CHART_WIDTH, height, alignSelf: 'center' }}
        className="bg-black rounded-2xl overflow-hidden border border-slate-800/50 shelf-shadow-lg"
      >
        <Canvas style={{ flex: 1 }}>
          {history.map((row, rowIndex) => (
             <Group key={`row-${rowIndex}`}>
                {row.map((val, colIndex) => {
                    const colorIndex = Math.min(gradientColors.length - 1, Math.floor(val * gradientColors.length * 2));
                    if (val < 0.05) return null;
                    
                    return (
                        <Rect
                            key={`cell-${rowIndex}-${colIndex}`}
                            x={colIndex * colWidth}
                            y={rowIndex * rowHeight}
                            width={colWidth}
                            height={rowHeight}
                            color={gradientColors[colorIndex]}
                            opacity={Math.min(1, val * 2)}
                        />
                    );
                })}
             </Group>
          ))}
        </Canvas>
      </View>
    </View>
  );
}
