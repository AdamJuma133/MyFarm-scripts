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
  Save
} from 'lucide-react';
import { toast } from 'sonner';
import { LanguageSelector } from '@/components/language-selector';

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
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [newCrop, setNewCrop] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('myfarm-profile');
    if (saved) {
      try {
        setProfile(JSON.parse(saved));
      } catch {
        setProfile(defaultProfile);
      }
    }
  }, []);

  const saveProfile = () => {
    localStorage.setItem('myfarm-profile', JSON.stringify(profile));
    toast.success(t('settings.saved', 'Settings saved successfully!'));
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
