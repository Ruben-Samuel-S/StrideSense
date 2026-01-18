import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertCircle, XCircle, Stethoscope } from 'lucide-react';
import { cn } from '@/lib/utils';
import { COPData } from '@/hooks/useSensorData';

interface ClinicalInterpretationPanelProps {
  asymmetryIndex: number;
  peakHeel: number;
  peakForefoot: number;
  copHistory: COPData[];
  className?: string;
}

interface ClinicalInsight {
  severity: 'info' | 'warning' | 'critical';
  message: string;
}

/**
 * Clinical Interpretation Panel
 * 
 * Translates sensor data into clinician-friendly insights using rule-based logic.
 * Displays 2-4 dynamic insights with severity indicators.
 * 
 * ESP32 INTEGRATION: Insights generated from real-time WiFi sensor data analysis
 */
export function ClinicalInterpretationPanel({ 
  asymmetryIndex, 
  peakHeel, 
  peakForefoot, 
  copHistory,
  className 
}: ClinicalInterpretationPanelProps) {
  
  // Analyze COP trend stability
  const analyzeCOPTrend = (): 'stable' | 'irregular' => {
    if (copHistory.length < 10) return 'stable';
    
    // Calculate variance in COP changes
    let jumpCount = 0;
    for (let i = 1; i < copHistory.length; i++) {
      const diff = Math.abs(copHistory[i].position - copHistory[i - 1].position);
      if (diff > 80) jumpCount++; // Significant jump threshold
    }
    
    return jumpCount > copHistory.length * 0.15 ? 'irregular' : 'stable';
  };

  const generateInsights = (): ClinicalInsight[] => {
    const insights: ClinicalInsight[] = [];
    const copTrend = analyzeCOPTrend();

    // Asymmetry analysis
    if (asymmetryIndex > 40) {
      insights.push({
        severity: 'critical',
        message: 'Severe pressure imbalance detected – prosthetic alignment review recommended',
      });
    } else if (asymmetryIndex > 20) {
      insights.push({
        severity: 'warning',
        message: 'Moderate gait imbalance observed between heel and forefoot',
      });
    } else if (asymmetryIndex > 0) {
      insights.push({
        severity: 'info',
        message: 'Pressure distribution within normal clinical range',
      });
    }

    // Peak pressure analysis
    if (peakForefoot > 450) {
      insights.push({
        severity: 'critical',
        message: 'High forefoot loading detected – elevated ulcer risk present',
      });
    } else if (peakForefoot > 300) {
      insights.push({
        severity: 'warning',
        message: 'Forefoot pressure approaching caution threshold',
      });
    }

    if (peakHeel > 450) {
      insights.push({
        severity: 'critical',
        message: 'Excessive heel strike force detected – potential impact injury risk',
      });
    } else if (peakHeel > 300) {
      insights.push({
        severity: 'warning',
        message: 'Elevated heel pressure observed during stance phase',
      });
    }

    // COP trend analysis
    if (copTrend === 'irregular') {
      insights.push({
        severity: 'warning',
        message: 'Unstable gait pattern observed – irregular weight transfer detected',
      });
    }

    // Ensure we have at least one insight
    if (insights.length === 0) {
      insights.push({
        severity: 'info',
        message: 'All parameters within normal limits – continue monitoring',
      });
    }

    // Limit to 4 most critical insights
    return insights.slice(0, 4);
  };

  const insights = generateInsights();

  const getIcon = (severity: ClinicalInsight['severity']) => {
    switch (severity) {
      case 'info':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'critical':
        return <XCircle className="h-4 w-4 text-destructive" />;
    }
  };

  const getBackgroundClass = (severity: ClinicalInsight['severity']) => {
    switch (severity) {
      case 'info':
        return 'bg-green-500/10 border-green-500/30';
      case 'warning':
        return 'bg-yellow-500/10 border-yellow-500/30';
      case 'critical':
        return 'bg-destructive/10 border-destructive/30';
    }
  };

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Stethoscope className="h-5 w-5" />
          Clinical Interpretation (Auto-Generated)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {insights.map((insight, index) => (
            <div
              key={index}
              className={cn(
                'flex items-start gap-3 p-3 rounded-lg border',
                getBackgroundClass(insight.severity)
              )}
            >
              <div className="mt-0.5">{getIcon(insight.severity)}</div>
              <p className="text-sm">{insight.message}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-muted-foreground text-center">
          Insights are auto-generated from real-time sensor analysis. Always verify with clinical assessment.
        </p>
      </CardContent>
    </Card>
  );
}
