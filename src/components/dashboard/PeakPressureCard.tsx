import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, TrendingUp } from 'lucide-react';
import { getPeakPressureRisk } from '@/types/sensor';
import { cn } from '@/lib/utils';

interface PeakPressureCardProps {
  title: string;
  value: number;
  className?: string;
}

/**
 * Peak Pressure Detection Card
 * 
 * Tracks maximum pressure values to identify high-risk zones linked to ulcer formation.
 * Thresholds: < 300 kPa (Safe), 300-450 kPa (Caution), > 450 kPa (Ulcer Risk)
 * 
 * ESP32 INTEGRATION: Peak values tracked from real-time WiFi sensor data
 */
export function PeakPressureCard({ title, value, className }: PeakPressureCardProps) {
  const risk = getPeakPressureRisk(value);

  const getColorClasses = () => {
    switch (risk) {
      case 'safe':
        return {
          border: 'border-green-500/50',
          bg: 'bg-green-500/10',
          text: 'text-green-600 dark:text-green-400',
          badge: 'bg-green-500/20 text-green-700 dark:text-green-300',
        };
      case 'caution':
        return {
          border: 'border-yellow-500/50',
          bg: 'bg-yellow-500/10',
          text: 'text-yellow-600 dark:text-yellow-400',
          badge: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300',
        };
      case 'high-risk':
        return {
          border: 'border-destructive/50',
          bg: 'bg-destructive/10',
          text: 'text-destructive',
          badge: 'bg-destructive/20 text-destructive',
        };
    }
  };

  const getRiskLabel = () => {
    switch (risk) {
      case 'safe':
        return 'Safe';
      case 'caution':
        return 'Caution';
      case 'high-risk':
        return 'Ulcer Risk';
    }
  };

  const colors = getColorClasses();

  return (
    <Card className={cn('transition-colors', colors.border, className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          {risk === 'high-risk' ? (
            <AlertTriangle className="h-4 w-4 text-destructive" />
          ) : (
            <TrendingUp className="h-4 w-4" />
          )}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={cn('rounded-lg p-3 text-center', colors.bg)}>
          <div className={cn('text-2xl font-bold', colors.text)}>
            {value.toFixed(0)} <span className="text-sm font-normal">kPa</span>
          </div>
          <div className={cn('inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium', colors.badge)}>
            {getRiskLabel()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
