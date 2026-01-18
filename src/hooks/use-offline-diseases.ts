import { useState, useEffect, useCallback } from 'react';
import { diseases, Disease } from '@/data/diseases';
import { offlineDB } from '@/lib/offline-storage';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

interface UseOfflineDiseasesReturn {
  diseases: Disease[];
  isLoading: boolean;
  isCached: boolean;
  cacheDiseasesNow: () => Promise<void>;
  clearDiseaseCache: () => Promise<void>;
  getCacheStatus: () => Promise<{ cached: boolean; count: number }>;
}

const DISEASE_CACHE_KEY = 'diseases_cached';
const DISEASE_CACHE_TIMESTAMP_KEY = 'diseases_cached_at';

export function useOfflineDiseases(): UseOfflineDiseasesReturn {
  const { t } = useTranslation();
  const [cachedDiseases, setCachedDiseases] = useState<Disease[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCached, setIsCached] = useState(false);

  const loadCachedDiseases = useCallback(async () => {
    try {
      const cached = await offlineDB.getAll<Disease>('diseases');
      if (cached.length > 0) {
        setCachedDiseases(cached);
        setIsCached(true);
      } else {
        // Use in-memory diseases as fallback
        setCachedDiseases(diseases);
        setIsCached(false);
      }
    } catch (error) {
      console.error('Failed to load cached diseases:', error);
      setCachedDiseases(diseases);
      setIsCached(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCachedDiseases();
  }, [loadCachedDiseases]);

  const cacheDiseasesNow = useCallback(async () => {
    setIsLoading(true);
    try {
      // Clear existing cache
      await offlineDB.clear('diseases');
      
      // Cache all diseases
      for (const disease of diseases) {
        await offlineDB.put('diseases', disease);
      }
      
      // Store cache metadata
      localStorage.setItem(DISEASE_CACHE_KEY, 'true');
      localStorage.setItem(DISEASE_CACHE_TIMESTAMP_KEY, Date.now().toString());
      
      setCachedDiseases(diseases);
      setIsCached(true);
      toast.success(t('offline.diseasesCached', 'Disease library cached for offline use'));
    } catch (error) {
      console.error('Failed to cache diseases:', error);
      toast.error(t('offline.cacheFailed', 'Failed to cache disease library'));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  const clearDiseaseCache = useCallback(async () => {
    try {
      await offlineDB.clear('diseases');
      localStorage.removeItem(DISEASE_CACHE_KEY);
      localStorage.removeItem(DISEASE_CACHE_TIMESTAMP_KEY);
      setCachedDiseases(diseases);
      setIsCached(false);
      toast.success(t('offline.cacheCleared', 'Disease cache cleared'));
    } catch (error) {
      console.error('Failed to clear disease cache:', error);
    }
  }, [t]);

  const getCacheStatus = useCallback(async (): Promise<{ cached: boolean; count: number }> => {
    try {
      const cached = await offlineDB.getAll<Disease>('diseases');
      return { cached: cached.length > 0, count: cached.length };
    } catch {
      return { cached: false, count: 0 };
    }
  }, []);

  return {
    diseases: cachedDiseases.length > 0 ? cachedDiseases : diseases,
    isLoading,
    isCached,
    cacheDiseasesNow,
    clearDiseaseCache,
    getCacheStatus,
  };
}