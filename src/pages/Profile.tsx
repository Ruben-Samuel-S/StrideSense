import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Header } from '@/components/layout/Header';
import { useToast } from '@/hooks/use-toast';
import { getProfile, saveProfile, createProfile } from '@/services/profileService';
import { 
  UserProfile, 
  Gender, 
  ProstheticSide, 
  ActivityLevel,
  GENDER_LABELS,
  PROSTHETIC_SIDE_LABELS,
  ACTIVITY_LEVEL_LABELS 
} from '@/types/profile';
import { Loader2, Save, User } from 'lucide-react';

export default function Profile() {
  const [profile, setProfile] = useState<Partial<UserProfile>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const existingProfile = getProfile();
    if (existingProfile) {
      setProfile(existingProfile);
    }
    setIsLoading(false);
  }, []);

  const handleSave = async () => {
    if (!profile.name || !profile.age || !profile.gender || !profile.height || 
        !profile.weight || !profile.prostheticSide || !profile.activityLevel) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);

    try {
      if (profile.id) {
        saveProfile(profile as UserProfile);
      } else {
        createProfile({
          name: profile.name,
          age: profile.age,
          gender: profile.gender,
          height: profile.height,
          weight: profile.weight,
          prostheticSide: profile.prostheticSide,
          activityLevel: profile.activityLevel,
        });
      }

      toast({
        title: 'Profile Saved',
        description: 'Your profile has been updated successfully',
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>User Profile</CardTitle>
                <CardDescription>
                  Configure your profile for personalized gait analysis
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={profile.name || ''}
                  onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="John Doe"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Age *</Label>
                <Input
                  id="age"
                  type="number"
                  min={1}
                  max={120}
                  value={profile.age || ''}
                  onChange={(e) => setProfile(prev => ({ ...prev, age: parseInt(e.target.value) || undefined }))}
                  placeholder="35"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender *</Label>
                <Select
                  value={profile.gender || ''}
                  onValueChange={(value: Gender) => setProfile(prev => ({ ...prev, gender: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(GENDER_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="height">Height (cm) *</Label>
                <Input
                  id="height"
                  type="number"
                  min={50}
                  max={250}
                  value={profile.height || ''}
                  onChange={(e) => setProfile(prev => ({ ...prev, height: parseInt(e.target.value) || undefined }))}
                  placeholder="175"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg) *</Label>
                <Input
                  id="weight"
                  type="number"
                  min={20}
                  max={300}
                  value={profile.weight || ''}
                  onChange={(e) => setProfile(prev => ({ ...prev, weight: parseInt(e.target.value) || undefined }))}
                  placeholder="70"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="prostheticSide">Prosthetic Side *</Label>
                <Select
                  value={profile.prostheticSide || ''}
                  onValueChange={(value: ProstheticSide) => setProfile(prev => ({ ...prev, prostheticSide: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select side" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(PROSTHETIC_SIDE_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="activityLevel">Activity Level *</Label>
                <Select
                  value={profile.activityLevel || ''}
                  onValueChange={(value: ActivityLevel) => setProfile(prev => ({ ...prev, activityLevel: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select activity level" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(ACTIVITY_LEVEL_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => navigate('/dashboard')}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Profile
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* ESP32 Device Pairing Placeholder */}
        <Card className="max-w-2xl mx-auto mt-6 border-dashed">
          <CardHeader>
            <CardTitle className="text-muted-foreground">Device Pairing</CardTitle>
            <CardDescription>
              ESP32 device pairing will be added during backend integration.
              This feature will allow you to connect your prosthetic sensor device.
            </CardDescription>
          </CardHeader>
        </Card>
      </main>
    </div>
  );
}
