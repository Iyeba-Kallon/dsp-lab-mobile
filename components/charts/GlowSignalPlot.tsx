import React, { useMemo } from 'react';
import { View, Text, Dimensions } from 'react-native';
import SignalPlotFallback from './SignalPlot';
import { 
  Canvas, 
  Path, 
  Skia, 
  LinearGradient, 
  vec, 
  BlurMask,
  Group
} from '@shopify/react-native-skia';
import Colors from '@/constants/Colors';

interface GlowSignalPlotProps {
  data: Float32Array | number[];
  height?: number;
  color?: string;
  label?: string;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_WIDTH = SCREEN_WIDTH - 32;

export default function GlowSignalPlot({
  data,
  height = 200,
  color = Colors.neon.cyan,
  label,
}: GlowSignalPlotProps) {
  const padding = 20;
  const usableHeight = height - padding * 2;
  const usableWidth = CHART_WIDTH - padding * 2;

  // Convert signal data to a Skia Path
  const path = useMemo(() => {
    // Safety check inside hook to satisfy Rules of Hooks
    if (!Skia || !data || data.length === 0) return null;

    try {
      const skPath = Skia.Path.Make();
      const stepX = usableWidth / (data.length - 1);
      
      const centerY = padding + usableHeight / 2;
      const scaleY = usableHeight / 2;

      skPath.moveTo(padding, centerY - data[0] * scaleY);

      for (let i = 1; i < data.length; i++) {
          skPath.lineTo(padding + i * stepX, centerY - data[i] * scaleY);
      }

      return skPath;
    } catch (e) {
      console.warn("Skia Path creation failed:", e);
      return null;
    }
  }, [data, usableWidth, usableHeight, padding]);

  // Create grid lines
  const gridLines = useMemo(() => {
    if (!Skia) return [];
    
    try {
      const lines = [];
      for (let i = 0; i <= 4; i++) {
          const y = padding + (usableHeight * i) / 4;
          const line = Skia.Path.Make();
          line.moveTo(padding, y);
          line.lineTo(padding + usableWidth, y);
          lines.push(line);
      }
      for (let i = 0; i <= 8; i++) {
          const x = padding + (usableWidth * i) / 8;
          const line = Skia.Path.Make();
          line.moveTo(x, padding);
          line.lineTo(x, padding + usableHeight);
          lines.push(line);
      }
      return lines;
    } catch (e) {
      return [];
    }
  }, [usableWidth, usableHeight, padding]);

  // Final platform check for rendering
  if (!Skia || !path) {
    return <SignalPlotFallback data={data} color={color} label={label} />;
  }

  return (
    <View className="my-4">
      {label && <Text className="text-slate-500 text-[10px] font-mono mb-2 uppercase tracking-widest pl-4">{label}</Text>}
      
      <View 
        style={{ width: CHART_WIDTH, height, alignSelf: 'center' }}
        className="bg-slate-950 rounded-2xl overflow-hidden border border-slate-800/50 shelf-shadow-lg"
      >
        <Canvas style={{ flex: 1 }}>
          {/* Grid */}
          <Group color="rgba(34, 211, 238, 0.05)" strokeWidth={1} style="stroke">
            {gridLines.map((p, i) => (
              <Path key={`grid-${i}`} path={p} />
            ))}
          </Group>

          {/* Glow Layer 1 - Wide Blur */}
          <Path
            path={path}
            color={color}
            style="stroke"
            strokeWidth={4}
            opacity={0.2}
          >
            <BlurMask blur={8} style="normal" />
          </Path>

          {/* Glow Layer 2 - Tight Blur */}
          <Path
            path={path}
            color={color}
            style="stroke"
            strokeWidth={2}
            opacity={0.5}
          >
            <BlurMask blur={3} style="normal" />
          </Path>

          {/* Main Signal Line */}
          <Path
            path={path}
            color={color}
            style="stroke"
            strokeWidth={2}
          />
          
          {/* Subtle Gradient Fill */}
          <Group>
             <Path path={path} opacity={0.05}>
                <LinearGradient
                  start={vec(0, padding)}
                  end={vec(0, height - padding)}
                  colors={[color, 'transparent']}
                />
             </Path>
          </Group>
        </Canvas>
      </View>
    </View>
  );
}
