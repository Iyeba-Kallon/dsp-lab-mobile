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
 * Computes the FFT of a signal and returns the magnitude spectrum.
 */
export function computeFFT(signal: Float32Array): Float32Array {
  const n = signal.length;
  // fft.js requires power of 2
  const fftSize = Math.pow(2, Math.ceil(Math.log2(n)));
  const f = new FFT(fftSize);
  
  const input = new Float32Array(fftSize);
  input.set(signal.slice(0, fftSize));
  
  const out = f.createComplexArray();
  f.realTransform(out, input);
  
  // Compute magnitude for the first half (Nyquist)
  const magnitude = new Float32Array(fftSize / 2);
  for (let i = 0; i < fftSize / 2; i++) {
    const re = out[2 * i];
    const im = out[2 * i + 1];
    magnitude[i] = Math.sqrt(re * re + im * im) / (fftSize / 2);
  }
  
  return magnitude;
}

/**
 * Combines multiple signals with per-signal gain.
 */
export function mixSignals(
  signals: { data: Float32Array; gain: number }[]
): Float32Array {
  if (signals.length === 0) return new Float32Array(0);
  
  const maxLength = Math.max(...signals.map(s => s.data.length));
  const output = new Float32Array(maxLength);

  for (let i = 0; i < maxLength; i++) {
    let sum = 0;
    for (const signal of signals) {
      if (i < signal.data.length) {
        sum += signal.data[i] * signal.gain;
      }
    }
    output[i] = sum;
  }

  return output;
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
