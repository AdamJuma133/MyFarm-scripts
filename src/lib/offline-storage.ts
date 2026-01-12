// Offline storage utilities using localStorage and IndexedDB

const DB_NAME = 'myfarm-offline-db';
const DB_VERSION = 1;

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
}

export const offlineDB = new OfflineDB();

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
