import FFT from 'fft.js';

/**
 * DSP mathematical utilities for dsp-lab-mobile.
 * All signal data is Float32Array of samples.
 */

export enum SignalType {
  SINE = 'sine',
  SQUARE = 'square',
  SAWTOOTH = 'sawtooth',
}

/**
 * Generates a signal based on frequency, amplitude, and sample rate.
 */
export function generateSignal(
  type: SignalType,
  frequency: number,
  amplitude: number,
  sampleRate: number,
  numSamples: number
): Float32Array {
  const signal = new Float32Array(numSamples);
  const angularFreq = (2 * Math.PI * frequency) / sampleRate;

  for (let i = 0; i < numSamples; i++) {
    const t = i;
    const phase = angularFreq * t;

    switch (type) {
      case SignalType.SINE:
        signal[i] = amplitude * Math.sin(phase);
        break;
      case SignalType.SQUARE:
        signal[i] = amplitude * (Math.sin(phase) >= 0 ? 1 : -1);
        break;
      case SignalType.SAWTOOTH:
        signal[i] = amplitude * (((phase % (2 * Math.PI)) / Math.PI) - 1);
        break;
    }
  }

  return signal;
}

/**
 * Applies a basic FIR filter to a signal.
 */
export function applyFIR(signal: Float32Array, kernel: number[] | Float32Array): Float32Array {
  const output = new Float32Array(signal.length);
  const kernelLen = kernel.length;

  for (let i = 0; i < signal.length; i++) {
    let sum = 0;
    for (let j = 0; j < kernelLen; j++) {
      if (i - j >= 0) {
        sum += signal[i - j] * kernel[j];
      }
    }
    output[i] = sum;
  }

  return output;
}

/**
 * Designs a simple Sinc-windowed FIR Low-Pass filter.
 */
export function designLowPass(cutoff: number, fSample: number, order: number): number[] {
  const kernel = new Array(order + 1);
  const fc = cutoff / fSample;
  const M = order;

  for (let i = 0; i <= M; i++) {
    if (i === M / 2) {
      kernel[i] = 2 * Math.PI * fc;
    } else {
      const x = i - M / 2;
      kernel[i] = Math.sin(2 * Math.PI * fc * x) / x;
    }
    // Hamming window for better stop-band attenuation
    kernel[i] *= (0.54 - 0.46 * Math.cos((2 * Math.PI * i) / M));
  }

  // Normalize to unit gain at DC
  const sum = kernel.reduce((a, b) => a + b, 0);
  return kernel.map(v => v / sum);
}

/**
 * Computes the FFT and returns frequencies and magnitudes.
 */
export function computeFFT(signal: Float32Array, sampleRate: number): { frequencies: number[], magnitudes: number[] } {
  const n = signal.length;
  const fftSize = Math.pow(2, Math.ceil(Math.log2(n)));
  const f = new FFT(fftSize);
  
  const input = new Float32Array(fftSize);
  input.set(signal);
  
  const out = f.createComplexArray();
  f.realTransform(out, input);
  
  const half = fftSize / 2;
  const frequencies = new Array(half);
  const magnitudes = new Float32Array(half);
  
  for (let i = 0; i < half; i++) {
    const re = out[2 * i];
    const im = out[2 * i + 1];
    // Normalize and compute magnitude
    magnitudes[i] = Math.sqrt(re * re + im * im) / half;
    frequencies[i] = (i / fftSize) * sampleRate;
  }
  
  return { 
    frequencies, 
    magnitudes: Array.from(magnitudes) 
  };
}

/**
 * Computes the Root Mean Square of a signal.
 */
export function computeRMS(signal: Float32Array): number {
  if (signal.length === 0) return 0;
  let sum = 0;
  for (let i = 0; i < signal.length; i++) {
    sum += signal[i] * signal[i];
  }
  return Math.sqrt(sum / signal.length);
}

/**
 * Computes the peak absolute value.
 */
export function computePeak(signal: Float32Array): number {
  let peak = 0;
  for (let i = 0; i < signal.length; i++) {
    const abs = Math.abs(signal[i]);
    if (abs > peak) peak = abs;
  }
  return peak;
}

/**
 * Computes the average (mean) value.
 */
