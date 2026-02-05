 import { MobileLayout } from '@/components/layout/MobileLayout';
 import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
 import { PressureLineChart } from '@/components/dashboard/PressureLineChart';
 import { COPLineChart } from '@/components/dashboard/COPLineChart';
 import { AsymmetryIndexCard } from '@/components/dashboard/AsymmetryIndexCard';
 import { useSensorData } from '@/hooks/useSensorData';
 import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
 import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
 
 export default function Analytics() {
   const { readings, copHistory, currentReading, orientationHistory } = useSensorData();
 
   // Prepare orientation data for chart
   const orientationData = orientationHistory.slice(-30).map((item, index) => ({
     index,
     pitch: item.pitch,
     roll: item.roll,
   }));
 
   return (
     <MobileLayout>
       <div className="container py-4 space-y-4">
         <div className="mb-2">
           <h1 className="text-xl font-bold">Analytics</h1>
           <p className="text-sm text-muted-foreground">Gait and sensor data visualization</p>
         </div>
 
         <Tabs defaultValue="pressure" className="w-full">
           <TabsList className="grid w-full grid-cols-3 mb-4">
             <TabsTrigger value="pressure">Pressure</TabsTrigger>
             <TabsTrigger value="orientation">IMU</TabsTrigger>
             <TabsTrigger value="symmetry">Symmetry</TabsTrigger>
           </TabsList>
 
           <TabsContent value="pressure" className="space-y-4">
             {/* Pressure vs Time Chart */}
             <Card className="rounded-xl">
               <CardHeader className="pb-2">
                 <CardTitle className="text-sm font-medium">Pressure vs Time</CardTitle>
               </CardHeader>
               <CardContent>
                 <PressureLineChart readings={readings} />
               </CardContent>
             </Card>
 
             {/* COP Chart */}
             <COPLineChart copHistory={copHistory} />
           </TabsContent>
 
           <TabsContent value="orientation" className="space-y-4">
             {/* Pitch & Roll vs Time Chart */}
             <Card className="rounded-xl">
               <CardHeader className="pb-2">
                 <CardTitle className="text-sm font-medium">Pitch & Roll Over Time</CardTitle>
               </CardHeader>
               <CardContent>
                 <div className="h-64">
                   <ResponsiveContainer width="100%" height="100%">
                     <LineChart data={orientationData}>
                       <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                       <XAxis 
                         dataKey="index" 
                         tick={{ fontSize: 10 }} 
                         className="fill-muted-foreground"
                       />
                       <YAxis 
                         tick={{ fontSize: 10 }} 
                         className="fill-muted-foreground"
                         domain={[-30, 30]}
                       />
                       <Tooltip 
                         contentStyle={{ 
                           backgroundColor: 'hsl(var(--card))', 
                           border: '1px solid hsl(var(--border))',
                           borderRadius: '0.5rem'
                         }}
                       />
                       <Legend />
                       <Line 
                         type="monotone" 
                         dataKey="pitch" 
                         stroke="hsl(var(--chart-1))" 
                         strokeWidth={2}
                         dot={false}
                         name="Pitch (°)"
                       />
                       <Line 
                         type="monotone" 
                         dataKey="roll" 
                         stroke="hsl(var(--chart-2))" 
                         strokeWidth={2}
                         dot={false}
                         name="Roll (°)"
                       />
                     </LineChart>
                   </ResponsiveContainer>
                 </div>
               </CardContent>
             </Card>
 
             {/* Threshold Reference */}
             <Card className="rounded-xl">
               <CardContent className="p-4">
                 <h3 className="text-sm font-medium mb-3">Clinical Thresholds</h3>
                 <div className="space-y-2 text-sm">
                   <div className="flex justify-between">
                     <span className="text-muted-foreground">Pitch Normal Range</span>
                     <span className="text-primary">±10°</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-muted-foreground">Roll Normal Range</span>
                     <span className="text-primary">±8°</span>
                   </div>
                 </div>
               </CardContent>
             </Card>
           </TabsContent>
 
           <TabsContent value="symmetry" className="space-y-4">
             {/* Asymmetry Index */}
             <AsymmetryIndexCard
               heelPressure={currentReading?.pressure.heel ?? 0}
               forefootPressure={currentReading?.pressure.forefoot ?? 0}
             />
 
             {/* Symmetry Analysis Info */}
             <Card className="rounded-xl">
               <CardContent className="p-4">
                 <h3 className="text-sm font-medium mb-3">Asymmetry Thresholds</h3>
                 <div className="space-y-2 text-sm">
                   <div className="flex justify-between items-center">
                     <span className="text-muted-foreground">Normal Balance</span>
                     <span className="text-primary">&lt; 20%</span>
                   </div>
                   <div className="flex justify-between items-center">
                     <span className="text-muted-foreground">Moderate Imbalance</span>
                     <span className="text-chart-4">20-40%</span>
                   </div>
                   <div className="flex justify-between items-center">
                     <span className="text-muted-foreground">Severe Imbalance</span>
                     <span className="text-destructive">&gt; 40%</span>
                   </div>
                 </div>
               </CardContent>
             </Card>
           </TabsContent>
         </Tabs>
       </div>
     </MobileLayout>
   );
 }