 import { Button } from '@/components/ui/button';
 import { Play, Square } from 'lucide-react';
 
 interface RecordingControlsProps {
   isRecording: boolean;
   readingsCount: number;
   onStartStop: () => void;
 }
 
 export function RecordingControls({ isRecording, readingsCount, onStartStop }: RecordingControlsProps) {
   return (
     <div className="flex items-center gap-3 p-4 rounded-xl bg-card border">
       <div className={`w-3 h-3 rounded-full ${isRecording ? 'bg-primary animate-pulse' : 'bg-muted'}`} />
       <div className="flex-1">
         <p className="font-medium text-sm">
           {isRecording ? 'Recording...' : 'Ready to record'}
         </p>
         {isRecording && (
           <p className="text-xs text-muted-foreground">{readingsCount} readings</p>
         )}
       </div>
       <Button 
         onClick={onStartStop}
         variant={isRecording ? 'destructive' : 'default'}
         size="sm"
         className="gap-2"
       >
         {isRecording ? (
           <>
             <Square className="h-4 w-4" />
             Stop
           </>
         ) : (
           <>
             <Play className="h-4 w-4" />
             Start
           </>
         )}
       </Button>
     </div>
   );
 }