 import { BottomNavigation } from './BottomNavigation';
 import { cn } from '@/lib/utils';
 
 interface MobileLayoutProps {
   children: React.ReactNode;
   className?: string;
 }
 
export function MobileLayout({ children, className }: MobileLayoutProps) {
   return (
     <div className="min-h-screen bg-background dark">
       <main className={cn('pb-20', className)}>
         {children}
       </main>
       <BottomNavigation />
     </div>
   );
 }