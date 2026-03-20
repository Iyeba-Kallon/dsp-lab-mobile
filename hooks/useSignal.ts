import { useState, useMemo, useCallback } from 'react';
import { generateSignal, SignalType } from '../utils/dsp';

export interface SignalConfig {
  type: SignalType;
  frequency: number;
  amplitude: number;
  sampleRate: number;
  numSamples: number;
}

export function useSignal(initialConfig: SignalConfig) {
  const [config, setConfig] = useState<SignalConfig>(initialConfig);

  // Memoize the signal generation to avoid heavy computation on every render
  const signal = useMemo(() => {
    return generateSignal(
      config.type,
      config.frequency,
      config.amplitude,
      config.sampleRate,
      config.numSamples
    );
  }, [config]);

  const updateConfig = useCallback((newConfig: Partial<SignalConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  }, []);

  return {
    signal,
    config,
    updateConfig,
  };
}
