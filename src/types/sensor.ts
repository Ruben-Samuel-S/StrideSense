// Sensor data types for StrideSense Prosthetics
// These types are designed for future ESP32 WiFi integration

export interface PressureData {
  heel: number;      // kPa
  forefoot: number;  // kPa
}

export interface OrientationData {
  pitch: number;     // degrees
  roll: number;      // degrees
}

export type GaitPhase = 'stance' | 'swing';

export interface SensorReading {
  timestamp: number;
  pressure: PressureData;
  orientation: OrientationData;
  gaitPhase: GaitPhase;
}

export interface SessionData {
  id: string;
  startTime: number;
  endTime?: number;
  readings: SensorReading[];
}

// Pressure thresholds for visualization
export const PRESSURE_THRESHOLDS = {
  NORMAL: { min: 0, max: 200, color: 'chart-1', label: 'Normal' },
  MODERATE: { min: 200, max: 400, color: 'chart-4', label: 'Moderate' },
  HIGH: { min: 400, max: Infinity, color: 'destructive', label: 'High' },
} as const;

export function getPressureLevel(kPa: number): 'normal' | 'moderate' | 'high' {
  if (kPa <= 200) return 'normal';
  if (kPa <= 400) return 'moderate';
  return 'high';
}
