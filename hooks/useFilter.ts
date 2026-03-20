import { useMemo } from 'react';
import { applyFIRFilter } from '@/utils/dsp';

export type FilterType = 'lowpass' | 'highpass' | 'bandpass';

interface UseFilterProps {
  signal: Float32Array;
  filterType: FilterType;
  cutoff: number;
  order: number;
  sampleRate: number;
  cutoffHigh?: number;
}

/**
 * Hook to apply an FIR filter to a signal and manage its state.
 */
export function useFilter({
  signal,
  filterType,
  cutoff,
  order,
  sampleRate,
  cutoffHigh,
}: UseFilterProps) {
  const filteredSignal = useMemo(() => {
    return applyFIRFilter(
      signal,
      cutoff,
      order,
      filterType,
      sampleRate,
      cutoffHigh
    );
  }, [signal, filterType, cutoff, order, sampleRate, cutoffHigh]);

  return { filteredSignal };
}
