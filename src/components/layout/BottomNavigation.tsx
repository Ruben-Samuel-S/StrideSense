 import { Link, useLocation } from 'react-router-dom';
 import { LayoutDashboard, LineChart, FileText, User } from 'lucide-react';
 import { cn } from '@/lib/utils';
 
 const navItems = [
   { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
   { icon: LineChart, label: 'Analytics', path: '/analytics' },
   { icon: FileText, label: 'Reports', path: '/reports' },
   { icon: User, label: 'Profile', path: '/profile' },
 ];
 
 export function BottomNavigation() {
   const location = useLocation();
 
   return (
     <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 pb-safe">
       <div className="flex items-center justify-around h-16">
         {navItems.map((item) => {
           const isActive = location.pathname === item.path;
           return (
             <Link
               key={item.path}
               to={item.path}
               className={cn(
                 'flex flex-col items-center justify-center gap-1 px-4 py-2 transition-colors min-w-[64px]',
                 isActive 
                   ? 'text-primary' 
                   : 'text-muted-foreground hover:text-foreground'
               )}
             >
               <item.icon className={cn('h-5 w-5', isActive && 'text-primary')} />
               <span className="text-xs font-medium">{item.label}</span>
             </Link>
           );
         })}
       </div>
     </nav>
   );
 }