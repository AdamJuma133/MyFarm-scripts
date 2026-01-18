import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  tag?: string;
  data?: unknown;
}

export function usePushNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if notifications are supported
    if ('Notification' in window) {
      setIsSupported(true);
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!isSupported) {
      console.log('Notifications not supported');
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }, [isSupported]);

  const sendNotification = useCallback(async (options: NotificationOptions): Promise<boolean> => {
    if (!isSupported) {
      // Fallback to toast notification
      toast.info(options.title, { description: options.body });
      return true;
    }

    if (permission !== 'granted') {
      const granted = await requestPermission();
      if (!granted) {
        // Fallback to toast
        toast.info(options.title, { description: options.body });
        return false;
      }
    }

    try {
      const notification = new Notification(options.title, {
        body: options.body,
        icon: options.icon || '/favicon.ico',
        tag: options.tag,
        data: options.data,
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      return true;
    } catch (error) {
      console.error('Error sending notification:', error);
      // Fallback to toast
      toast.info(options.title, { description: options.body });
      return false;
    }
  }, [isSupported, permission, requestPermission]);

  const notifySyncComplete = useCallback((syncedCount: number) => {
    if (syncedCount > 0) {
      sendNotification({
        title: 'Scans Synced',
        body: `${syncedCount} scan(s) have been analyzed and saved.`,
        tag: 'sync-complete',
      });
    }
  }, [sendNotification]);

  const notifyAnalysisComplete = useCallback((diseaseName: string, cropType: string) => {
    const isHealthy = diseaseName === 'Healthy';
    sendNotification({
      title: isHealthy ? 'Crop is Healthy!' : 'Analysis Complete',
      body: isHealthy 
        ? `Your ${cropType} appears to be in good health.`
        : `Disease detected: ${diseaseName} on your ${cropType}.`,
      tag: 'analysis-complete',
    });
  }, [sendNotification]);

  return {
    permission,
    isSupported,
    requestPermission,
    sendNotification,
    notifySyncComplete,
    notifyAnalysisComplete,
  };
}