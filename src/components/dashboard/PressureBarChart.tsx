import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { PressureData, getPressureLevel } from '@/types/sensor';

interface PressureBarChartProps {
  pressure: PressureData | null;
  className?: string;
}

export function PressureBarChart({ pressure, className }: PressureBarChartProps) {
  const chartData = pressure ? [
    { name: 'Heel', value: pressure.heel, level: getPressureLevel(pressure.heel) },
    { name: 'Midfoot', value: pressure.midfoot, level: getPressureLevel(pressure.midfoot) },
    { name: 'Forefoot', value: pressure.forefoot, level: getPressureLevel(pressure.forefoot) },
  ] : [];

  const getBarColor = (level: string) => {
    switch (level) {
      case 'normal': return 'hsl(var(--chart-1))';
      case 'moderate': return 'hsl(var(--chart-4))';
      case 'high': return 'hsl(var(--destructive))';
      default: return 'hsl(var(--muted))';
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Current Pressure Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {!pressure ? (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              Start recording to see pressure distribution
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis 
                  dataKey="name" 
                  className="text-muted-foreground"
                />
                <YAxis 
                  domain={[0, 500]}
                  label={{ value: 'kPa', angle: -90, position: 'insideLeft' }}
                  className="text-muted-foreground"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 'var(--radius)',
                  }}
                  formatter={(value: number) => [`${value.toFixed(1)} kPa`, 'Pressure']}
                />
                {/* Threshold lines */}
                <ReferenceLine y={200} stroke="hsl(var(--chart-4))" strokeDasharray="5 5" />
                <ReferenceLine y={400} stroke="hsl(var(--destructive))" strokeDasharray="5 5" />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getBarColor(entry.level)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
