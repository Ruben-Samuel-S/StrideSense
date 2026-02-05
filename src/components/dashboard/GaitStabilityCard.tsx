 import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
 import { Activity, AlertTriangle, CheckCircle } from 'lucide-react';
 import { cn } from '@/lib/utils';
 
 export type StabilityLevel = 'stable' | 'mild' | 'high' | 'unknown';
 
 interface GaitStabilityCardProps {
   pitchVariation: number;
   rollVariation: number;
   className?: string;
 }
 
 /**
  * Gait Stability Index Card
  * 
  * Computes a stability index from pitch and roll variation over time.
  * Uses standard deviation of orientation values to determine stability.
  * 
  * Thresholds:
  * - Stable: Combined variation < 5
  * - Mild Instability: Combined variation 5-15
  * - High Instability: Combined variation > 15
  */
 export function GaitStabilityCard({ pitchVariation, rollVariation, className }: GaitStabilityCardProps) {
   // Combined stability index (root mean square of variations)
   const stabilityIndex = Math.sqrt(pitchVariation ** 2 + rollVariation ** 2);
   
   const getStabilityLevel = (): StabilityLevel => {
     if (stabilityIndex === 0) return 'unknown';
     if (stabilityIndex < 5) return 'stable';
     if (stabilityIndex < 15) return 'mild';
     return 'high';
   };
 
   const level = getStabilityLevel();
 
   const getConfig = () => {
     switch (level) {
       case 'stable':
         return {
           label: 'Stable',
           description: 'Consistent gait pattern detected',
           border: 'border-green-500/50',
           bg: 'bg-green-500/10',
           text: 'text-green-600 dark:text-green-400',
           badge: 'bg-green-500/20 text-green-700 dark:text-green-300',
           icon: CheckCircle,
         };
       case 'mild':
         return {
           label: 'Mild Instability',
           description: 'Minor orientation fluctuations',
           border: 'border-yellow-500/50',
           bg: 'bg-yellow-500/10',
           text: 'text-yellow-600 dark:text-yellow-400',
           badge: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300',
           icon: AlertTriangle,
         };
       case 'high':
         return {
           label: 'High Instability',
           description: 'Significant gait irregularity',
           border: 'border-destructive/50',
           bg: 'bg-destructive/10',
           text: 'text-destructive',
           badge: 'bg-destructive/20 text-destructive',
           icon: AlertTriangle,
         };
       default:
         return {
           label: 'Awaiting Data',
           description: 'Start recording to analyze stability',
           border: 'border-border',
           bg: 'bg-muted/30',
           text: 'text-muted-foreground',
           badge: 'bg-muted text-muted-foreground',
           icon: Activity,
         };
     }
   };
 
   const config = getConfig();
   const Icon = config.icon;
 
   return (
     <Card className={cn('transition-colors', config.border, className)}>
       <CardHeader className="pb-2">
         <CardTitle className="text-sm font-medium flex items-center gap-2">
           <Activity className="h-4 w-4" />
           Gait Stability Index
         </CardTitle>
       </CardHeader>
       <CardContent>
         <div className={cn('rounded-lg p-4 text-center', config.bg)}>
           <div className="flex items-center justify-center gap-2 mb-2">
             <Icon className={cn('h-6 w-6', config.text)} />
             <span className={cn('text-xl font-bold', config.text)}>
               {config.label}
             </span>
           </div>
           <p className="text-xs text-muted-foreground">
             {config.description}
           </p>
           {level !== 'unknown' && (
             <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
               <div className="bg-background/50 rounded p-2">
                 <div className="text-muted-foreground">Pitch Var</div>
                 <div className="font-mono font-medium">{pitchVariation.toFixed(2)}°</div>
               </div>
               <div className="bg-background/50 rounded p-2">
                 <div className="text-muted-foreground">Roll Var</div>
                 <div className="font-mono font-medium">{rollVariation.toFixed(2)}°</div>
               </div>
             </div>
           )}
         </div>
       </CardContent>
     </Card>
   );
 }
 
 /**
  * Calculate standard deviation of an array of numbers
  */
 export function calculateVariation(values: number[]): number {
   if (values.length < 2) return 0;
   
   const mean = values.reduce((a, b) => a + b, 0) / values.length;
   const squaredDiffs = values.map(v => (v - mean) ** 2);
   const variance = squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
   
   return Math.sqrt(variance);
 }