import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { getPressureLevel } from '@/types/sensor';

interface SensorCardProps {
  title: string;
  value: number;
  unit: string;
  icon?: React.ReactNode;
  type?: 'pressure' | 'orientation' | 'status';
  className?: string;
}

export function SensorCard({ 
  title, 
  value, 
  unit, 
  icon,
  type = 'pressure',
  className 
}: SensorCardProps) {
  const pressureLevel = type === 'pressure' ? getPressureLevel(value) : null;
  
  const getValueColor = () => {
    if (type === 'orientation') {
      // Show primary color when receiving live data (non-zero value)
      return value !== 0 ? 'text-primary' : 'text-muted-foreground';
    }
    if (type !== 'pressure') return 'text-foreground';
    switch (pressureLevel) {
      case 'normal': return 'text-accent-foreground';
      case 'moderate': return 'text-chart-4';
      case 'high': return 'text-destructive';
      default: return 'text-foreground';
    }
  };

  const getBorderColor = () => {
    if (type === 'orientation') {
      // Highlight border when receiving live IMU data
      return value !== 0 ? 'border-primary/30' : 'border-border';
    }
    if (type !== 'pressure') return 'border-border';
    switch (pressureLevel) {
      case 'normal': return 'border-accent-foreground/30';
      case 'moderate': return 'border-chart-4/30';
      case 'high': return 'border-destructive/30';
      default: return 'border-border';
    }
  };

  return (
    <Card className={cn(
      'transition-all duration-300',
      getBorderColor(),
      'border-2',
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && (
          <div className="text-muted-foreground">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className={cn('text-3xl font-bold font-mono', getValueColor())}>
          {value.toFixed(1)}
          <span className="text-lg ml-1 text-muted-foreground font-normal">
            {unit}
          </span>
        </div>
        {type === 'pressure' && pressureLevel && (
          <p className={cn('text-xs mt-1 capitalize', getValueColor())}>
            {pressureLevel} pressure
          </p>
        )}
      </CardContent>
    </Card>
  );
}
