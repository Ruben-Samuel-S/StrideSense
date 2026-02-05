 import { cn } from '@/lib/utils';
 import { LucideIcon } from 'lucide-react';
 
 interface AchievementBadgeProps {
   icon: LucideIcon;
   title: string;
   description: string;
   unlocked: boolean;
 }
 
 export function AchievementBadge({ icon: Icon, title, description, unlocked }: AchievementBadgeProps) {
   return (
     <div className={cn(
       'flex items-center gap-3 p-3 rounded-xl border transition-all',
       unlocked 
         ? 'bg-primary/10 border-primary/30' 
         : 'bg-muted/20 border-muted/30 opacity-50'
     )}>
       <div className={cn(
         'w-10 h-10 rounded-full flex items-center justify-center',
         unlocked ? 'bg-primary/20' : 'bg-muted/30'
       )}>
         <Icon className={cn('h-5 w-5', unlocked ? 'text-primary' : 'text-muted-foreground')} />
       </div>
       <div className="flex-1">
         <p className={cn('font-medium text-sm', !unlocked && 'text-muted-foreground')}>
           {title}
         </p>
         <p className="text-xs text-muted-foreground">{description}</p>
       </div>
     </div>
   );
 }