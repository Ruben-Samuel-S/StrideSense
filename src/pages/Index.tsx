import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart3, Gauge, Footprints, Download, Shield } from 'lucide-react';
import logo from '@/assets/logo.png';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, isLoading, navigate]);

  const features = [
    {
      icon: Gauge,
      title: 'Real-Time Pressure',
      description: 'Monitor heel and forefoot pressure in real-time',
    },
    {
      icon: Footprints,
      title: 'Gait Analysis',
      description: 'Track stance and swing phases during walking',
    },
    {
      icon: BarChart3,
      title: 'Visual Analytics',
      description: 'Interactive charts with pressure thresholds',
    },
    {
      icon: Download,
      title: 'Data Export',
      description: 'Export session data to CSV for analysis',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/10 to-background" />
        <div className="container relative py-24 lg:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <img src={logo} alt="StrideSense" className="h-24 w-24" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              StrideSense <span className="text-primary">Prosthetics</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Real-time prosthetic limb pressure and gait monitoring system. 
              Track sensor data, analyze patterns, and optimize your mobility.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => navigate('/login')} className="gap-2">
                <Shield className="h-5 w-5" />
                Get Started
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/login')}>
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container py-16">
        <h2 className="text-2xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <Card key={feature.title} className="text-center">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-accent">
                    <feature.icon className="h-6 w-6 text-accent-foreground" />
                  </div>
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>StrideSense Prosthetics — Prosthetic Limb Monitoring System</p>
          <p className="mt-1">MVP Version • ESP32 WiFi Integration Pending</p>
        </div>
      </footer>
    </div>
  );
}
