# DSP Lab Mobile

A premium mobile application for learning Digital Signal Processing (DSP) through interactive visualizations and real-time computation. Built with **React Native**, **Expo SDK 55**, and **NativeWind v4**.

## ✨ Features

### 1. Signal Generator
- **Waveforms**: Sine, Square, Sawtooth.
- **Controls**: Frequency (20Hz - 2kHz), Amplitude (0.0 - 1.0), and Sample Rate selection.
- **Visuals**: Real-time signal plot.

### 2. Digital Filtering
- **FIR Filters**: Apply Low-Pass filters using custom Sinc-windowed design.
- **Real-time**: See the effect of cutoff frequency and filter order on the waveform.

### 3. Signal Analysis
- **Time Domain**: High-fidelity waveform view.
- **Frequency Domain**: Fast Fourier Transform (FFT) spectrum analysis.
- **Stats**: Live signal metrics (RMS, Peak).

### 4. Signal Mixer
- **Combine**: Add multiple signals together with independent gain controls.
- **Clipping Detection**: Visualizing how summing signals affects the output.

### 5. Aliasing Demo
- **Nyquist-Shannon**: Visualize what happens when a signal exceeds half the sample rate.
- **Folding**: See the "ghost" frequency that appears due to aliasing.

### 6. Linear Convolution
- **System Response**: convolve an input pulse with a moving average kernel.
- **Step-by-Step**: Understand how convolution "smooths" or transforms a signal.

### 7. Signal Library
- **Persistence**: Save your favorite configurations to local storage using `AsyncStorage`.
- **Recall**: Reload any saved signal into any screen (Coming Soon).

---

## 🛠️ Tech Stack

- **Framework**: [Expo](https://expo.dev/) (SDK 55+) with [Expo Router](https://docs.expo.dev/router/introduction/).
- **Styles**: [NativeWind v4](https://www.nativewind.dev/) (Tailwind CSS for React Native).
- **Charts**: [react-native-gifted-charts](https://github.com/Abhinandan-Kushwaha/react-native-gifted-charts) (Stable, Skia-free line charts).
- **DSP Core**: Custom math implementation in `utils/dsp.ts` using `fft.js` for spectral analysis.
- **Storage**: `@react-native-async-storage/async-storage`.

---

## 📐 DSP Implementation Details

All signal processing logic is kept in a pure functional utility file: `utils/dsp.ts`.

- **Signal Generation**: Uses standard trigonometric and periodic functions.
- **FFT**: Implemented using the `fft.js` library, optimized for power-of-two buffer sizes.
- **FIR Filtering**: Uses a standard overlap-save convolution approach with a Hamming-windowed sinc kernel.
- **Convolution**: Implemented via the direct linear convolution formula (Sliding sum).

---

## 🚀 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start the Development Server**:
   ```bash
   npx expo start --clear
   ```

3. **Open the App**:
   - Install the **Expo Go** app on your phone.
   - Scan the QR code from the terminal.
   - Or press `w` to open in your web browser.

---

## 🔒 Coding Principles

- **Performance**: Heavy DSP calculations are memoized using `useMemo` and downsampled to ~80-100 points for chart rendering.
- **Type Safety**: Strictly typed with TypeScript.
- **Dark Mode**: Default high-contrast dark theme for better readability of signal plots.

---

Designed with ❤️ for DSP students and enthusiasts.
