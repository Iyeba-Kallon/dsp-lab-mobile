import { useMemo } from 'react';
import { computeFFT } from '../utils/dsp';

export function useFFT(signal: Float32Array) {
  const magnitude = useMemo(() => {
    return computeFFT(signal);
  }, [signal]);

  return {
    magnitude,
  };
}
