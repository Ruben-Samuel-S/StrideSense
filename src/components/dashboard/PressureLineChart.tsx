import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { SensorReading } from '@/types/sensor';

interface PressureLineChartProps {
  readings: SensorReading[];
  className?: string;
}

export function PressureLineChart({ readings, className }: PressureLineChartProps) {
  const chartData = readings.map((reading, index) => ({
    time: index * 0.5, // seconds
    heel: reading.pressure.heel,
    midfoot: reading.pressure.midfoot,
    forefoot: reading.pressure.forefoot,
  }));

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Pressure Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {readings.length === 0 ? (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              Start recording to see pressure data
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis 
                  dataKey="time" 
                  label={{ value: 'Time (s)', position: 'insideBottomRight', offset: -10 }}
                  className="text-muted-foreground"
                />
                <YAxis 
                  label={{ value: 'Pressure (kPa)', angle: -90, position: 'insideLeft' }}
                  domain={[0, 500]}
                  className="text-muted-foreground"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 'var(--radius)',
                  }}
                  labelFormatter={(value) => `${value}s`}
                  formatter={(value: number) => [`${value.toFixed(1)} kPa`]}
                />
                <Legend />
                {/* Threshold lines */}
                <ReferenceLine y={200} stroke="hsl(var(--chart-4))" strokeDasharray="5 5" label="" />
                <ReferenceLine y={400} stroke="hsl(var(--destructive))" strokeDasharray="5 5" label="" />
                <Line 
                  type="monotone" 
                  dataKey="heel" 
                  stroke="hsl(var(--chart-1))" 
                  strokeWidth={2}
                  dot={false}
                  name="Heel"
                />
                <Line 
                  type="monotone" 
                  dataKey="midfoot" 
                  stroke="hsl(var(--chart-2))" 
                  strokeWidth={2}
                  dot={false}
                  name="Midfoot"
                />
                <Line 
                  type="monotone" 
                  dataKey="forefoot" 
                  stroke="hsl(var(--chart-3))" 
                  strokeWidth={2}
                  dot={false}
                  name="Forefoot"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className="flex justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-accent-foreground/30" />
            <span className="text-muted-foreground">Normal (&lt;200 kPa)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-chart-4/50" />
            <span className="text-muted-foreground">Moderate (200-400 kPa)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-destructive/50" />
            <span className="text-muted-foreground">High (&gt;400 kPa)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
