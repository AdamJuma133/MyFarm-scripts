import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Loader2, Camera, User, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface AvatarUploadProps {
  userId: string;
  currentAvatarUrl: string | null;
  userName: string | null;
  onAvatarChange: (url: string | null) => void;
  size?: 'sm' | 'md' | 'lg';
}

export function AvatarUpload({ 
  userId, 
  currentAvatarUrl, 
  userName, 
  onAvatarChange,
  size = 'lg' 
}: AvatarUploadProps) {
  const { t } = useTranslation();
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: 'h-16 w-16',
    md: 'h-24 w-24',
    lg: 'h-32 w-32',
  };

  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error(t('profile.invalidImageType', 'Please select an image file'));
      return;
    }

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      toast.error(t('profile.imageTooLarge', 'Image must be less than 2MB'));
      return;
    }

    setUploading(true);
    try {
      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/avatar.${fileExt}`;

      // Delete existing avatar if present
      if (currentAvatarUrl) {
        const oldPath = currentAvatarUrl.split('/').slice(-2).join('/');
        await supabase.storage.from('avatars').remove([oldPath]);
      }

      // Upload new avatar
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Add cache-busting parameter
      const urlWithTimestamp = `${publicUrl}?t=${Date.now()}`;

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: urlWithTimestamp })
        .eq('user_id', userId);

      if (updateError) throw updateError;

      onAvatarChange(urlWithTimestamp);
      toast.success(t('profile.avatarUpdated', 'Profile picture updated'));
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error(t('profile.avatarUploadFailed', 'Failed to upload profile picture'));
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveAvatar = async () => {
    if (!currentAvatarUrl) return;

    setRemoving(true);
    try {
      // Extract file path from URL
      const urlParts = currentAvatarUrl.split('/');
      const filePath = `${userId}/avatar.${urlParts[urlParts.length - 1].split('.').pop()?.split('?')[0]}`;

      // Delete from storage
      await supabase.storage.from('avatars').remove([filePath]);

      // Update profile
      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: null })
        .eq('user_id', userId);

      if (error) throw error;

      onAvatarChange(null);
      toast.success(t('profile.avatarRemoved', 'Profile picture removed'));
    } catch (error) {
      console.error('Error removing avatar:', error);
      toast.error(t('profile.avatarRemoveFailed', 'Failed to remove profile picture'));
    } finally {
      setRemoving(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <Avatar className={cn(sizeClasses[size], 'border-4 border-background shadow-lg')}>
          <AvatarImage src={currentAvatarUrl || undefined} alt={userName || 'User'} />
          <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
            {getInitials(userName)}
          </AvatarFallback>
        </Avatar>
        
        {(uploading || removing) && (
          <div className="absolute inset-0 bg-background/80 rounded-full flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}

        {currentAvatarUrl && !uploading && !removing && (
          <button
            onClick={handleRemoveAvatar}
            className="absolute -top-1 -right-1 h-6 w-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center hover:bg-destructive/90 transition-colors"
            aria-label={t('profile.removeAvatar', 'Remove avatar')}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading || removing}
      />

      <Button
        variant="outline"
        size="sm"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading || removing}
        className="h-10 touch-manipulation"
      >
        {uploading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            {t('profile.uploading', 'Uploading...')}
          </>
        ) : (
          <>
            <Camera className="h-4 w-4 mr-2" />
            {currentAvatarUrl 
              ? t('profile.changePhoto', 'Change Photo')
              : t('profile.uploadPhoto', 'Upload Photo')}
          </>
        )}
      </Button>
    </div>
  );
}