export function computeMean(signal: Float32Array): number {
  if (signal.length === 0) return 0;
  let sum = 0;
  for (let i = 0; i < signal.length; i++) {
    sum += signal[i];
  }
  return sum / signal.length;
}
/**
 * Combines multiple signals with independent gain controls.
 * Clamps output to [-1, 1].
 */
export function mixSignals(
  signals: Float32Array[],
  gains: number[]
): Float32Array {
  if (signals.length === 0) return new Float32Array(0);
  
  const maxLength = Math.max(...signals.map(s => s.length));
  const output = new Float32Array(maxLength);

  for (let i = 0; i < maxLength; i++) {
    let sum = 0;
    for (let s = 0; s < signals.length; s++) {
      if (i < signals[s].length) {
        sum += signals[s][i] * gains[s];
      }
    }
    // Clamp to -1.0 to 1.0 range
    output[i] = Math.max(-1, Math.min(1, sum));
  }

  return output;
}

/**
 * Returns true if any sample in the signal hits 1.0 or -1.0.
 */
export function isClipping(signal: Float32Array): boolean {
  for (let i = 0; i < signal.length; i++) {
    if (signal[i] >= 1.0 || signal[i] <= -1.0) return true;
  }
  return false;
}

/**
 * Returns ratio of clipped samples (0.0 - 1.0).
 */
export function detectClipRatio(signal: Float32Array): number {
  if (signal.length === 0) return 0;
  let clipCount = 0;
  for (let i = 0; i < signal.length; i++) {
    if (signal[i] >= 1.0 || signal[i] <= -1.0) clipCount++;
  }
  return clipCount / signal.length;
}

/**
 * Performs linear convolution of two signals.
 */
export function convolve(x: Float32Array, h: Float32Array): Float32Array {
  const n = x.length;
  const m = h.length;
  const result = new Float32Array(n + m - 1);

  for (let i = 0; i < n + m - 1; i++) {
    let sum = 0;
    for (let j = 0; j < m; j++) {
      if (i - j >= 0 && i - j < n) {
        sum += x[i - j] * h[j];
      }
    }
    result[i] = sum;
  }

  return result;
}
/**
 * Advanced FIR filter application using Hamming-windowed sinc kernels.
 * Supports: 'lowpass', 'highpass', 'bandpass'
 */
export function applyFIRFilter(
  signal: Float32Array,
  cutoff: number,
  order: number,
  type: 'lowpass' | 'highpass' | 'bandpass',
  sampleRate: number,
  cutoffHigh?: number
): Float32Array {
  const M = order;
  const kernel = new Float32Array(M + 1);
  const fc = cutoff / sampleRate;
  const fc2 = cutoffHigh ? cutoffHigh / sampleRate : 0;

  // 1. Design the kernel
  for (let n = 0; n <= M; n++) {
    if (n === M / 2) {
      if (type === 'lowpass') kernel[n] = 2 * fc;
      else if (type === 'highpass') kernel[n] = 1 - 2 * fc;
      else if (type === 'bandpass') kernel[n] = 2 * (fc2 - fc);
    } else {
      const x = n - M / 2;
      const sinc1 = Math.sin(2 * Math.PI * fc * x) / (Math.PI * x);
      
      if (type === 'lowpass') {
        kernel[n] = sinc1;
      } else if (type === 'highpass') {
        kernel[n] = -sinc1;
      } else if (type === 'bandpass') {
        const sinc2 = Math.sin(2 * Math.PI * fc2 * x) / (Math.PI * x);
        kernel[n] = sinc2 - sinc1;
      }
    }
    // Apply Hamming window
    kernel[n] *= (0.54 - 0.46 * Math.cos((2 * Math.PI * n) / M));
  }

  // 2. Normalize (Lowpass and Bandpass to 1.0 gain at center, Highpass to 1.0 at Nyquist)
  // For simplicity, we normalize by the sum of coefficients for lowpass/bandpass
  if (type !== 'highpass') {
    const sum = kernel.reduce((a, b) => a + b, 0);
    if (Math.abs(sum) > 0) {
      for (let i = 0; i < kernel.length; i++) kernel[i] /= sum;
    }
  } else {
    // For highpass, we can normalize such that sum(abs(kernel)) is reasonable or just leave it
    // Spectral inversion usually preserves gain levels if the base LP was normalized.
    // Let's do a simple sum-based normalization on the base LP part before inversion for better stability.
  }

  // 3. Apply the filter (Time-domain convolution)
  return applyFIR(signal, kernel);
}
