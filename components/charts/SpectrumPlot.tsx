import React, { useMemo } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { 
  Canvas, 
  Path, 
  Skia, 
  LinearGradient, 
  vec, 
  Group,
  Rect
} from '@shopify/react-native-skia';
import Colors from '@/constants/Colors';

interface SpectrumPlotProps {
  magnitudes: Float32Array | number[];
  frequencies: Float32Array | number[];
  height?: number;
  color?: string;
  label?: string;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_WIDTH = SCREEN_WIDTH - 32;

export default function SpectrumPlot({
  magnitudes,
  frequencies,
  height = 200,
  color = Colors.neon.yellow,
  label,
}: SpectrumPlotProps) {
  const padding = 20;
  const usableHeight = height - padding * 2;
  const usableWidth = CHART_WIDTH - padding * 2;

  // Downsample to 60 points for a nice bar look
  const barData = useMemo(() => {
    const maxBars = 60;
    const step = Math.max(1, Math.floor(magnitudes.length / maxBars));
    const data = [];
    for (let i = 0; i < maxBars; i++) {
        const mag = magnitudes[i * step] || 0;
        data.push(mag);
    }
    return data;
  }, [magnitudes]);

  const gridLines = useMemo(() => {
    if (!Skia) return [];
    try {
      const lines = [];
      for (let i = 0; i <= 4; i++) {
          const y = padding + (usableHeight * i) / 4;
          const path = Skia.Path.Make();
          path.moveTo(padding, y);
          path.lineTo(padding + usableWidth, y);
          lines.push(path);
      }
      return lines;
    } catch (e) {
      return [];
    }
  }, [usableWidth, usableHeight, padding]);

  const barWidth = usableWidth / barData.length;

  if (!Skia) {
    const giftedBarData = barData.map(m => ({ value: m, frontColor: color }));
    return (
       <View className="bg-slate-900 p-4 rounded-xl mx-4">
         <BarChart 
            data={giftedBarData} 
            width={CHART_WIDTH - 64} 
            height={height - 80} 
            barWidth={4} 
            noOfSections={4}
            hideRules
            yAxisThickness={0}
            xAxisThickness={0}
         />
       </View>
    );
  }

  return (
    <View className="my-4">
      {label && <Text className="text-slate-500 text-[10px] font-mono mb-2 uppercase tracking-widest pl-4">{label}</Text>}
      
      <View 
        style={{ width: CHART_WIDTH, height, alignSelf: 'center' }}
        className="bg-slate-950 rounded-2xl overflow-hidden border border-slate-800/50 shelf-shadow-lg"
      >
        <Canvas style={{ flex: 1 }}>
          {/* Grid lines */}
          <Group color="rgba(245, 158, 11, 0.05)" strokeWidth={1} style="stroke">
             {gridLines.map((p, i) => (
                <Path key={`h-${i}`} path={p} />
             ))}
          </Group>

          {/* Bars */}
          {barData.map((mag, i) => {
            const barHeight = mag * usableHeight;
            const x = padding + i * barWidth;
            const y = padding + usableHeight - barHeight;
            
            return (
              <Group key={`bar-${i}`}>
                {/* Main Bar */}
                <Rect
                    x={x + 1}
                    y={y}
                    width={barWidth - 2}
                    height={barHeight}
                    color={color}
                    opacity={0.8}
                >
                    <LinearGradient
                        start={vec(x, y)}
                        end={vec(x, y + barHeight)}
                        colors={[color, 'transparent']}
                    />
                </Rect>
                {/* Glow Tip */}
                <Rect
                    x={x + 1}
                    y={y}
                    width={barWidth - 2}
                    height={2}
                    color={color}
                />
              </Group>
            );
          })}
        </Canvas>
      </View>
    </View>
  );
}
