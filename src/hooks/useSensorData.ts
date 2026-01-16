import { useState, useEffect, useCallback, useRef } from 'react';
import { SensorReading } from '@/types/sensor';
import { 
  generateDummyReading, 
  startSession, 
  recordReading, 
  getSessionData,
  endSession 
} from '@/services/sensorDataService';

const UPDATE_INTERVAL = 500; // ms - updates every 500ms
const MAX_READINGS_DISPLAY = 60; // Keep last 60 readings for charts (30 seconds)

export function useSensorData() {
  const [isRecording, setIsRecording] = useState(false);
  const [currentReading, setCurrentReading] = useState<SensorReading | null>(null);
  const [readings, setReadings] = useState<SensorReading[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = useCallback(() => {
    startSession();
    setIsRecording(true);
    setReadings([]);
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
      intervalRef.current = setInterval(() => {
        const reading = generateDummyReading();
        recordReading(reading);
        setCurrentReading(reading);
        setReadings(prev => {
          const updated = [...prev, reading];
          // Keep only the last MAX_READINGS_DISPLAY readings for chart display
          return updated.slice(-MAX_READINGS_DISPLAY);
        });
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
  };
}
