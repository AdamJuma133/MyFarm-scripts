import { useState, useEffect, useCallback } from 'react';
import { offlineDB, syncManager, PendingScan, SyncResult } from '@/lib/offline-storage';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

interface UseBackgroundSyncReturn {
  pendingScans: PendingScan[];
  pendingCount: number;
  isSyncing: boolean;
  lastSyncTime: Date | null;
  addPendingScan: (imageName: string, imageData: string) => Promise<string>;
  syncNow: () => Promise<SyncResult>;
  clearPendingScans: () => Promise<void>;
  refreshPendingScans: () => Promise<void>;
}

export function useBackgroundSync(): UseBackgroundSyncReturn {
  const { t } = useTranslation();
  const [pendingScans, setPendingScans] = useState<PendingScan[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  const refreshPendingScans = useCallback(async () => {
    try {
      const scans = await offlineDB.getAllPendingScans();
      setPendingScans(scans.filter(s => s.status !== 'completed'));
      
      const syncTime = await offlineDB.getLastSyncTime();
      if (syncTime) {
        setLastSyncTime(new Date(syncTime));
      }
    } catch (error) {
      console.error('Failed to refresh pending scans:', error);
    }
  }, []);

  useEffect(() => {
    refreshPendingScans();

    // Subscribe to sync completion
    const unsubscribe = syncManager.onSyncComplete((result) => {
      if (result.syncedCount > 0) {
        toast.success(t('offline.syncComplete', `Synced ${result.syncedCount} scan(s)`));
      }
      refreshPendingScans();
      setIsSyncing(false);
    });

    // Listen for online status changes
    const handleOnline = () => {
      refreshPendingScans();
    };

    window.addEventListener('online', handleOnline);

    return () => {
      unsubscribe();
      window.removeEventListener('online', handleOnline);
    };
  }, [refreshPendingScans, t]);

  const addPendingScan = useCallback(async (imageName: string, imageData: string): Promise<string> => {
    const id = await offlineDB.addPendingScan({
      timestamp: Date.now(),
      imageName,
      imageData,
    });
    
    await refreshPendingScans();
    toast.info(t('offline.scanQueued', 'Scan queued for sync when online'));
    
    return id;
  }, [refreshPendingScans, t]);

  const syncNow = useCallback(async (): Promise<SyncResult> => {
    setIsSyncing(true);
    try {
      const result = await syncManager.syncPendingScans();
      await refreshPendingScans();
      return result;
    } finally {
      setIsSyncing(false);
    }
  }, [refreshPendingScans]);

  const clearPendingScans = useCallback(async () => {
    const scans = await offlineDB.getAllPendingScans();
    for (const scan of scans) {
      await offlineDB.deletePendingScan(scan.id);
    }
    await refreshPendingScans();
  }, [refreshPendingScans]);

  return {
    pendingScans,
    pendingCount: pendingScans.filter(s => s.status === 'pending').length,
    isSyncing,
    lastSyncTime,
    addPendingScan,
    syncNow,
    clearPendingScans,
    refreshPendingScans,
  };
}
