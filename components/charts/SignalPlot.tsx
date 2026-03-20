import React, { useMemo } from 'react';
import { View, Dimensions } from 'react-native';
import { CartesianChart, Line } from 'victory-native';
import { useFont } from '@shopify/react-native-skia';

// Victory Native XL (v41+) uses Skia for rendering.

interface SignalPlotProps {
  data: Float32Array;
  color?: string;
  height?: number;
}

export const SignalPlot: React.FC<SignalPlotProps> = ({ 
  data, 
  color = "#2dd4bf", 
  height = 250 
}) => {
  // Convert Float32Array to format expected by Victory Native
  // We usually downsample for large signals to maintain performance
  const chartData = useMemo(() => {
    const skip = Math.max(1, Math.floor(data.length / 500)); // Show ~500 points max
    const result = [];
    for (let i = 0; i < data.length; i += skip) {
      result.push({ x: i, y: data[i] });
    }
    return result;
  }, [data]);

  // If no font is provided, Victory uses a default or none.
  // We can load a font here if needed, but for now we'll use defaults.

  return (
    <View style={{ height, width: '100%' }} className="bg-slate-900 rounded-lg overflow-hidden my-2">
      <CartesianChart
        data={chartData}
        xKey="x"
        yKeys={["y"]}
        padding={5}
        domain={{ y: [-1.1, 1.1] }} // Signals are normalized to [-1, 1]
      >
        {({ points }) => (
          <Line
            points={points.y}
            color={color}
            strokeWidth={2}
            animate={{ type: "timing", duration: 300 }}
          />
        )}
      </CartesianChart>
    </View>
  );
};
