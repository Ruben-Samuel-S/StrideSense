 import { useState, useEffect } from 'react';
 import { useNavigate } from 'react-router-dom';
 import { MobileLayout } from '@/components/layout/MobileLayout';
 import { Card, CardContent } from '@/components/ui/card';
 import { Button } from '@/components/ui/button';
 import { ProfileStats } from '@/components/profile/ProfileStats';
 import { AchievementBadge } from '@/components/profile/AchievementBadge';
 import { useAuth } from '@/contexts/AuthContext';
 import { getProfile } from '@/services/profileService';
 import { UserProfile, PROSTHETIC_SIDE_LABELS, ACTIVITY_LEVEL_LABELS } from '@/types/profile';
 import { 
   User, 
   Settings, 
   Bluetooth, 
   Activity, 
   LogOut, 
   ChevronRight,
   Award,
   Target,
   Zap,
   Star,
   Footprints
 } from 'lucide-react';
 
 interface MenuItemProps {
   icon: React.ElementType;
   label: string;
   onClick?: () => void;
   variant?: 'default' | 'destructive';
 }
 
 function MenuItem({ icon: Icon, label, onClick, variant = 'default' }: MenuItemProps) {
   return (
     <button
       onClick={onClick}
       className={`flex items-center justify-between w-full p-4 text-left transition-colors hover:bg-muted/20 ${
         variant === 'destructive' ? 'text-destructive' : ''
       }`}
     >
       <div className="flex items-center gap-3">
         <Icon className="h-5 w-5" />
         <span className="font-medium">{label}</span>
       </div>
       <ChevronRight className="h-4 w-4 text-muted-foreground" />
     </button>
   );
 }
 
 export default function MobileProfile() {
   const [profile, setProfile] = useState<UserProfile | null>(null);
   const navigate = useNavigate();
   const { logout } = useAuth();
 
   useEffect(() => {
     const existingProfile = getProfile();
     if (existingProfile) {
       setProfile(existingProfile);
     }
   }, []);
 
   const achievements = [
     { icon: Footprints, title: 'First Steps', description: 'Complete your first session', unlocked: true },
     { icon: Target, title: 'Consistent Walker', description: '7-day recording streak', unlocked: true },
     { icon: Zap, title: 'Stability Pro', description: 'Maintain stable gait for 30 min', unlocked: false },
     { icon: Star, title: 'Perfect Balance', description: 'Asymmetry < 10% for a full session', unlocked: false },
   ];
 
   return (
     <MobileLayout>
       <div className="container py-4 space-y-4">
         {/* Profile Header */}
         <Card className="rounded-xl">
           <CardContent className="p-4">
             <div className="flex items-center gap-4">
               <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                 <User className="h-8 w-8 text-primary" />
               </div>
               <div className="flex-1">
                 <h2 className="text-xl font-bold">{profile?.name || 'User'}</h2>
                 <div className="flex flex-wrap gap-2 mt-1">
                   {profile?.prostheticSide && (
                     <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                       {PROSTHETIC_SIDE_LABELS[profile.prostheticSide]} Prosthetic
                     </span>
                   )}
                   {profile?.activityLevel && (
                     <span className="text-xs px-2 py-0.5 rounded-full bg-muted/30 text-muted-foreground">
                       {ACTIVITY_LEVEL_LABELS[profile.activityLevel]}
                     </span>
                   )}
                 </div>
               </div>
             </div>
           </CardContent>
         </Card>
 
         {/* Usage Stats */}
         <div>
           <h3 className="text-sm font-medium text-muted-foreground mb-2">Usage Statistics</h3>
           <ProfileStats
             totalSessions={24}
             usageTimeHours={18}
             avgStability="stable"
             streakDays={5}
           />
         </div>
 
         {/* Stability Trend */}
         <Card className="rounded-xl">
           <CardContent className="p-4">
             <div className="flex items-center justify-between mb-3">
               <h3 className="text-sm font-medium">Stability Trend</h3>
               <span className="text-xs text-primary">+12% this week</span>
             </div>
             <div className="flex items-end gap-1 h-16">
               {[40, 55, 45, 60, 70, 65, 80].map((height, i) => (
                 <div
                   key={i}
                   className="flex-1 rounded-t bg-primary/30"
                   style={{ height: `${height}%` }}
                 />
               ))}
             </div>
             <div className="flex justify-between mt-2 text-xs text-muted-foreground">
               <span>Mon</span>
               <span>Tue</span>
               <span>Wed</span>
               <span>Thu</span>
               <span>Fri</span>
               <span>Sat</span>
               <span>Sun</span>
             </div>
           </CardContent>
         </Card>
 
         {/* Achievements */}
         <div>
           <div className="flex items-center gap-2 mb-2">
             <Award className="h-4 w-4 text-primary" />
             <h3 className="text-sm font-medium">Achievements</h3>
           </div>
           <div className="space-y-2">
             {achievements.map((badge) => (
               <AchievementBadge key={badge.title} {...badge} />
             ))}
           </div>
         </div>
 
         {/* Menu Items */}
         <Card className="rounded-xl overflow-hidden">
           <MenuItem 
             icon={Settings} 
             label="Edit Profile" 
             onClick={() => navigate('/profile/edit')} 
           />
           <div className="border-t" />
           <MenuItem 
             icon={Bluetooth} 
             label="Device Calibration" 
           />
           <div className="border-t" />
           <MenuItem 
             icon={Activity} 
             label="Sensor Status" 
           />
           <div className="border-t" />
           <MenuItem 
             icon={LogOut} 
             label="Logout" 
             onClick={logout}
             variant="destructive"
           />
         </Card>
 
         {/* Device Info */}
         <Card className="rounded-xl border-dashed">
           <CardContent className="p-4 text-center">
             <Bluetooth className="h-6 w-6 text-primary mx-auto mb-2" />
             <p className="text-sm font-medium">ESP32 Sensor Connected</p>
             <p className="text-xs text-muted-foreground">Last sync: 2 minutes ago</p>
           </CardContent>
         </Card>
       </div>
     </MobileLayout>
   );
 }