import React, { useMemo } from 'react';
import { View } from 'react-native';
import { CartesianChart, Bar, Line } from 'victory-native';

interface SpectrumPlotProps {
  magnitude: Float32Array;
  sampleRate: number;
}

export const SpectrumPlot: React.FC<SpectrumPlotProps> = ({ magnitude, sampleRate }) => {
  const chartData = useMemo(() => {
    const data = [];
    const maxFreq = sampleRate / 2;
    const skip = Math.max(1, Math.floor(magnitude.length / 300));
    
    for (let i = 0; i < magnitude.length; i += skip) {
      data.push({
        freq: (i / magnitude.length) * maxFreq,
        mag: magnitude[i],
      });
    }
    return data;
  }, [magnitude, sampleRate]);

  return (
    <View style={{ height: 250, width: '100%' }} className="bg-slate-900 rounded-lg overflow-hidden my-2">
      <CartesianChart
        data={chartData}
        xKey="freq"
        yKeys={["mag"]}
        padding={5}
      >
        {({ points }) => (
          <Line
            points={points.mag}
            color="#fbbf24"
            strokeWidth={2}
          />
        )}
      </CartesianChart>
    </View>
  );
};
