 import { MobileLayout } from '@/components/layout/MobileLayout';
 import { MetricCard } from '@/components/dashboard/MetricCard';
 import { RecordingControls } from '@/components/dashboard/RecordingControls';
 import { StabilityBadge } from '@/components/dashboard/StabilityBadge';
 import { useSensorData } from '@/hooks/useSensorData';
 import { useToast } from '@/hooks/use-toast';
 import { getPressureLevel, getPeakPressureRisk } from '@/types/sensor';
 import { Gauge, RotateCcw, MoveHorizontal, Activity } from 'lucide-react';
 
 export default function MobileDashboard() {
   const { 
     isRecording, 
     currentReading, 
     readings, 
     startRecording, 
     stopRecording,
     getAllReadings,
     gaitStability,
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
 
   const heelPressure = currentReading?.pressure.heel ?? 0;
   const forefootPressure = currentReading?.pressure.forefoot ?? 0;
   const pitch = currentReading?.orientation.pitch ?? 0;
   const roll = currentReading?.orientation.roll ?? 0;
 
   const getOrientationStatus = (value: number, threshold: number): 'normal' | 'warning' | 'critical' => {
     const absValue = Math.abs(value);
     if (absValue <= threshold) return 'normal';
     if (absValue <= threshold * 1.5) return 'warning';
     return 'critical';
   };
 
   const getPressureStatus = (kPa: number): 'normal' | 'warning' | 'critical' => {
     const risk = getPeakPressureRisk(kPa);
     if (risk === 'safe') return 'normal';
     if (risk === 'caution') return 'warning';
     return 'critical';
   };
 
   return (
     <MobileLayout>
       <div className="container py-4 space-y-4">
         {/* Header */}
         <div className="mb-2">
           <h1 className="text-xl font-bold">Live Dashboard</h1>
           <p className="text-sm text-muted-foreground">Real-time prosthetic monitoring</p>
         </div>
 
         {/* Recording Controls */}
         <RecordingControls
           isRecording={isRecording}
           readingsCount={readings.length}
           onStartStop={handleStartStop}
         />
 
         {/* Gait Stability Badge */}
         <div className="flex items-center justify-between">
           <span className="text-sm font-medium">Gait Stability</span>
           <StabilityBadge level={gaitStability.stabilityLevel} />
         </div>
 
         {/* Pressure Metrics */}
         <div>
           <h2 className="text-sm font-medium text-muted-foreground mb-2">Pressure Sensors</h2>
           <div className="grid grid-cols-2 gap-3">
             <MetricCard
               title="Heel"
               value={heelPressure}
               unit="kPa"
               icon={Gauge}
               status={getPressureStatus(heelPressure)}
               subtitle={heelPressure <= 300 ? 'Normal' : heelPressure <= 450 ? 'Caution' : 'High Risk'}
             />
             <MetricCard
               title="Forefoot"
               value={forefootPressure}
               unit="kPa"
               icon={Gauge}
               status={getPressureStatus(forefootPressure)}
               subtitle={forefootPressure <= 300 ? 'Normal' : forefootPressure <= 450 ? 'Caution' : 'High Risk'}
             />
           </div>
         </div>
 
         {/* Orientation Metrics */}
         <div>
           <h2 className="text-sm font-medium text-muted-foreground mb-2">IMU Orientation</h2>
           <div className="grid grid-cols-2 gap-3">
             <MetricCard
               title="Pitch"
               value={pitch}
               unit="°"
               icon={RotateCcw}
               status={getOrientationStatus(pitch, 10)}
               subtitle={Math.abs(pitch) <= 10 ? 'Normal' : 'Abnormal Tilt'}
             />
             <MetricCard
               title="Roll"
               value={roll}
               unit="°"
               icon={MoveHorizontal}
               status={getOrientationStatus(roll, 8)}
               subtitle={Math.abs(roll) <= 8 ? 'Normal' : 'Abnormal Tilt'}
             />
           </div>
         </div>
 
         {/* Stability Metrics */}
         <div>
           <h2 className="text-sm font-medium text-muted-foreground mb-2">Stability Variation</h2>
           <div className="grid grid-cols-2 gap-3">
             <MetricCard
               title="Pitch Var"
               value={gaitStability.pitchVariation}
               unit="σ"
               icon={Activity}
               status={gaitStability.pitchVariation < 5 ? 'normal' : gaitStability.pitchVariation < 15 ? 'warning' : 'critical'}
             />
             <MetricCard
               title="Roll Var"
               value={gaitStability.rollVariation}
               unit="σ"
               icon={Activity}
               status={gaitStability.rollVariation < 5 ? 'normal' : gaitStability.rollVariation < 15 ? 'warning' : 'critical'}
             />
           </div>
         </div>
 
         {/* Gait Phase Indicator */}
         <div className="p-4 rounded-xl bg-card border">
           <div className="flex items-center justify-between">
             <span className="text-sm font-medium">Current Gait Phase</span>
             <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium capitalize">
               {currentReading?.gaitPhase ?? 'Waiting...'}
             </span>
           </div>
         </div>
       </div>
     </MobileLayout>
   );
 }