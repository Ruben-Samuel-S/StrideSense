import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/layout/Header';
import { SensorCard } from '@/components/dashboard/SensorCard';

import { PressureLineChart } from '@/components/dashboard/PressureLineChart';
import { PressureBarChart } from '@/components/dashboard/PressureBarChart';
import { AsymmetryIndexCard } from '@/components/dashboard/AsymmetryIndexCard';
import { PeakPressureCard } from '@/components/dashboard/PeakPressureCard';
import { COPLineChart } from '@/components/dashboard/COPLineChart';
import { ClinicalInterpretationPanel } from '@/components/dashboard/ClinicalInterpretationPanel';
import { useSensorData } from '@/hooks/useSensorData';
import { exportToCSV, exportToPDF } from '@/services/exportService';
import { useToast } from '@/hooks/use-toast';
import { calculateAsymmetryIndex } from '@/types/sensor';
import { Play, Square, Download, FileText, Gauge } from 'lucide-react';

export default function Dashboard() {
  const { 
    isRecording, 
    currentReading, 
    readings, 
    startRecording, 
    stopRecording,
    getAllReadings,
    peakHeel,
    peakForefoot,
    copHistory,
  } = useSensorData();
  const { toast } = useToast();

  const handleStartStop = () => {
    if (isRecording) {
      stopRecording();
      toast({
        title: 'Recording Stopped',
        description: `Recorded ${getAllReadings().length} data points`,
      });
    } else {
      startRecording();
      toast({
        title: 'Recording Started',
        description: 'Sensor data is now being captured',
      });
    }
  };

  const handleExportCSV = () => {
    const allReadings = getAllReadings();
    if (allReadings.length === 0) {
      toast({
        title: 'No Data',
        description: 'Start a recording session first to collect data',
        variant: 'destructive',
      });
      return;
    }
    exportToCSV(allReadings);
    toast({
      title: 'Export Complete',
      description: 'CSV file has been downloaded',
    });
  };

  const handleExportPDF = () => {
    exportToPDF();
    toast({
      title: 'Coming Soon',
      description: 'PDF export will be available in a future update',
    });
  };

  // Calculate current asymmetry index for clinical panel
  const currentAsymmetry = currentReading 
    ? calculateAsymmetryIndex(currentReading.pressure.heel, currentReading.pressure.forefoot)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6">
        {/* Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Live Dashboard</h1>
            <p className="text-muted-foreground">
              Real-time prosthetic limb sensor monitoring
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={handleStartStop}
              variant={isRecording ? 'destructive' : 'default'}
              className="gap-2"
            >
              {isRecording ? (
                <>
                  <Square className="h-4 w-4" />
                  Stop Recording
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Start Recording
                </>
              )}
            </Button>
            <Button variant="outline" onClick={handleExportCSV} className="gap-2">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
            <Button variant="outline" onClick={handleExportPDF} className="gap-2" disabled>
              <FileText className="h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </div>

        {/* Status Indicator */}
        <Card className={`mb-6 ${isRecording ? 'border-primary' : ''}`}>
          <CardContent className="flex items-center gap-4 py-4">
            <div className={`w-3 h-3 rounded-full ${isRecording ? 'bg-primary animate-pulse' : 'bg-muted'}`} />
            <span className="font-medium">
              {isRecording ? 'Recording in progress...' : 'Ready to record'}
            </span>
            {isRecording && (
              <span className="text-muted-foreground">
                {readings.length} readings captured
              </span>
            )}
          </CardContent>
        </Card>

        {/* Sensor Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <SensorCard
            title="Heel Pressure"
            value={currentReading?.pressure.heel ?? 0}
            unit="kPa"
            type="pressure"
            icon={<Gauge className="h-4 w-4" />}
          />
          <SensorCard
            title="Forefoot Pressure"
            value={currentReading?.pressure.forefoot ?? 0}
            unit="kPa"
            type="pressure"
            icon={<Gauge className="h-4 w-4" />}
          />
        </div>

        {/* Clinical Metrics Row - NEW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <AsymmetryIndexCard
            heelPressure={currentReading?.pressure.heel ?? 0}
            forefootPressure={currentReading?.pressure.forefoot ?? 0}
          />
          <PeakPressureCard
            title="Peak Heel Pressure"
            value={peakHeel}
          />
          <PeakPressureCard
            title="Peak Toe Pressure"
            value={peakForefoot}
          />
        </div>

        {/* Pressure Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <PressureLineChart readings={readings} />
          <PressureBarChart pressure={currentReading?.pressure ?? null} />
        </div>

        {/* COP Chart - NEW */}
        <COPLineChart copHistory={copHistory} className="mb-6" />

        {/* Clinical Interpretation Panel - NEW */}
        <ClinicalInterpretationPanel
          asymmetryIndex={currentAsymmetry}
          peakHeel={peakHeel}
          peakForefoot={peakForefoot}
          copHistory={copHistory}
          className="mb-6"
        />

        {/* Integration Note */}
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-muted-foreground text-sm">Integration Status</CardTitle>
            <CardDescription>
              Live ESP32 WiFi sensor connected.
              <br />
              <span className="font-mono text-xs">API Endpoint: GET /sensor-data</span>
            </CardDescription>
          </CardHeader>
        </Card>
      </main>
    </div>
  );
}
