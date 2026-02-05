 import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
 import { RotateCcw, AlertTriangle } from 'lucide-react';
 import { cn } from '@/lib/utils';
 
 interface OrientationCardProps {
   title: string;
   value: number;
   type: 'pitch' | 'roll';
   className?: string;
 }
 
 // Clinical thresholds for prosthetic foot orientation
 const THRESHOLDS = {
   pitch: { normal: 10 }, // ±10°
   roll: { normal: 8 },   // ±8°
 };
 
 /**
  * IMU-Based Orientation Card
  * 
  * Displays real-time pitch or roll angle from the prosthetic foot IMU.
  * Thresholds:
  * - Pitch: Normal range -10° to +10°
  * - Roll: Normal range -8° to +8°
  */
 export function OrientationCard({ title, value, type, className }: OrientationCardProps) {
   const threshold = THRESHOLDS[type].normal;
   const isAbnormal = Math.abs(value) > threshold;
   const isActive = value !== 0;
 
   const getStatus = () => {
     if (!isActive) return { label: 'Awaiting Data', color: 'muted' };
     if (Math.abs(value) <= threshold) {
       return { label: 'Normal Alignment', color: 'safe' };
     }
     if (Math.abs(value) <= threshold * 1.5) {
       return { label: 'Mild Tilt', color: 'caution' };
     }
     return { label: 'Abnormal Tilt', color: 'danger' };
   };
 
   const status = getStatus();
 
   const getColorClasses = () => {
     switch (status.color) {
       case 'safe':
         return {
           border: 'border-green-500/50',
           bg: 'bg-green-500/10',
           text: 'text-green-600 dark:text-green-400',
           badge: 'bg-green-500/20 text-green-700 dark:text-green-300',
         };
       case 'caution':
         return {
           border: 'border-yellow-500/50',
           bg: 'bg-yellow-500/10',
           text: 'text-yellow-600 dark:text-yellow-400',
           badge: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300',
         };
       case 'danger':
         return {
           border: 'border-destructive/50',
           bg: 'bg-destructive/10',
           text: 'text-destructive',
           badge: 'bg-destructive/20 text-destructive',
         };
       default:
         return {
           border: 'border-border',
           bg: 'bg-muted/30',
           text: 'text-muted-foreground',
           badge: 'bg-muted text-muted-foreground',
         };
     }
   };
 
   const colors = getColorClasses();
 
   return (
     <Card className={cn('transition-colors', colors.border, className)}>
       <CardHeader className="pb-2">
         <CardTitle className="text-sm font-medium flex items-center gap-2">
           {isAbnormal && isActive ? (
             <AlertTriangle className="h-4 w-4 text-destructive" />
           ) : (
             <RotateCcw className="h-4 w-4" />
           )}
           {title}
         </CardTitle>
       </CardHeader>
       <CardContent>
         <div className={cn('rounded-lg p-3 text-center', colors.bg)}>
           <div className={cn('text-2xl font-bold font-mono', colors.text)}>
             {value >= 0 ? '+' : ''}{value.toFixed(1)}
             <span className="text-sm font-normal ml-1">°</span>
           </div>
           <div className={cn('inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium', colors.badge)}>
             {status.label}
           </div>
         </div>
         <p className="text-xs text-muted-foreground text-center mt-2">
           Normal: ±{threshold}°
         </p>
       </CardContent>
     </Card>
   );
 }