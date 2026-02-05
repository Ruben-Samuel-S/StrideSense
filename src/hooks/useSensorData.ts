import { useState, useEffect, useCallback, useRef } from 'react';
import { SensorReading, OrientationData } from '@/types/sensor';
import { 
  fetchLatestReading,
  startSession, 
  recordReading, 
  getSessionData,
  endSession 
} from '@/services/sensorDataService';

const UPDATE_INTERVAL = 500; // ms - fetch every 500ms
const MAX_READINGS_DISPLAY = 60; // Keep last 60 readings for charts (30 seconds)

export interface COPData {
  position: number;
  timestamp: number;
}

export interface OrientationHistoryData {
  pitch: number;
  roll: number;
  timestamp: number;
}

export interface GaitStabilityMetrics {
  pitchVariation: number;
  rollVariation: number;
  stabilityLevel: 'stable' | 'mild' | 'high' | 'unknown';
}

/**
 * Calculate standard deviation of an array of numbers
 */
function calculateStdDev(values: number[]): number {
  if (values.length < 2) return 0;
  
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const squaredDiffs = values.map(v => (v - mean) ** 2);
  const variance = squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
  
  return Math.sqrt(variance);
}

/**
 * Calculate gait stability metrics from orientation history
 */
function calculateGaitStability(history: OrientationHistoryData[]): GaitStabilityMetrics {
  if (history.length < 5) {
    return { pitchVariation: 0, rollVariation: 0, stabilityLevel: 'unknown' };
  }
  
  const pitchValues = history.map(h => h.pitch);
  const rollValues = history.map(h => h.roll);
  
  const pitchVariation = calculateStdDev(pitchValues);
  const rollVariation = calculateStdDev(rollValues);
  
  // Combined stability index (root mean square of variations)
  const stabilityIndex = Math.sqrt(pitchVariation ** 2 + rollVariation ** 2);
  
  let stabilityLevel: 'stable' | 'mild' | 'high' | 'unknown';
  if (stabilityIndex < 5) {
    stabilityLevel = 'stable';
  } else if (stabilityIndex < 15) {
    stabilityLevel = 'mild';
  } else {
    stabilityLevel = 'high';
  }
  
  return { pitchVariation, rollVariation, stabilityLevel };
}

export function useSensorData() {
  const [isRecording, setIsRecording] = useState(false);
  const [currentReading, setCurrentReading] = useState<SensorReading | null>(null);
  const [readings, setReadings] = useState<SensorReading[]>([]);
  const [peakHeel, setPeakHeel] = useState(0);
  const [peakForefoot, setPeakForefoot] = useState(0);
  const [copHistory, setCopHistory] = useState<COPData[]>([]);
  const [orientationHistory, setOrientationHistory] = useState<OrientationHistoryData[]>([]);
  const [gaitStability, setGaitStability] = useState<GaitStabilityMetrics>({
    pitchVariation: 0,
    rollVariation: 0,
    stabilityLevel: 'unknown',
  });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = useCallback(() => {
    startSession();
    setIsRecording(true);
    setReadings([]);
    setPeakHeel(0);
    setPeakForefoot(0);
    setCopHistory([]);
    setOrientationHistory([]);
    setGaitStability({ pitchVariation: 0, rollVariation: 0, stabilityLevel: 'unknown' });
  }, []);

  const stopRecording = useCallback(() => {
    setIsRecording(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return endSession();
  }, []);

  const getAllReadings = useCallback(() => {
    const session = getSessionData();
    return session?.readings || [];
  }, []);

  useEffect(() => {
    if (isRecording) {
      intervalRef.current = setInterval(async () => {
        const reading = await fetchLatestReading();
        
        if (reading) {
          recordReading(reading);
          setCurrentReading(reading);
          
          // Update peak pressures
          setPeakHeel(prev => Math.max(prev, reading.pressure.heel));
          setPeakForefoot(prev => Math.max(prev, reading.pressure.forefoot));
          
          // Update COP history
          setCopHistory(prev => {
            const updated = [...prev, { position: reading.cop, timestamp: reading.timestamp }];
            return updated.slice(-MAX_READINGS_DISPLAY);
          });
          
          // Update orientation history and recalculate gait stability
          setOrientationHistory(prev => {
            const updated = [...prev, { 
              pitch: reading.orientation.pitch, 
              roll: reading.orientation.roll, 
              timestamp: reading.timestamp 
            }];
            const sliced = updated.slice(-MAX_READINGS_DISPLAY);
            
            // Recalculate gait stability
            const stability = calculateGaitStability(sliced);
            setGaitStability(stability);
            
            return sliced;
          });
          
          setReadings(prev => {
            const updated = [...prev, reading];
            return updated.slice(-MAX_READINGS_DISPLAY);
          });
        }
      }, UPDATE_INTERVAL);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRecording]);

  return {
    isRecording,
    currentReading,
    readings,
    startRecording,
    stopRecording,
    getAllReadings,
    peakHeel,
    peakForefoot,
    copHistory,
    orientationHistory,
    gaitStability,
  };
}
