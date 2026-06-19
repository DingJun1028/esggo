/**
 * 📴 Offline Hook - 離線支援
 * 支援網路狀態檢測、離線資料儲存、請求佇列
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Wifi, WifiOff, RefreshCw, Save, CloudOff, CloudCheck } from 'lucide-react';

// ==================== 類型定義 ====================

export interface PendingAction {
  id: string;
  type: 'request' | 'mutation' | 'sync';
  payload: unknown;
  timestamp: number;
  retryCount: number;
  maxRetries?: number;
}

export interface OfflineState {
  isOnline: boolean;
  wasOffline: boolean;
  lastOnlineTime: number | null;
  pendingActions: PendingAction[];
}

export interface OfflineStore extends OfflineState {
  // 網路狀態
  setOnline: (status: boolean) => void;

  // 待處理動作
  addPendingAction: (action: Omit<PendingAction, 'id' | 'timestamp' | 'retryCount'>) => string;
  removePendingAction: (id: string) => void;
  clearPendingActions: () => void;

  // 重試
  incrementRetryCount: (id: string) => void;
  resetRetryCount: (id: string) => void;

  // 同步
  syncPendingActions: () => Promise<void>;
}

// ==================== Zustand Store ====================

const createOfflineStorage = () => {
  try {
    return {
      getItem: (name: string): string | null => {
        try {
          const item = localStorage.getItem(name);
          return item;
        } catch {
          return null;
        }
      },
      setItem: (name: string, value: string): void => {
        try {
          localStorage.setItem(name, value);
        } catch (e) {
          console.warn('Failed to persist offline data:', e);
        }
      },
      removeItem: (name: string): void => {
        try {
          localStorage.removeItem(name);
        } catch (e) {
          console.warn('Failed to remove offline data:', e);
        }
      },
    };
  } catch {
    return localStorage;
  }
};

export const useOfflineStore = create<OfflineStore>()(
  persist(
    (set, get) => ({
      isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
      wasOffline: false,
      lastOnlineTime: null,
      pendingActions: [],

      setOnline: (status) => {
        set((state) => ({
          isOnline: status,
          wasOffline: !status ? true : state.wasOffline,
          lastOnlineTime: status ? Date.now() : state.lastOnlineTime,
        }));

        // 當恢復網路時，自動同步
        if (status) {
          get().syncPendingActions();
        }
      },

      addPendingAction: (action) => {
        const id = `action-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const newAction: PendingAction = {
          ...action,
          id,
          timestamp: Date.now(),
          retryCount: 0,
        };

        set((state) => ({
          pendingActions: [...state.pendingActions, newAction],
        }));

        return id;
      },

      removePendingAction: (id) => {
        set((state) => ({
          pendingActions: state.pendingActions.filter((a) => a.id !== id),
        }));
      },

      clearPendingActions: () => {
        set({ pendingActions: [] });
      },

      incrementRetryCount: (id) => {
        set((state) => ({
          pendingActions: state.pendingActions.map((a) =>
            a.id === id ? { ...a, retryCount: a.retryCount + 1 } : a
          ),
        }));
      },

      resetRetryCount: (id) => {
        set((state) => ({
          pendingActions: state.pendingActions.map((a) =>
            a.id === id ? { ...a, retryCount: 0 } : a
          ),
        }));
      },

      syncPendingActions: async () => {
        const { pendingActions, isOnline } = get();

        if (!isOnline || pendingActions.length === 0) return;

        const results = await Promise.allSettled(
          pendingActions.map(async (action) => {
            try {
              // 執行同步（由外部提供同步函數）
              await syncQueue.execute(action);
              return { success: true, id: action.id };
            } catch (error) {
              return { success: false, id: action.id, error };
            }
          })
        );

        // 移除成功的動作
        const successfulIds = results
          .filter((r) => r.status === 'fulfilled')
          .map((r) => (r as PromiseFulfilledResult<{ success: true; id: string }>).value.id);

        set((state) => ({
          pendingActions: state.pendingActions.filter(
            (a) => !successfulIds.includes(a.id)
          ),
        }));
      },
    }),
    {
      name: 'offline-storage',
      storage: createJSONStorage(() => createOfflineStorage()),
    }
  )
);

// ==================== 同步佇列管理器 ====================

const syncQueue = {
  executors: new Map<string, (payload: unknown) => Promise<unknown>>(),

  register: (type: string, executor: (payload: unknown) => Promise<unknown>) => {
    syncQueue.executors.set(type, executor);
  },

  execute: async (action: PendingAction): Promise<unknown> => {
    const executor = syncQueue.executors.get(action.type);
    if (!executor) {
      throw new Error(`No executor registered for action type: ${action.type}`);
    }
    return executor(action.payload);
  },
};

// ==================== 註冊同步函數 ====================

// API 請求同步
syncQueue.register('request', async (payload: unknown) => {
  const { url, options } = payload as { url: string; options: RequestInit };
  const response = await fetch(url, options);
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  return response.json();
});

// 突變同步
syncQueue.register('mutation', async (payload: unknown) => {
  const { service, method, args } = payload as {
    service: string;
    method: string;
    args: unknown[];
  };
  // 這裡應該調用實際的服務方法
  console.log('Syncing mutation:', { service, method, args });
  return { synced: true };
});

// ==================== Offline Hook ====================

export interface UseOfflineOptions {
  /** 自動同步 */
  autoSync?: boolean;
  /** 同步間隔（毫秒） */
  syncInterval?: number;
  /** 最大重試次數 */
  maxRetries?: number;
  /** 同步完成回調 */
  onSyncComplete?: (success: boolean, count: number) => void;
  /** 網路狀態改變回調 */
  onStatusChange?: (isOnline: boolean) => void;
}

