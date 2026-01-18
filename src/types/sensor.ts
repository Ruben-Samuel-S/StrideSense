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
  cop: number; // Center of Pressure in mm (0 = heel, FOOT_LENGTH_MM = toe)
}

export interface SessionData {
  id: string;
  startTime: number;
  endTime?: number;
  readings: SensorReading[];
}

// Foot length constant for COP calculations
export const FOOT_LENGTH_MM = 280;

// Pressure thresholds for visualization
export const PRESSURE_THRESHOLDS = {
  NORMAL: { min: 0, max: 200, color: 'chart-1', label: 'Normal' },
  MODERATE: { min: 200, max: 400, color: 'chart-4', label: 'Moderate' },
  HIGH: { min: 400, max: Infinity, color: 'destructive', label: 'High' },
} as const;

// Asymmetry index thresholds
export const ASYMMETRY_THRESHOLDS = {
  NORMAL: { max: 20, label: 'Normal balance' },
  MODERATE: { max: 40, label: 'Moderate imbalance' },
  SEVERE: { max: 100, label: 'Severe imbalance' },
} as const;

// Peak pressure thresholds (for ulcer risk)
export const PEAK_PRESSURE_THRESHOLDS = {
  SAFE: { max: 300, label: 'Safe' },
  CAUTION: { max: 450, label: 'Caution' },
  HIGH_RISK: { max: Infinity, label: 'Ulcer Risk' },
} as const;

export function getPressureLevel(kPa: number): 'normal' | 'moderate' | 'high' {
  if (kPa <= 200) return 'normal';
  if (kPa <= 400) return 'moderate';
  return 'high';
}

export function getAsymmetryLevel(index: number): 'normal' | 'moderate' | 'severe' {
  if (index < 20) return 'normal';
  if (index < 40) return 'moderate';
  return 'severe';
}

export function getPeakPressureRisk(kPa: number): 'safe' | 'caution' | 'high-risk' {
  if (kPa < 300) return 'safe';
  if (kPa < 450) return 'caution';
  return 'high-risk';
}

export function calculateAsymmetryIndex(heel: number, forefoot: number): number {
  const sum = heel + forefoot;
  if (sum === 0) return 0;
  return (Math.abs(heel - forefoot) / sum) * 100;
}

export function calculateCOP(heel: number, forefoot: number): number {
  const sum = heel + forefoot;
  if (sum === 0) return FOOT_LENGTH_MM / 2;
  return (forefoot * FOOT_LENGTH_MM) / sum;
}
