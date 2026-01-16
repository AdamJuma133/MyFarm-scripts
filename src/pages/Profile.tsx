import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, User, MapPin, Loader2, Save, Plus, X } from 'lucide-react';
import { MobileHeader } from '@/components/mobile-header';
import { BottomNavigation } from '@/components/bottom-navigation';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  farm_name: string | null;
  farm_location: string | null;
  farm_size: string | null;
  primary_crops: string[] | null;
}

const Profile = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [newCrop, setNewCrop] = useState('');
  
  // Form state
  const [fullName, setFullName] = useState('');
  const [farmName, setFarmName] = useState('');
  const [farmLocation, setFarmLocation] = useState('');
  const [farmSize, setFarmSize] = useState('');
  const [primaryCrops, setPrimaryCrops] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setProfile(data);
        setFullName(data.full_name || '');
        setFarmName(data.farm_name || '');
        setFarmLocation(data.farm_location || '');
        setFarmSize(data.farm_size || '');
        setPrimaryCrops(data.primary_crops || []);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error(t('profile.errorLoading'));
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName || null,
          farm_name: farmName || null,
          farm_location: farmLocation || null,
          farm_size: farmSize || null,
          primary_crops: primaryCrops.length > 0 ? primaryCrops : null,
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success(t('profile.saved'));
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error(t('profile.errorSaving'));
    } finally {
      setSaving(false);
    }
  };

  const handleAddCrop = () => {
    if (newCrop.trim() && !primaryCrops.includes(newCrop.trim())) {
      setPrimaryCrops([...primaryCrops, newCrop.trim()]);
      setNewCrop('');
    }
  };

  const handleRemoveCrop = (crop: string) => {
    setPrimaryCrops(primaryCrops.filter(c => c !== crop));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-secondary flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-secondary pb-20 md:pb-0">
      {/* Mobile Header */}
      <div className="md:hidden">
        <MobileHeader />
      </div>
      
      <div className="container mx-auto px-3 md:px-4 py-4 md:py-8 max-w-2xl">
        {/* Desktop header with back button */}
        <div className="hidden md:flex mb-6 items-center gap-4">
          <Button variant="ghost" onClick={() => navigate(-1)} className="h-11 touch-manipulation">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('common.back')}
          </Button>
          <h1 className="text-3xl font-bold">{t('profile.title')}</h1>
        </div>

        {/* Mobile header */}
        <div className="md:hidden mb-4">
          <h1 className="text-2xl font-bold">{t('profile.title')}</h1>
        </div>

        <div className="space-y-6">
          {/* Account Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {t('profile.accountInfo')}
              </CardTitle>
              <CardDescription>{t('profile.accountInfoDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t('auth.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="bg-muted"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fullName">{t('profile.fullName')}</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={t('profile.fullNamePlaceholder')}
                />
              </div>
            </CardContent>
          </Card>

          {/* Farm Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                {t('profile.farmDetails')}
              </CardTitle>
              <CardDescription>{t('profile.farmDetailsDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="farmName">{t('profile.farmName')}</Label>
                <Input
                  id="farmName"
                  value={farmName}
                  onChange={(e) => setFarmName(e.target.value)}
                  placeholder={t('profile.farmNamePlaceholder')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="farmLocation">{t('profile.farmLocation')}</Label>
                <Input
                  id="farmLocation"
                  value={farmLocation}
                  onChange={(e) => setFarmLocation(e.target.value)}
                  placeholder={t('profile.farmLocationPlaceholder')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="farmSize">{t('profile.farmSize')}</Label>
                <Input
                  id="farmSize"
                  value={farmSize}
                  onChange={(e) => setFarmSize(e.target.value)}
                  placeholder={t('profile.farmSizePlaceholder')}
                />
              </div>
              <div className="space-y-2">
                <Label>{t('profile.primaryCrops')}</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {primaryCrops.map((crop) => (
                    <Badge key={crop} variant="secondary" className="flex items-center gap-1">
                      {crop}
                      <button
                        type="button"
                        onClick={() => handleRemoveCrop(crop)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newCrop}
                    onChange={(e) => setNewCrop(e.target.value)}
                    placeholder={t('profile.addCropPlaceholder')}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCrop();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddCrop}
                    className="shrink-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button
            onClick={handleSave}
            disabled={saving}
            className="w-full h-12 text-base"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {t('profile.saving')}
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {t('profile.saveChanges')}
              </>
            )}
          </Button>
        </div>
      </div>
      
      {/* Bottom Navigation for Mobile */}
      <BottomNavigation />
    </div>
  );
};

export default Profile;
