import { useMemo } from 'react';
import { computeFFT, computeRMS, computePeak, computeMean } from '@/utils/dsp';

/**
 * Hook to compute spectral analysis and signal statistics.
 */
export function useFFT(signal: Float32Array, sampleRate: number) {
  return useMemo(() => {
    const { frequencies, magnitudes } = computeFFT(signal, sampleRate);
    const rms = computeRMS(signal);
    const peak = computePeak(signal);
    const mean = computeMean(signal);

    return {
      frequencies,
      magnitudes,
      rms,
      peak,
      mean,
    };
  }, [signal, sampleRate]);
}
