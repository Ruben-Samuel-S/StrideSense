/**
 * Sensor Data Service - StrideSense Prosthetics
 * 
 * This module fetches sensor data from the ESP32 Data Ingestion API.
 * The ESP32 will POST data to the edge function, and the frontend fetches via GET.
 */

import { SensorReading, GaitPhase } from '@/types/sensor';
import { supabase } from '@/integrations/supabase/client';

// API response type
interface SensorAPIResponse {
  id: number;
  heel_pressure: number;
  toe_pressure: number;
  asymmetry_index: number;
  cop: number;
  gait_phase: string;
  pitch: number;
  roll: number;
  peak_heel_pressure: number;
  peak_toe_pressure: number;
  timestamp: string;
  updated_at: string;
}

/**
 * Fetch the latest sensor reading from the ESP32 Data Ingestion API
 */
export async function fetchLatestReading(): Promise<SensorReading | null> {
  try {
    const { data, error } = await supabase.functions.invoke<SensorAPIResponse>('sensor-data', {
      method: 'GET',
    });

    if (error || !data) {
      console.error('Error fetching sensor data:', error);
      return null;
    }

    // Convert API response to SensorReading format
    return {
      timestamp: new Date(data.timestamp).getTime(),
      pressure: {
        heel: data.heel_pressure,
        forefoot: data.toe_pressure,
      },
      orientation: {
        pitch: data.pitch ?? 0,
        roll: data.roll ?? 0,
      },
      gaitPhase: data.gait_phase as GaitPhase,
      cop: data.cop,
    };
  } catch (err) {
    console.error('Failed to fetch sensor data:', err);
    return null;
  }
}

/**
 * Get peak pressures from the latest API data
 */
export async function fetchPeakPressures(): Promise<{ peakHeel: number; peakForefoot: number } | null> {
  try {
    const { data, error } = await supabase.functions.invoke<SensorAPIResponse>('sensor-data', {
      method: 'GET',
    });

    if (error || !data) {
      return null;
    }

    return {
      peakHeel: data.peak_heel_pressure,
      peakForefoot: data.peak_toe_pressure,
    };
  } catch {
    return null;
  }
}

// Session management (for recording history locally during active session)
let currentSession: { id: string; readings: SensorReading[]; startTime: number } | null = null;

export function startSession(): string {
  const sessionId = 'session_' + Date.now();
  currentSession = {
    id: sessionId,
    readings: [],
    startTime: Date.now(),
  };
  return sessionId;
}

export function recordReading(reading: SensorReading): void {
  if (currentSession) {
    currentSession.readings.push(reading);
  }
}

export function getSessionData() {
  return currentSession;
}

export function endSession() {
  const session = currentSession;
  currentSession = null;
  return session;
}
