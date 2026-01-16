/**
 * Sensor Data Service
 * 
 * This module handles sensor data fetching and generation.
 * Currently uses dummy data generation for MVP.
 * 
 * INTEGRATION POINT FOR ESP32:
 * When backend is ready, replace generateDummyReading() calls with:
 * - GET /api/sensor/latest → Real-time sensor data
 * - WebSocket connection for streaming data
 * 
 * The SensorReading interface is designed to match expected ESP32 output.
 */

import { SensorReading, PressureData, OrientationData, GaitPhase } from '@/types/sensor';

// Dummy data generation for MVP
// This simulates realistic prosthetic limb sensor readings

let gaitCycle = 0;
const GAIT_CYCLE_LENGTH = 20; // readings per full gait cycle

function generateDummyPressure(): PressureData {
  // Simulate realistic pressure patterns during gait cycle
  const cyclePhase = (gaitCycle % GAIT_CYCLE_LENGTH) / GAIT_CYCLE_LENGTH;
  
  // Heel strike at beginning of cycle
  const heelBase = cyclePhase < 0.3 ? 250 - (cyclePhase * 500) : 50;
  // Midfoot during mid-stance
  const midfootBase = cyclePhase > 0.2 && cyclePhase < 0.6 ? 180 : 40;
  // Forefoot during push-off
  const forefootBase = cyclePhase > 0.4 && cyclePhase < 0.8 ? 220 : 30;
  
  return {
    heel: Math.max(0, heelBase + (Math.random() - 0.5) * 60),
    midfoot: Math.max(0, midfootBase + (Math.random() - 0.5) * 40),
    forefoot: Math.max(0, forefootBase + (Math.random() - 0.5) * 50),
  };
}

function generateDummyOrientation(): OrientationData {
  const cyclePhase = (gaitCycle % GAIT_CYCLE_LENGTH) / GAIT_CYCLE_LENGTH;
  
  // Simulate foot orientation during gait
  const pitch = Math.sin(cyclePhase * Math.PI * 2) * 15 + (Math.random() - 0.5) * 3;
  const roll = Math.sin(cyclePhase * Math.PI * 2 + 0.5) * 5 + (Math.random() - 0.5) * 2;
  
  return { pitch, roll };
}

function generateDummyGaitPhase(): GaitPhase {
  const cyclePhase = (gaitCycle % GAIT_CYCLE_LENGTH) / GAIT_CYCLE_LENGTH;
  // Stance phase is roughly 60% of gait cycle
  return cyclePhase < 0.6 ? 'stance' : 'swing';
}

export function generateDummyReading(): SensorReading {
  gaitCycle++;
  
  return {
    timestamp: Date.now(),
    pressure: generateDummyPressure(),
    orientation: generateDummyOrientation(),
    gaitPhase: generateDummyGaitPhase(),
  };
}

/**
 * FUTURE ESP32 INTEGRATION:
 * 
 * export async function fetchLatestReading(): Promise<SensorReading> {
 *   const response = await fetch('/api/sensor/latest');
 *   if (!response.ok) throw new Error('Failed to fetch sensor data');
 *   return response.json();
 * }
 * 
 * export function createSensorStream(onData: (reading: SensorReading) => void): WebSocket {
 *   const ws = new WebSocket('ws://your-esp32-backend/sensor/stream');
 *   ws.onmessage = (event) => onData(JSON.parse(event.data));
 *   return ws;
 * }
 */

// Session management
let currentSession: { id: string; readings: SensorReading[]; startTime: number } | null = null;

export function startSession(): string {
  const sessionId = 'session_' + Date.now();
  currentSession = {
    id: sessionId,
    readings: [],
    startTime: Date.now(),
  };
  gaitCycle = 0;
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
