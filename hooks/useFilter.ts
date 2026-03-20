import { useState, useMemo } from 'react';
import { applyFIR, designLowPass } from '../utils/dsp';

export function useFilter(signal: Float32Array) {
  const [cutoff, setCutoff] = useState(1000);
  const [order, setOrder] = useState(64);
  const [sampleRate, setSampleRate] = useState(44100);

  const kernel = useMemo(() => {
    return designLowPass(cutoff, sampleRate, order);
  }, [cutoff, sampleRate, order]);

  const filteredSignal = useMemo(() => {
    return applyFIR(signal, kernel);
  }, [signal, kernel]);

  return {
    filteredSignal,
    cutoff,
    setCutoff,
    order,
    setOrder,
    kernel,
  };
}
