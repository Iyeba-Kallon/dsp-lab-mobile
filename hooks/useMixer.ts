import { useMemo } from 'react';
import { generateSignal, SignalType, mixSignals, isClipping, detectClipRatio } from '@/utils/dsp';

export interface SlotConfig {
  type: SignalType;
  frequency: number;
  gain: number;
  enabled: boolean;
}

interface UseMixerProps {
  slots: SlotConfig[];
  sampleRate: number;
  numSamples: number;
}

/**
 * Hook to manage multi-signal mixing state and clipping analysis.
 */
export function useMixer({ slots, sampleRate, numSamples }: UseMixerProps) {
  return useMemo(() => {
    // 1. Generate individual signals
    const individualSignals = slots.map(slot => 
      generateSignal(slot.type, slot.frequency, 1.0, sampleRate, numSamples)
    );

    // 2. Filter for enabled slots
    const enabledSignals: Float32Array[] = [];
    const enabledGains: number[] = [];
    
    slots.forEach((slot, index) => {
      if (slot.enabled) {
        enabledSignals.push(individualSignals[index]);
        enabledGains.push(slot.gain);
      }
    });

    // 3. Mix signals
    const mixedSignal = mixSignals(enabledSignals, enabledGains);

    // 4. Clipping analysis
    const clipping = isClipping(mixedSignal);
    const clipRatio = detectClipRatio(mixedSignal);

    return {
      individualSignals,
      mixedSignal,
      clipping,
      clipRatio,
    };
  }, [slots, sampleRate, numSamples]);
}
