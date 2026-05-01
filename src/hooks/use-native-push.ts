import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { App as CapacitorApp } from '@capacitor/app';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import {
  consumePendingNavigation,
  resolvePushRoute,
  setPendingNavigation,
} from '@/lib/pending-navigation';

/**
 * Registers the device for native push notifications, stores the token in
 * the `device_tokens` table, and routes notification taps (including from
 * a terminated/cold-start state) to the correct screen.
 *
 * No-op on the web.
 */
export function useNativePush() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Drain any navigation queued before the router was ready (cold start).
  useEffect(() => {
    const pending = consumePendingNavigation();
    if (pending) {
      // Defer so the route tree is mounted.
      setTimeout(() => navigate(pending), 0);
    }
  }, [navigate]);

  useEffect(() => {
    if (!user) return;
    if (!Capacitor.isNativePlatform()) return;

    let removed = false;

    const handlePushPayload = (data: Record<string, unknown> | undefined) => {
      const route = resolvePushRoute(data);
      // If router is not ready (cold start), queue and let the effect above pick it up.
      try {
        navigate(route);
      } catch {
        setPendingNavigation(route);
      }
    };

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

        // Cold start: app was launched by tapping a notification.
        try {
          const delivered = await PushNotifications.getDeliveredNotifications();
          const launch = delivered?.notifications?.[0];
          if (launch?.data) {
            handlePushPayload(launch.data as Record<string, unknown>);
          }
        } catch {
          /* getDeliveredNotifications not critical */
        }

        // Also check Capacitor App launch URL (deep link variant).
        try {
          const launchUrl = await CapacitorApp.getLaunchUrl();
          if (launchUrl?.url) {
            try {
              const u = new URL(launchUrl.url);
              if (u.pathname && u.pathname !== '/') navigate(u.pathname);
            } catch {
              /* ignore non-URL */
            }
          }
        } catch {
          /* ignore */
        }
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
            { user_id: user.id, platform, token: value, updated_at: new Date().toISOString() },
            { onConflict: 'token' },
          );
        // Remember which token belongs to this device for sign-out cleanup.
        try { localStorage.setItem('myfarm_device_token', value); } catch { /* ignore */ }
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

    // User tapped a notification while app was running or backgrounded.
    const onAction = PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (action) => {
        const data = (action.notification?.data || {}) as Record<string, unknown>;
        handlePushPayload(data);
      },
    );

    register();

    return () => {
      removed = true;
      onRegistration.then((h) => h.remove()).catch(() => {});
      onError.then((h) => h.remove()).catch(() => {});
      onReceived.then((h) => h.remove()).catch(() => {});
      onAction.then((h) => h.remove()).catch(() => {});
    };
  }, [user, navigate]);
}
