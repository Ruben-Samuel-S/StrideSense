import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Header() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Activity className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">ProStep Monitor</span>
        </Link>

        {isAuthenticated && (
          <nav className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">
                Dashboard
              </Button>
            </Link>
            <Link to="/profile">
              <Button variant="ghost" size="sm" className="gap-2">
                <User className="h-4 w-4" />
                {user?.name || 'Profile'}
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={logout}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </nav>
        )}
      </div>
    </header>
  );
}
