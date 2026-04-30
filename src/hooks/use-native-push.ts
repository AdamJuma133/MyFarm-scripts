import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

/**
 * Registers the device for native push notifications and stores the token
 * in the `device_tokens` table so the backend can target this device later.
 *
 * No-op on the web.
 */
export function useNativePush() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    if (!Capacitor.isNativePlatform()) return;

    let removed = false;

    const register = async () => {
      try {
        const perm = await PushNotifications.checkPermissions();
        let status = perm.receive;
        if (status === 'prompt' || status === 'prompt-with-rationale') {
          const requested = await PushNotifications.requestPermissions();
          status = requested.receive;
        }
        if (status !== 'granted') return;

        await PushNotifications.register();
      } catch (err) {
        console.warn('Push registration failed:', err);
      }
    };

    const onRegistration = PushNotifications.addListener('registration', async ({ value }) => {
      if (removed) return;
      const platform = Capacitor.getPlatform() as 'ios' | 'android' | 'web';
      try {
        await supabase
          .from('device_tokens')
          .upsert(
            { user_id: user.id, platform, token: value },
            { onConflict: 'token' },
          );
      } catch (err) {
        console.warn('Failed to save push token:', err);
      }
    });

    const onError = PushNotifications.addListener('registrationError', (err) => {
      console.warn('Push registration error:', err);
    });

    const onReceived = PushNotifications.addListener(
      'pushNotificationReceived',
      (notification) => {
        toast.info(notification.title || 'Notification', {
          description: notification.body,
        });
      },
    );

    register();

    return () => {
      removed = true;
      onRegistration.then((h) => h.remove()).catch(() => {});
      onError.then((h) => h.remove()).catch(() => {});
      onReceived.then((h) => h.remove()).catch(() => {});
    };
  }, [user]);
}
