import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigation } from '@/components/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  MapPin, 
  Bell, 
  Palette, 
  Trash2, 
  Download,
  Globe,
  Sprout,
  Save,
  Wifi,
  WifiOff,
  HardDrive,
  RefreshCw,
  Sun,
  Moon,
  Monitor,
  Mail
} from 'lucide-react';
import { toast } from 'sonner';
import { LanguageSelector } from '@/components/language-selector';
import { useOffline, getCacheSize, clearAllCache } from '@/hooks/use-offline';
import { getStorageEstimate } from '@/lib/offline-storage';
import { useTheme } from '@/hooks/use-theme';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface UserProfile {
  farmName: string;
  location: string;
  crops: string[];
  notifications: boolean;
  darkMode: boolean;
}

const defaultProfile: UserProfile = {
  farmName: '',
  location: '',
  crops: [],
  notifications: true,
  darkMode: false
};

const popularCrops = [
  'Tomato', 'Corn', 'Rice', 'Wheat', 'Potato', 'Pepper', 
  'Cucumber', 'Cassava', 'Banana', 'Coffee', 'Mango', 'Soybean'
];

export default function Settings() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [newCrop, setNewCrop] = useState('');
  const [cacheSize, setCacheSize] = useState<string>('0 KB');
  const [emailDigestEnabled, setEmailDigestEnabled] = useState(true);
  const { isOnline, isOfflineReady } = useOffline();
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    // Calculate cache size
    const updateCacheSize = async () => {
      const localStorageSize = getCacheSize();
      const estimate = await getStorageEstimate();
      const totalBytes = localStorageSize + (estimate?.used || 0);
      
      if (totalBytes < 1024) {
        setCacheSize(`${totalBytes} B`);
      } else if (totalBytes < 1024 * 1024) {
        setCacheSize(`${(totalBytes / 1024).toFixed(1)} KB`);
      } else {
        setCacheSize(`${(totalBytes / (1024 * 1024)).toFixed(1)} MB`);
      }
    };
    updateCacheSize();
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('myfarm-profile');
    if (saved) {
      try {
        setProfile(JSON.parse(saved));
      } catch {
        setProfile(defaultProfile);
      }
    }
    
    // Fetch email digest preference from database
    const fetchEmailDigest = async () => {
      if (!user) return;
      const { data } = await supabase
        .from('profiles')
        .select('email_digest_enabled')
        .eq('user_id', user.id)
        .maybeSingle();
      if (data) {
        setEmailDigestEnabled(data.email_digest_enabled ?? true);
      }
    };
    fetchEmailDigest();
  }, [user]);

  const saveProfile = async () => {
    localStorage.setItem('myfarm-profile', JSON.stringify(profile));
    
    // Save email digest preference to database
    if (user) {
      await supabase
        .from('profiles')
        .update({ email_digest_enabled: emailDigestEnabled })
        .eq('user_id', user.id);
    }
    
    toast.success(t('settings.saved', 'Settings saved successfully!'));
  };

  const toggleEmailDigest = async (enabled: boolean) => {
    setEmailDigestEnabled(enabled);
    if (user) {
      await supabase
        .from('profiles')
        .update({ email_digest_enabled: enabled })
        .eq('user_id', user.id);
    }
  };

  const addCrop = (crop: string) => {
    if (crop && !profile.crops.includes(crop)) {
      setProfile({ ...profile, crops: [...profile.crops, crop] });
      setNewCrop('');
    }
  };

  const removeCrop = (crop: string) => {
    setProfile({ ...profile, crops: profile.crops.filter(c => c !== crop) });
  };

  const clearHistory = () => {
    localStorage.removeItem('myfarm-scan-history');
    toast.success(t('settings.historyCleared', 'Scan history cleared!'));
  };

  const exportData = () => {
    const data = {
      profile,
      history: JSON.parse(localStorage.getItem('myfarm-scan-history') || '[]')
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'myfarm-data.json';
    a.click();
    URL.revokeObjectURL(url);
    toast.success(t('settings.exported', 'Data exported successfully!'));
  };

  const handleClearCache = () => {
    if (confirm(t('settings.confirmClearCache', 'Are you sure you want to clear all cached data?'))) {
      clearAllCache();
      setCacheSize('0 KB');
      toast.success(t('settings.cacheCleared', 'Cache cleared successfully!'));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <User className="h-8 w-8 text-primary" />
            {t('settings.title', 'Profile & Settings')}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t('settings.subtitle', 'Manage your farm profile and app preferences')}
          </p>
        </div>

        <div className="space-y-6">
          {/* Farm Profile */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sprout className="h-5 w-5 text-primary" />
                {t('settings.farmProfile', 'Farm Profile')}
              </CardTitle>
              <CardDescription>
                {t('settings.farmProfileDesc', 'Tell us about your farm for personalized recommendations')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="farmName">{t('settings.farmName', 'Farm Name')}</Label>
                <Input
                  id="farmName"
                  placeholder={t('settings.farmNamePlaceholder', 'Enter your farm name')}
                  value={profile.farmName}
                  onChange={(e) => setProfile({ ...profile, farmName: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {t('settings.location', 'Location')}
                </Label>
                <Input
                  id="location"
                  placeholder={t('settings.locationPlaceholder', 'e.g., Central Kenya, Southern Nigeria')}
                  value={profile.location}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Crops */}
          <Card>
            <CardHeader>
              <CardTitle>{t('settings.yourCrops', 'Your Crops')}</CardTitle>
              <CardDescription>
                {t('settings.cropsDesc', 'Select crops you grow to get relevant disease alerts')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {profile.crops.map((crop) => (
                  <Badge 
                    key={crop} 
                    variant="secondary"
                    className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                    onClick={() => removeCrop(crop)}
                  >
                    {crop} ×
                  </Badge>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder={t('settings.addCrop', 'Add a crop...')}
                  value={newCrop}
                  onChange={(e) => setNewCrop(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addCrop(newCrop)}
                />
                <Button onClick={() => addCrop(newCrop)} size="sm">
                  {t('settings.add', 'Add')}
                </Button>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground mb-2 block">
                  {t('settings.popularCrops', 'Popular crops (click to add)')}
                </Label>
                <div className="flex flex-wrap gap-2">
                  {popularCrops.filter(c => !profile.crops.includes(c)).slice(0, 8).map((crop) => (
                    <Badge 
                      key={crop} 
                      variant="outline"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                      onClick={() => addCrop(crop)}
                    >
                      + {crop}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                {t('settings.preferences', 'Preferences')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <Label>{t('settings.language', 'Language')}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t('settings.languageDesc', 'Choose your preferred language')}
                    </p>
                  </div>
                </div>
                <LanguageSelector />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {resolvedTheme === 'dark' ? (
                    <Moon className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <Sun className="h-5 w-5 text-muted-foreground" />
                  )}
                  <div>
                    <Label>{t('settings.theme', 'Theme')}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t('settings.themeDesc', 'Choose your preferred appearance')}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant={theme === 'light' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTheme('light')}
                    className="h-8 w-8 p-0"
                    title={t('settings.lightMode', 'Light')}
                  >
                    <Sun className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={theme === 'dark' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTheme('dark')}
                    className="h-8 w-8 p-0"
                    title={t('settings.darkMode', 'Dark')}
                  >
                    <Moon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={theme === 'system' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTheme('system')}
                    className="h-8 w-8 p-0"
                    title={t('settings.systemTheme', 'System')}
                  >
                    <Monitor className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <Label>{t('settings.emailDigest', 'Weekly Email Digest')}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t('settings.emailDigestDesc', 'Receive weekly updates about forum activity matching your crops')}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={emailDigestEnabled}
                  onCheckedChange={toggleEmailDigest}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <Label>{t('settings.notifications', 'Disease Alerts')}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t('settings.notificationsDesc', 'Get notified about outbreaks in your area')}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={profile.notifications}
                  onCheckedChange={(checked) => setProfile({ ...profile, notifications: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Offline & Cache */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {isOnline ? (
                  <Wifi className="h-5 w-5 text-green-500" />
                ) : (
                  <WifiOff className="h-5 w-5 text-amber-500" />
                )}
                {t('offline.offlineMode', 'Offline Mode')}
              </CardTitle>
              <CardDescription>
                {isOnline 
                  ? t('settings.onlineDesc', 'You are connected to the internet')
                  : t('settings.offlineDesc', 'You are offline. Cached data is available.')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <HardDrive className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <Label>{t('offline.cacheSize', 'Cache Size')}</Label>
                    <p className="text-sm text-muted-foreground">{cacheSize}</p>
                  </div>
                </div>
                <Badge variant={isOfflineReady ? 'success' : 'secondary'}>
                  {isOfflineReady ? t('offline.cached', 'Cached') : t('settings.notCached', 'Not cached')}
                </Badge>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <RefreshCw className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <Label>{t('offline.offlineFeatures', 'Offline Features')}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t('offline.viewCachedData', 'View cached disease library and scan history')}
                    </p>
                  </div>
                </div>
              </div>

              <Button 
                variant="outline" 
                onClick={handleClearCache} 
                className="w-full justify-start text-amber-600 hover:text-amber-700"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {t('offline.clearCache', 'Clear Cache')}
              </Button>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card>
            <CardHeader>
              <CardTitle>{t('settings.dataManagement', 'Data Management')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" onClick={exportData} className="w-full justify-start">
                <Download className="mr-2 h-4 w-4" />
                {t('settings.exportData', 'Export My Data')}
              </Button>
              
              <Button variant="outline" onClick={clearHistory} className="w-full justify-start text-destructive hover:text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                {t('settings.clearHistory', 'Clear Scan History')}
              </Button>
            </CardContent>
          </Card>

          {/* Save Button */}
          <Button onClick={saveProfile} size="lg" className="w-full">
            <Save className="mr-2 h-4 w-4" />
            {t('settings.saveSettings', 'Save Settings')}
          </Button>
        </div>
      </main>
    </div>
  );
}