export function useOffline(options: UseOfflineOptions = {}) {
  const {
    autoSync = true,
    syncInterval = 30000,
    maxRetries = 3,
    onSyncComplete,
    onStatusChange,
  } = options;

  const {
    isOnline,
    wasOffline,
    lastOnlineTime,
    pendingActions,
    setOnline,
    syncPendingActions,
  } = useOfflineStore();

  const syncTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 網路狀態監聽
  useEffect(() => {
    const handleOnline = () => {
      setOnline(true);
      onStatusChange?.(true);
    };

    const handleOffline = () => {
      setOnline(false);
      onStatusChange?.(false);
    };

    // 檢查瀏覽器支援
    if (typeof window !== 'undefined') {
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      // 初始化狀態
      setOnline(navigator.onLine);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setOnline, onStatusChange]);

  // 自動同步
  useEffect(() => {
    if (autoSync && isOnline && pendingActions.length > 0) {
      syncTimerRef.current = setInterval(() => {
        syncPendingActions().then(() => {
          if (pendingActions.length > 0) {
            onSyncComplete?.(false, pendingActions.length);
          } else {
            onSyncComplete?.(true, 0);
          }
        });
      }, syncInterval);
    }

    return () => {
      if (syncTimerRef.current) {
        clearInterval(syncTimerRef.current);
      }
    };
  }, [autoSync, isOnline, pendingActions, syncInterval, syncPendingActions, onSyncComplete]);

  // 添加待處理動作
  const queueAction = useCallback(
    (action: Omit<PendingAction, 'id' | 'timestamp' | 'retryCount'>) => {
      const id = useOfflineStore.getState().addPendingAction(action);
      return id;
    },
    []
  );

  // 手動同步
  const sync = useCallback(async () => {
    if (!isOnline) return false;

    const count = pendingActions.length;
    await syncPendingActions();
    const success = pendingActions.length === 0;
    onSyncComplete?.(success, count);
    return success;
  }, [isOnline, pendingActions, syncPendingActions, onSyncComplete]);

  // 清除待處理動作
  const clearQueue = useCallback(() => {
    useOfflineStore.getState().clearPendingActions();
  }, []);

  return {
    isOnline,
    wasOffline,
    lastOnlineTime,
    pendingCount: pendingActions.length,
    pendingActions,
    queueAction,
    sync,
    clearQueue,
  };
}

// ==================== IndexedDB 儲存 ====================

const DB_NAME = 'offline-storage';
const DB_VERSION = 1;
const STORE_NAME = 'data';

interface DB {
  db: IDBDatabase | null;
  open: () => Promise<void>;
  put: (key: string, value: unknown) => Promise<void>;
  get: <T>(key: string) => Promise<T | null>;
  delete: (key: string) => Promise<void>;
  clear: () => Promise<void>;
  getAll: <T>() => Promise<T[]>;
}

const useIndexedDB = (): DB => {
  const dbRef = useRef<IDBDatabase | null>(null);

  const open = useCallback(async () => {
    if (dbRef.current) return;

    return new Promise<void>((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        dbRef.current = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'key' });
        }
      };
    });
  }, []);

  const put = useCallback(async (key: string, value: unknown) => {
    await open();
    if (!dbRef.current) return;

    return new Promise<void>((resolve, reject) => {
      const transaction = dbRef.current!.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put({ key, value, timestamp: Date.now() });

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }, [open]);

  const get = useCallback(async <T extends unknown>(key: string): Promise<T | null> => {
    await open();
    if (!dbRef.current) return null;

    return new Promise<T | null>((resolve, reject) => {
      const transaction = dbRef.current!.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result?.value || null);
    });
  }, [open]);

  const delete_ = useCallback(async (key: string) => {
    await open();
    if (!dbRef.current) return;

    return new Promise<void>((resolve, reject) => {
      const transaction = dbRef.current!.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }, [open]);

  const clear = useCallback(async () => {
    await open();
    if (!dbRef.current) return;

    return new Promise<void>((resolve, reject) => {
      const transaction = dbRef.current!.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }, [open]);

  const getAll = useCallback(async <T extends unknown>(): Promise<T[]> => {
    await open();
    if (!dbRef.current) return [];

    return new Promise<T[]>((resolve, reject) => {
      const transaction = dbRef.current!.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result?.map((r) => r.value) || []);
    });
  }, [open]);

  return { db: dbRef.current, open, put, get, delete: delete_, clear, getAll };
};

// ==================== Offline Data Hook ====================

export function useOfflineData<T>(key: string, initialValue: T) {
  const [data, setData] = useState<T>(initialValue);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const db = useIndexedDB();

  // 載入資料
  useEffect(() => {
    const loadData = async () => {
      try {
        const stored = await db.get<T>(key);
        if (stored !== null) {
          setData(stored);
        }
      } catch (error) {
        console.error('Failed to load offline data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [db, key]);

  // 儲存資料
  const save = useCallback(
    async (value: T) => {
      setIsSaving(true);
      try {
        await db.put(key, value);
        setData(value);
      } catch (error) {
        console.error('Failed to save offline data:', error);
      } finally {
        setIsSaving(false);
      }
    },
    [db, key]
  );

  // 刪除資料
  const remove = useCallback(async () => {
    setIsSaving(true);
    try {
      await db.delete(key);
      setData(initialValue);
    } catch (error) {
      console.error('Failed to remove offline data:', error);
    } finally {
      setIsSaving(false);
    }
  }, [db, key, initialValue]);

  return { data, save, remove, isLoading, isSaving };
}

// ==================== 離線狀態指示器 ====================

export const OfflineIndicator: React.FC = () => {
  const { isOnline, pendingCount, sync } = useOffline({ autoSync: false });

  if (isOnline && pendingCount === 0) return null;

  return (
    <div
      className={`
        fixed bottom-4 left-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg
        ${isOnline ? 'bg-yellow-50 border border-yellow-200' : 'bg-red-50 border border-red-200'}
      `}
    >
      {isOnline ? (
        <CloudCheck className="w-5 h-5 text-yellow-600" />
      ) : (
        <CloudOff className="w-5 h-5 text-red-600" />
      )}

      <div className="flex-1">
        <p className={`text-sm font-medium ${isOnline ? 'text-yellow-800' : 'text-red-800'}`}>
          {isOnline ? '有待同步的資料' : '您目前處於離線狀態'}
        </p>
        {pendingCount > 0 && (
          <p className="text-xs text-gray-500">{pendingCount} 個項目待處理</p>
        )}
      </div>

      {isOnline && pendingCount > 0 && (
        <button
          onClick={() => sync()}
          className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw size={14} />
          同步
        </button>
      )}
    </div>
  );
};

// ==================== 註冊同步函數工具 ====================

export const registerSyncExecutor = (
  type: 'request' | 'mutation' | 'sync',
  executor: (payload: unknown) => Promise<unknown>
) => {
  syncQueue.register(type, executor);
};

export default useOffline;
