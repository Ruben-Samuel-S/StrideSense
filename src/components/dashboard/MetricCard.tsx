 import { Card, CardContent } from '@/components/ui/card';
 import { cn } from '@/lib/utils';
 import { LucideIcon } from 'lucide-react';
 
 interface MetricCardProps {
   title: string;
   value: number | string;
   unit?: string;
   icon?: LucideIcon;
   status?: 'normal' | 'warning' | 'critical';
   subtitle?: string;
   className?: string;
 }
 
 const statusStyles = {
   normal: 'border-primary/30 bg-primary/5',
   warning: 'border-chart-4/50 bg-chart-4/10',
   critical: 'border-destructive/50 bg-destructive/10',
 };
 
 const statusTextStyles = {
   normal: 'text-primary',
   warning: 'text-chart-4',
   critical: 'text-destructive',
 };
 
 export function MetricCard({ 
   title, 
   value, 
   unit, 
   icon: Icon, 
   status = 'normal',
   subtitle,
   className 
 }: MetricCardProps) {
   return (
     <Card className={cn('rounded-xl transition-all', statusStyles[status], className)}>
       <CardContent className="p-4">
         <div className="flex items-start justify-between mb-2">
           <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
             {title}
           </span>
           {Icon && (
             <Icon className={cn('h-4 w-4', statusTextStyles[status])} />
           )}
         </div>
         <div className="flex items-baseline gap-1">
           <span className={cn('text-3xl font-bold tabular-nums', statusTextStyles[status])}>
             {typeof value === 'number' ? value.toFixed(1) : value}
           </span>
           {unit && (
             <span className="text-sm text-muted-foreground">{unit}</span>
           )}
         </div>
         {subtitle && (
           <p className={cn('text-xs mt-1', statusTextStyles[status])}>{subtitle}</p>
         )}
       </CardContent>
     </Card>
   );
 }