/**
 * Export Service - StrideSense Prosthetics
 * 
 * Handles data export functionality.
 * CSV export is fully implemented.
 * PDF export is a placeholder for future implementation.
 */

import { SensorReading } from '@/types/sensor';
import { GaitStabilityMetrics } from '@/hooks/useSensorData';

export function exportToCSV(
  readings: SensorReading[], 
  filename?: string,
  gaitStability?: GaitStabilityMetrics
): void {
  if (readings.length === 0) {
    console.warn('No data to export');
    return;
  }

  // Create CSV header
  const headers = [
    'Timestamp',
    'DateTime',
    'Heel Pressure (kPa)',
    'Forefoot Pressure (kPa)',
    'Pitch (°)',
    'Roll (°)',
    'Gait Phase',
    'COP (mm)',
  ];

  // Create CSV rows
  const rows = readings.map(reading => [
    reading.timestamp,
    new Date(reading.timestamp).toISOString(),
    reading.pressure.heel.toFixed(2),
    reading.pressure.forefoot.toFixed(2),
    reading.orientation.pitch.toFixed(2),
    reading.orientation.roll.toFixed(2),
    reading.gaitPhase,
    reading.cop.toFixed(2),
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(',')),
    '', // Empty row before summary
    '--- Session Summary ---',
    `Total Readings,${readings.length}`,
    `Pitch Variation (°),${gaitStability?.pitchVariation?.toFixed(2) ?? 'N/A'}`,
    `Roll Variation (°),${gaitStability?.rollVariation?.toFixed(2) ?? 'N/A'}`,
    `Gait Stability Level,${gaitStability?.stabilityLevel ?? 'N/A'}`,
  ].join('\n');

  // Create and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename || `stridesense_session_${Date.now()}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

export function exportToPDF(): void {
  // PLACEHOLDER: PDF export will be implemented in future version
  // This will generate a comprehensive report including:
  // - Session summary
  // - Pressure distribution charts
  // - Gait analysis
  // - Recommendations
  console.log('PDF export coming soon');
}
