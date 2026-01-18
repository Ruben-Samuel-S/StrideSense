import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { COPData } from '@/hooks/useSensorData';
import { FOOT_LENGTH_MM } from '@/types/sensor';
import { cn } from '@/lib/utils';

interface COPLineChartProps {
  copHistory: COPData[];
  className?: string;
}

/**
 * Center of Pressure (COP) vs Time Graph
 * 
 * Visualizes how body weight progresses from heel to toe during gait.
 * Y-axis: 0 mm (Heel) to 280 mm (Toe)
 * 
 * ESP32 INTEGRATION: COP data will be calculated from pressure sensors via WiFi
 */
export function COPLineChart({ copHistory, className }: COPLineChartProps) {
  // Transform data for chart
  const chartData = copHistory.map((data, index) => ({
    time: index * 0.5, // seconds (500ms intervals)
    cop: data.position,
  }));

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle className="text-lg">Center of Pressure (COP) vs Time</CardTitle>
        <CardDescription>
          Weight transfer progression from heel to toe
        </CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="h-[250px] flex items-center justify-center text-muted-foreground">
            Start recording to see COP progression
          </div>
        ) : (
          <>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <XAxis 
                    dataKey="time" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickFormatter={(value) => `${value.toFixed(0)}s`}
                  />
                  <YAxis 
                    domain={[0, FOOT_LENGTH_MM]}
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickFormatter={(value) => `${value}`}
                    label={{ 
                      value: 'mm', 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { textAnchor: 'middle', fill: 'hsl(var(--muted-foreground))' }
                    }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => [`${value.toFixed(1)} mm`, 'COP Position']}
                    labelFormatter={(label) => `Time: ${label}s`}
                  />
                  {/* Reference lines for heel and toe zones */}
                  <ReferenceLine 
                    y={50} 
                    stroke="hsl(var(--chart-1))" 
                    strokeDasharray="3 3"
                    label={{ value: 'Heel Zone', position: 'right', fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                  />
                  <ReferenceLine 
                    y={230} 
                    stroke="hsl(var(--chart-2))" 
                    strokeDasharray="3 3"
                    label={{ value: 'Toe Zone', position: 'right', fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="cop" 
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={false}
                    animationDuration={200}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-4 text-xs text-muted-foreground text-center px-4">
              Smooth forward COP progression indicates stable gait. Sudden jumps or stagnation indicate instability.
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
