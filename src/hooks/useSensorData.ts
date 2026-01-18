import { useState, useEffect, useCallback, useRef } from 'react';
import { SensorReading } from '@/types/sensor';
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

export function useSensorData() {
  const [isRecording, setIsRecording] = useState(false);
  const [currentReading, setCurrentReading] = useState<SensorReading | null>(null);
  const [readings, setReadings] = useState<SensorReading[]>([]);
  const [peakHeel, setPeakHeel] = useState(0);
  const [peakForefoot, setPeakForefoot] = useState(0);
  const [copHistory, setCopHistory] = useState<COPData[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = useCallback(() => {
    startSession();
    setIsRecording(true);
    setReadings([]);
    setPeakHeel(0);
    setPeakForefoot(0);
    setCopHistory([]);
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
  };
}
