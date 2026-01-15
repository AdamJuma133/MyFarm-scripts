// Offline storage utilities using localStorage and IndexedDB

const DB_NAME = 'myfarm-offline-db';
const DB_VERSION = 2; // Incremented for new stores

// Types for pending scans
export interface PendingScan {
  id: string;
  timestamp: number;
  imageName: string;
  imageData: string;
  status: 'pending' | 'syncing' | 'completed' | 'failed';
  retryCount: number;
}

export interface SyncResult {
  success: boolean;
  message: string;
  syncedCount: number;
}

// IndexedDB wrapper for larger data storage
class OfflineDB {
  private db: IDBDatabase | null = null;
  private dbPromise: Promise<IDBDatabase> | null = null;

  async getDB(): Promise<IDBDatabase> {
    if (this.db) return this.db;
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create object stores
        if (!db.objectStoreNames.contains('diseases')) {
          db.createObjectStore('diseases', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('scanHistory')) {
          db.createObjectStore('scanHistory', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('workshops')) {
          db.createObjectStore('workshops', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('images')) {
          db.createObjectStore('images', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
        // New stores for background sync
        if (!db.objectStoreNames.contains('pendingScans')) {
          const store = db.createObjectStore('pendingScans', { keyPath: 'id' });
          store.createIndex('status', 'status', { unique: false });
          store.createIndex('timestamp', 'timestamp', { unique: false });
        }
        if (!db.objectStoreNames.contains('syncMetadata')) {
          db.createObjectStore('syncMetadata', { keyPath: 'key' });
        }
      };
    });

    return this.dbPromise;
  }

  async put<T>(storeName: string, data: T): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async get<T>(storeName: string, id: string): Promise<T | undefined> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async getAll<T>(storeName: string): Promise<T[]> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async delete(storeName: string, id: string): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async clear(storeName: string): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  // Pending scans methods
  async addPendingScan(scan: Omit<PendingScan, 'id' | 'status' | 'retryCount'>): Promise<string> {
    const db = await this.getDB();
    const id = `scan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const pendingScan: PendingScan = {
      ...scan,
      id,
      status: 'pending',
      retryCount: 0,
    };

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['pendingScans'], 'readwrite');
      const store = transaction.objectStore('pendingScans');
      const request = store.add(pendingScan);
      
      request.onsuccess = () => resolve(id);
      request.onerror = () => reject(request.error);
    });
  }

  async getPendingScans(): Promise<PendingScan[]> {
    const db = await this.getDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['pendingScans'], 'readonly');
      const store = transaction.objectStore('pendingScans');
      const index = store.index('status');
      const request = index.getAll('pending');
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getAllPendingScans(): Promise<PendingScan[]> {
    const db = await this.getDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['pendingScans'], 'readonly');
      const store = transaction.objectStore('pendingScans');
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async updatePendingScan(id: string, updates: Partial<PendingScan>): Promise<void> {
    const db = await this.getDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['pendingScans'], 'readwrite');
      const store = transaction.objectStore('pendingScans');
      const getRequest = store.get(id);
      
      getRequest.onsuccess = () => {
        const scan = getRequest.result;
        if (scan) {
          const updated = { ...scan, ...updates };
          const putRequest = store.put(updated);
          putRequest.onsuccess = () => resolve();
          putRequest.onerror = () => reject(putRequest.error);
        } else {
          reject(new Error('Scan not found'));
        }
      };
      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  async deletePendingScan(id: string): Promise<void> {
    const db = await this.getDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['pendingScans'], 'readwrite');
      const store = transaction.objectStore('pendingScans');
      const request = store.delete(id);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clearCompletedScans(): Promise<void> {
    const db = await this.getDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['pendingScans'], 'readwrite');
      const store = transaction.objectStore('pendingScans');
      const index = store.index('status');
      const request = index.openCursor(IDBKeyRange.only('completed'));
      
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        } else {
          resolve();
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  async setLastSyncTime(time: number): Promise<void> {
    const db = await this.getDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['syncMetadata'], 'readwrite');
      const store = transaction.objectStore('syncMetadata');
      const request = store.put({ key: 'lastSyncTime', value: time });
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getLastSyncTime(): Promise<number | null> {
    const db = await this.getDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['syncMetadata'], 'readonly');
      const store = transaction.objectStore('syncMetadata');
      const request = store.get('lastSyncTime');
      
      request.onsuccess = () => resolve(request.result?.value || null);
      request.onerror = () => reject(request.error);
    });
  }
}

export const offlineDB = new OfflineDB();

// Background sync manager
class BackgroundSyncManager {
  private isSyncing = false;
  private syncCallbacks: ((result: SyncResult) => void)[] = [];

  async syncPendingScans(): Promise<SyncResult> {
    if (this.isSyncing) {
      return { success: false, message: 'Sync already in progress', syncedCount: 0 };
    }

    if (!navigator.onLine) {
      return { success: false, message: 'Device is offline', syncedCount: 0 };
    }

    this.isSyncing = true;
    let syncedCount = 0;

    try {
      const pendingScans = await offlineDB.getPendingScans();
      
      if (pendingScans.length === 0) {
        return { success: true, message: 'No pending scans to sync', syncedCount: 0 };
      }

      // Import supabase dynamically to avoid circular dependencies
      const { supabase } = await import('@/integrations/supabase/client');

      for (const scan of pendingScans) {
        if (!navigator.onLine) break;

        try {
          await offlineDB.updatePendingScan(scan.id, { status: 'syncing' });

          const { data: aiResult, error: aiError } = await supabase.functions.invoke('analyze-crop', {
            body: { imageData: scan.imageData }
          });

          if (aiError) {
            throw new Error(aiError.message);
          }

          // Save to history
          const historyItem = {
            id: Date.now().toString(),
            timestamp: scan.timestamp,
            imageName: scan.imageName,
            imageUrl: scan.imageData,
            disease: aiResult.isHealthy ? 'Healthy' : (aiResult.diseaseName || 'Unknown Disease'),
            type: aiResult.isHealthy ? 'healthy' : (aiResult.diseaseType || 'unknown'),
            confidence: `${Math.round(aiResult.confidence * 100)}%`,
            crop: aiResult.cropType
          };

          const existingHistory = localStorage.getItem('myfarm-scan-history');
          let history = [];
          
          if (existingHistory) {
            try {
              const parsed = JSON.parse(existingHistory);
              if (Array.isArray(parsed)) {
                history = parsed;
              }
            } catch {
              history = [];
            }
          }
          
          history.unshift(historyItem);
          localStorage.setItem('myfarm-scan-history', JSON.stringify(history));

          await offlineDB.updatePendingScan(scan.id, { status: 'completed' });
          syncedCount++;
        } catch (error) {
          console.error('Failed to sync scan:', scan.id, error);
          await offlineDB.updatePendingScan(scan.id, { 
            status: scan.retryCount >= 3 ? 'failed' : 'pending',
            retryCount: scan.retryCount + 1 
          });
        }
      }

      await offlineDB.setLastSyncTime(Date.now());
      await offlineDB.clearCompletedScans();

      const result: SyncResult = {
        success: true,
        message: `Synced ${syncedCount} scan(s)`,
        syncedCount
      };

      this.notifyCallbacks(result);
      return result;
    } catch (error) {
      console.error('Background sync failed:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Sync failed', 
        syncedCount 
      };
    } finally {
      this.isSyncing = false;
    }
  }

  onSyncComplete(callback: (result: SyncResult) => void): () => void {
    this.syncCallbacks.push(callback);
    return () => {
      this.syncCallbacks = this.syncCallbacks.filter(cb => cb !== callback);
    };
  }

  private notifyCallbacks(result: SyncResult): void {
    this.syncCallbacks.forEach(cb => cb(result));
  }

  get syncing(): boolean {
    return this.isSyncing;
  }
}

export const syncManager = new BackgroundSyncManager();

// Auto-sync when coming back online
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    console.log('[BackgroundSync] Device came online, syncing pending scans...');
    syncManager.syncPendingScans().then(result => {
      if (result.syncedCount > 0) {
        console.log(`[BackgroundSync] Synced ${result.syncedCount} pending scan(s)`);
      }
    });
  });
}

// Sync queue for offline actions
interface SyncAction {
  id: string;
  type: 'create' | 'update' | 'delete';
  store: string;
  data: unknown;
  timestamp: number;
}

const SYNC_QUEUE_KEY = 'myfarm-sync-queue';

export function addToSyncQueue(action: Omit<SyncAction, 'id' | 'timestamp'>) {
  const queue = getSyncQueue();
  queue.push({
    ...action,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
  });
  localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
}

export function getSyncQueue(): SyncAction[] {
  try {
    const queue = localStorage.getItem(SYNC_QUEUE_KEY);
    return queue ? JSON.parse(queue) : [];
  } catch {
    return [];
  }
}

export function clearSyncQueue() {
  localStorage.removeItem(SYNC_QUEUE_KEY);
}

export function removeFromSyncQueue(id: string) {
  const queue = getSyncQueue().filter((action) => action.id !== id);
  localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
}

// Image caching utilities
export async function cacheImage(id: string, blob: Blob): Promise<void> {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onloadend = async () => {
      try {
        await offlineDB.put('images', {
          id,
          data: reader.result,
          timestamp: Date.now(),
        });
        resolve();
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export async function getCachedImage(id: string): Promise<string | null> {
  try {
    const cached = await offlineDB.get<{ id: string; data: string }>('images', id);
    return cached?.data ?? null;
  } catch {
    return null;
  }
}

// Settings cache
export async function cacheSettings(settings: Record<string, unknown>): Promise<void> {
  await offlineDB.put('settings', { key: 'userSettings', ...settings });
}

export async function getCachedSettings(): Promise<Record<string, unknown> | null> {
  try {
    const cached = await offlineDB.get<Record<string, unknown>>('settings', 'userSettings');
    return cached ?? null;
  } catch {
    return null;
  }
}

// Check if we have cached data
export async function hasOfflineData(): Promise<boolean> {
  try {
    const diseases = await offlineDB.getAll('diseases');
    return diseases.length > 0;
  } catch {
    return false;
  }
}

// Get storage usage estimate
export async function getStorageEstimate(): Promise<{ used: number; quota: number } | null> {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    const estimate = await navigator.storage.estimate();
    return {
      used: estimate.usage ?? 0,
      quota: estimate.quota ?? 0,
    };
  }
  return null;
}
