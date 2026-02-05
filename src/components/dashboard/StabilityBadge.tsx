 import { cn } from '@/lib/utils';
 import { Activity } from 'lucide-react';
 
 interface StabilityBadgeProps {
   level: 'stable' | 'mild' | 'high' | 'unknown';
   className?: string;
 }
 
 const levelConfig = {
   stable: { label: 'Stable', color: 'bg-primary/20 text-primary border-primary/30' },
   mild: { label: 'Mild Instability', color: 'bg-chart-4/20 text-chart-4 border-chart-4/30' },
   high: { label: 'High Instability', color: 'bg-destructive/20 text-destructive border-destructive/30' },
   unknown: { label: 'Calculating...', color: 'bg-muted/20 text-muted-foreground border-muted/30' },
 };
 
 export function StabilityBadge({ level, className }: StabilityBadgeProps) {
   const config = levelConfig[level];
   
   return (
     <div className={cn(
       'inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium',
       config.color,
       className
     )}>
       <Activity className="h-4 w-4" />
       <span>{config.label}</span>
     </div>
   );
 }