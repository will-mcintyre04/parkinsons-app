import { DeviceMotion } from 'expo-sensors';
import { useEffect, useRef, useState } from 'react';

const SAMPLE_RATE = 200;
const SAMPLE_INTERVAL = 1000 / SAMPLE_RATE;
const WINDOW_SIZE = 512;
const NOISE_THRESHOLD = 0.1;

export function useTremorTracking() {
  const [isMeasuring, setIsMeasuring] = useState(false);
  const bufferRef = useRef<number[]>([]);
  const subscriptionRef = useRef<any>(null);

  useEffect(() => {
    return () => subscriptionRef.current?.remove();
  }, []);

  const computeSTD = (samples: number[]) => {
    const mean = samples.reduce((a, b) => a + b, 0) / samples.length;
    return Math.sqrt(samples.reduce((sum, val) => sum + (val - mean) ** 2, 0) / samples.length);
  };

  const computeFFTExtended = (samples: number[], sampleRate: number) => {
    const N = samples.length;
    const mean = samples.reduce((a, b) => a + b, 0) / N;
    const zeroMean = samples.map(v => v - mean);
    const fft: { x: number; y: number }[] = [];

    for (let k = 0; k < N / 2; k++) {
        let real = 0, imag = 0;
        for (let n = 0; n < N; n++) {
        const angle = (2 * Math.PI * k * n) / N;
        real += zeroMean[n] * Math.cos(angle);
        imag -= zeroMean[n] * Math.sin(angle);
        }
        const mag = Math.sqrt(real ** 2 + imag ** 2) / N;
        const freq = (k * sampleRate) / N;
        fft.push({ x: freq, y: mag });
    }

    const dominant = fft.filter(p => p.x > 1 && p.x < 30)
                        .reduce((max, p) => p.y > max.y ? p : max, { x: 0, y: 0 });

    const corrected = dominant.y >= NOISE_THRESHOLD ? dominant.x / 2 : null;
    return { dominantFreq: corrected, fft };
    };


  const start = (): Promise<{
    intensity: number | null;
    dominantFreq: number | null;
    graphData: { x: number; y: number }[];
    fftData: { x: number; y: number }[];
    }> => {
    return new Promise((resolve) => {
        const buffer: number[] = [];
        const graphData: { x: number; y: number }[] = [];
        let counter = 0;

        setIsMeasuring(true);
        DeviceMotion.setUpdateInterval(SAMPLE_INTERVAL);
        subscriptionRef.current = DeviceMotion.addListener(({ acceleration }) => {
        const { x = 0, y = 0, z = 0 } = acceleration ?? {};
        const mag = Math.sqrt(x ** 2 + y ** 2 + z ** 2);
        buffer.push(mag);
        graphData.push({ x: counter++, y: mag });

        if (buffer.length >= WINDOW_SIZE) {
            subscriptionRef.current?.remove();
            const windowed = buffer.slice(-WINDOW_SIZE);
            const std = computeSTD(windowed);
            console.log(std)
            
            const minStd = 0;     // best possible
            const maxStd = 5;     // worst acceptable (adjust based on data)

            const clamped = Math.min(Math.max(std, minStd), maxStd);
            const normalized = (clamped - minStd) / (maxStd - minStd);
            console.log(normalized)

            const intensity = Math.round(normalized * 100);

            const { dominantFreq, fft } = computeFFTExtended(windowed, SAMPLE_RATE);
            setIsMeasuring(false);
            resolve({ intensity, dominantFreq, graphData, fftData: fft });
        }
        });
    });
    };


  return { start, isMeasuring };
}
