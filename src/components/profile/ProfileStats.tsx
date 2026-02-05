 import { Card, CardContent } from '@/components/ui/card';
 import { Clock, Activity, TrendingUp, Calendar } from 'lucide-react';
 
 interface ProfileStatsProps {
   totalSessions: number;
   usageTimeHours: number;
   avgStability: 'stable' | 'mild' | 'high';
   streakDays: number;
 }
 
 const stabilityLabels = {
   stable: 'Good',
   mild: 'Moderate', 
   high: 'Improving',
 };
 
 const stabilityColors = {
   stable: 'text-primary',
   mild: 'text-chart-4',
   high: 'text-destructive',
 };
 
 export function ProfileStats({ totalSessions, usageTimeHours, avgStability, streakDays }: ProfileStatsProps) {
   const stats = [
     { icon: Calendar, label: 'Total Sessions', value: totalSessions.toString() },
     { icon: Clock, label: 'Usage Time', value: `${usageTimeHours}h` },
     { icon: Activity, label: 'Avg Stability', value: stabilityLabels[avgStability], color: stabilityColors[avgStability] },
     { icon: TrendingUp, label: 'Streak', value: `${streakDays} days` },
   ];
 
   return (
     <div className="grid grid-cols-2 gap-3">
       {stats.map((stat) => (
         <Card key={stat.label} className="rounded-xl">
           <CardContent className="p-3">
             <div className="flex items-center gap-2 mb-1">
               <stat.icon className="h-4 w-4 text-muted-foreground" />
               <span className="text-xs text-muted-foreground">{stat.label}</span>
             </div>
             <p className={`text-xl font-bold ${stat.color || ''}`}>{stat.value}</p>
           </CardContent>
         </Card>
       ))}
     </div>
   );
 }