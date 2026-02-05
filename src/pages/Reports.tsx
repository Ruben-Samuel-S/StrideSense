 import { useState } from 'react';
 import { MobileLayout } from '@/components/layout/MobileLayout';
 import { Card, CardContent } from '@/components/ui/card';
 import { Button } from '@/components/ui/button';
 import { useSensorData } from '@/hooks/useSensorData';
 import { exportToCSV, exportToPDF } from '@/services/exportService';
 import { useToast } from '@/hooks/use-toast';
 import { Download, FileText, Calendar, Clock, Activity } from 'lucide-react';
 
 interface SessionRecord {
   id: string;
   date: string;
   duration: string;
   readings: number;
   stabilityLevel: 'stable' | 'mild' | 'high' | 'unknown';
   avgHeelPressure: number;
   avgForefoot: number;
 }
 
 // Mock session history - in production this would come from database
 const mockSessions: SessionRecord[] = [
   {
     id: '1',
     date: '2026-02-05',
     duration: '15:32',
     readings: 1865,
     stabilityLevel: 'stable',
     avgHeelPressure: 185,
     avgForefoot: 210,
   },
   {
     id: '2',
     date: '2026-02-04',
     duration: '12:45',
     readings: 1530,
     stabilityLevel: 'mild',
     avgHeelPressure: 220,
     avgForefoot: 195,
   },
   {
     id: '3',
     date: '2026-02-03',
     duration: '18:20',
     readings: 2196,
     stabilityLevel: 'stable',
     avgHeelPressure: 175,
     avgForefoot: 188,
   },
 ];
 
 const stabilityColors = {
   stable: 'text-primary bg-primary/10',
   mild: 'text-chart-4 bg-chart-4/10',
   high: 'text-destructive bg-destructive/10',
   unknown: 'text-muted-foreground bg-muted/10',
 };
 
 export default function Reports() {
   const { getAllReadings, gaitStability } = useSensorData();
   const { toast } = useToast();
   const [sessions] = useState<SessionRecord[]>(mockSessions);
 
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
     exportToCSV(allReadings, undefined, gaitStability);
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
     <MobileLayout>
       <div className="container py-4 space-y-4">
         <div className="mb-2">
           <h1 className="text-xl font-bold">Reports</h1>
           <p className="text-sm text-muted-foreground">Session history and exports</p>
         </div>
 
         {/* Export Actions */}
         <div className="flex gap-2">
           <Button onClick={handleExportCSV} variant="outline" className="flex-1 gap-2">
             <Download className="h-4 w-4" />
             Export CSV
           </Button>
           <Button onClick={handleExportPDF} variant="outline" className="flex-1 gap-2" disabled>
             <FileText className="h-4 w-4" />
             Export PDF
           </Button>
         </div>
 
         {/* Session List */}
         <div>
           <h2 className="text-sm font-medium text-muted-foreground mb-3">Session History</h2>
           <div className="space-y-3">
             {sessions.map((session) => (
               <Card key={session.id} className="rounded-xl">
                 <CardContent className="p-4">
                   <div className="flex items-start justify-between mb-3">
                     <div className="flex items-center gap-2">
                       <Calendar className="h-4 w-4 text-muted-foreground" />
                       <span className="font-medium">{session.date}</span>
                     </div>
                     <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${stabilityColors[session.stabilityLevel]}`}>
                       {session.stabilityLevel}
                     </span>
                   </div>
                   
                   <div className="grid grid-cols-3 gap-4 text-sm">
                     <div>
                       <div className="flex items-center gap-1 text-muted-foreground mb-1">
                         <Clock className="h-3 w-3" />
                         <span className="text-xs">Duration</span>
                       </div>
                       <span className="font-medium">{session.duration}</span>
                     </div>
                     <div>
                       <div className="flex items-center gap-1 text-muted-foreground mb-1">
                         <Activity className="h-3 w-3" />
                         <span className="text-xs">Readings</span>
                       </div>
                       <span className="font-medium">{session.readings}</span>
                     </div>
                     <div>
                       <div className="text-xs text-muted-foreground mb-1">Avg Pressure</div>
                       <span className="font-medium">{Math.round((session.avgHeelPressure + session.avgForefoot) / 2)} kPa</span>
                     </div>
                   </div>
                 </CardContent>
               </Card>
             ))}
           </div>
         </div>
 
         {/* Info Note */}
         <Card className="rounded-xl border-dashed">
           <CardContent className="p-4 text-center">
             <p className="text-sm text-muted-foreground">
               Session history will be synced with cloud storage in a future update.
             </p>
           </CardContent>
         </Card>
       </div>
     </MobileLayout>
   );
 }