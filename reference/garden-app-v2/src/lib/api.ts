import { SensorData, IdentityResult, DiagnosisResult } from '../types';

export const api = {
  getSensorData: async (): Promise<SensorData> => {
    const res = await fetch('/api/sensor-data');
    if (!res.ok) throw new Error('Failed to fetch sensor data');
    return res.json();
  },

  identifyPlant: async (imageBase64: string): Promise<IdentityResult> => {
    const res = await fetch('/api/identify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: imageBase64 }),
    });
    if (!res.ok) throw new Error('Failed to identify plant');
    return res.json();
  },

  diagnosePlant: async (imageBase64: string): Promise<DiagnosisResult> => {
    const res = await fetch('/api/diagnose', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: imageBase64 }),
    });
    if (!res.ok) throw new Error('Failed to diagnose plant');
    return res.json();
  },

  getGrowthCareAdvice: async (plantName: string, stage: string, conditions: string): Promise<string[]> => {
    const res = await fetch('/api/care-advice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plantName, stage, conditions }),
    });
    if (!res.ok) throw new Error('Failed to fetch care advice');
    const data = await res.json();
    return data.advice;
  },
};
