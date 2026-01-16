import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/layout/Header';
import { SensorCard } from '@/components/dashboard/SensorCard';
import { GaitPhaseIndicator } from '@/components/dashboard/GaitPhaseIndicator';
import { PressureLineChart } from '@/components/dashboard/PressureLineChart';
import { PressureBarChart } from '@/components/dashboard/PressureBarChart';
import { useSensorData } from '@/hooks/useSensorData';
import { exportToCSV, exportToPDF } from '@/services/exportService';
import { useToast } from '@/hooks/use-toast';
import { Play, Square, Download, FileText, Gauge, RotateCcw } from 'lucide-react';

export default function Dashboard() {
  const { 
    isRecording, 
    currentReading, 
    readings, 
    startRecording, 
    stopRecording,
    getAllReadings 
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
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
          <SensorCard
            title="Pitch"
            value={currentReading?.orientation.pitch ?? 0}
            unit="°"
            type="orientation"
            icon={<RotateCcw className="h-4 w-4" />}
          />
          <SensorCard
            title="Roll"
            value={currentReading?.orientation.roll ?? 0}
            unit="°"
            type="orientation"
            icon={<RotateCcw className="h-4 w-4" />}
          />
          <GaitPhaseIndicator phase={currentReading?.gaitPhase ?? null} />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PressureLineChart readings={readings} />
          <PressureBarChart pressure={currentReading?.pressure ?? null} />
        </div>

        {/* Integration Note */}
        <Card className="mt-6 border-dashed">
          <CardHeader>
            <CardTitle className="text-muted-foreground text-sm">Integration Status</CardTitle>
            <CardDescription>
              Currently displaying simulated data. ESP32 WiFi sensor integration pending.
              <br />
              <span className="font-mono text-xs">API Endpoint: GET /api/sensor/latest (via WiFi)</span>
            </CardDescription>
          </CardHeader>
        </Card>
      </main>
    </div>
  );
}
