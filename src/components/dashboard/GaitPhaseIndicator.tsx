import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GaitPhase } from '@/types/sensor';
import { cn } from '@/lib/utils';
import { Footprints } from 'lucide-react';

interface GaitPhaseIndicatorProps {
  phase: GaitPhase | null;
  className?: string;
}

export function GaitPhaseIndicator({ phase, className }: GaitPhaseIndicatorProps) {
  const isStance = phase === 'stance';
  const isSwing = phase === 'swing';

  return (
    <Card className={cn('transition-all duration-300', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Gait Phase
        </CardTitle>
        <Footprints className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flex gap-3">
          <div 
            className={cn(
              'flex-1 py-3 px-4 rounded-lg text-center font-semibold transition-all duration-300',
              isStance 
                ? 'bg-primary text-primary-foreground shadow-lg' 
                : 'bg-muted/50 text-muted-foreground'
            )}
          >
            Stance
          </div>
          <div 
            className={cn(
              'flex-1 py-3 px-4 rounded-lg text-center font-semibold transition-all duration-300',
              isSwing 
                ? 'bg-primary text-primary-foreground shadow-lg' 
                : 'bg-muted/50 text-muted-foreground'
            )}
          >
            Swing
          </div>
        </div>
        {!phase && (
          <p className="text-sm text-muted-foreground text-center mt-2">
            Start recording to see gait phase
          </p>
        )}
      </CardContent>
    </Card>
  );
}
