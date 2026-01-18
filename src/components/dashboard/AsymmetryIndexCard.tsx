import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Scale } from 'lucide-react';
import { calculateAsymmetryIndex, getAsymmetryLevel } from '@/types/sensor';
import { cn } from '@/lib/utils';

interface AsymmetryIndexCardProps {
  heelPressure: number;
  forefootPressure: number;
  className?: string;
}

/**
 * Pressure Asymmetry Index Card
 * 
 * Helps clinicians identify improper load distribution between heel and forefoot.
 * Formula: |Heel - Forefoot| / (Heel + Forefoot) × 100
 * 
 * ESP32 INTEGRATION: Heel and forefoot pressure will come from WiFi sensor data
 */
export function AsymmetryIndexCard({ heelPressure, forefootPressure, className }: AsymmetryIndexCardProps) {
  const asymmetryIndex = calculateAsymmetryIndex(heelPressure, forefootPressure);
  const level = getAsymmetryLevel(asymmetryIndex);

  const getColorClasses = () => {
    switch (level) {
      case 'normal':
        return {
          border: 'border-green-500/50',
          bg: 'bg-green-500/10',
          text: 'text-green-600 dark:text-green-400',
          badge: 'bg-green-500/20 text-green-700 dark:text-green-300',
        };
      case 'moderate':
        return {
          border: 'border-yellow-500/50',
          bg: 'bg-yellow-500/10',
          text: 'text-yellow-600 dark:text-yellow-400',
          badge: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300',
        };
      case 'severe':
        return {
          border: 'border-destructive/50',
          bg: 'bg-destructive/10',
          text: 'text-destructive',
          badge: 'bg-destructive/20 text-destructive',
        };
    }
  };

  const getInterpretation = () => {
    switch (level) {
      case 'normal':
        return 'Normal pressure distribution between heel and forefoot.';
      case 'moderate':
        return 'Moderate imbalance detected between heel and forefoot.';
      case 'severe':
        return 'Severe imbalance detected. Prosthetic alignment review recommended.';
    }
  };

  const colors = getColorClasses();

  return (
    <Card className={cn('transition-colors', colors.border, className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Scale className="h-4 w-4" />
          Pressure Asymmetry Index
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={cn('rounded-lg p-4 text-center', colors.bg)}>
          <div className={cn('text-4xl font-bold', colors.text)}>
            {asymmetryIndex.toFixed(1)}%
          </div>
          <div className={cn('inline-block mt-2 px-2 py-0.5 rounded text-xs font-medium', colors.badge)}>
            {level === 'normal' ? 'Normal' : level === 'moderate' ? 'Moderate' : 'Severe'}
          </div>
        </div>
        <p className="mt-3 text-xs text-muted-foreground text-center">
          {getInterpretation()}
        </p>
      </CardContent>
    </Card>
  );
}
