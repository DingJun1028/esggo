// 擴展性優化hooks
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';

// 虛擬化滾動hook
export const useVirtualScroll = <T>(
  items: T[],
  containerHeight: number,
  itemHeight: number,
  overscan: number = 5
) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);

  const totalHeight = items.length * itemHeight;

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const visibleItems = useMemo(() => {
    return items.slice(startIndex, endIndex + 1).map((item, index) => ({
      item,
      index: startIndex + index,
      style: {
        position: 'absolute' as const,
        top: (startIndex + index) * itemHeight,
        height: itemHeight,
        width: '100%'
      }
    }));
  }, [items, startIndex, endIndex, itemHeight]);

  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(event.currentTarget.scrollTop);
  }, []);

  useEffect(() => {
    if (containerRef) {
      containerRef.addEventListener('scroll', handleScroll as any, { passive: true });
      return () => {
        containerRef.removeEventListener('scroll', handleScroll as any);
      };
    }
  }, [containerRef, handleScroll]);

  return {
    containerRef: setContainerRef,
    totalHeight,
    visibleItems,
    startIndex,
    endIndex
  };
};

// 資源預載入hook
export const useResourcePreloader = () => {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const preloadedResources = useRef<Set<string>>(new Set());

  const preloadImage = useCallback((src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (preloadedResources.current.has(src)) {
        resolve();
        return;
      }

      setLoadingStates(prev => ({ ...prev, [src]: true }));

      const img = new Image();
      img.onload = () => {
        preloadedResources.current.add(src);
        setLoadingStates(prev => ({ ...prev, [src]: false }));
        resolve();
      };
      img.onerror = () => {
        setLoadingStates(prev => ({ ...prev, [src]: false }));
        reject(new Error(`Failed to preload image: ${src}`));
      };
      img.src = src;
    });
  }, []);

  const preloadScript = useCallback((src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (preloadedResources.current.has(src)) {
        resolve();
        return;
      }

      setLoadingStates(prev => ({ ...prev, [src]: true }));

      const script = document.createElement('script');
      script.onload = () => {
        preloadedResources.current.add(src);
        setLoadingStates(prev => ({ ...prev, [src]: false }));
        resolve();
      };
      script.onerror = () => {
        setLoadingStates(prev => ({ ...prev, [src]: false }));
        reject(new Error(`Failed to preload script: ${src}`));
      };
      script.src = src;
      document.head.appendChild(script);
    });
  }, []);

  const preloadResources = useCallback(async (resources: Array<{ type: 'image' | 'script'; src: string }>) => {
    const promises = resources.map(resource => {
      switch (resource.type) {
        case 'image':
          return preloadImage(resource.src);
        case 'script':
          return preloadScript(resource.src);
        default:
          return Promise.resolve();
      }
    });

    await Promise.allSettled(promises);
  }, [preloadImage, preloadScript]);

  const isLoading = useCallback((resource: string) => loadingStates[resource] || false, [loadingStates]);

  return {
    preloadImage,
    preloadScript,
    preloadResources,
    isLoading,
    loadedResources: Array.from(preloadedResources.current)
  };
};

// 代碼分割和懶載入hook
export const useLazyComponent = <T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>
) => {
  const [Component, setComponent] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadComponent = useCallback(async () => {
    if (Component || loading) return Component;

    setLoading(true);
    setError(null);

    try {
      const module = await importFunc();
      setComponent(() => module.default);
      return module.default;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [Component, loading]);

  const resetComponent = useCallback(() => {
    setComponent(null);
    setLoading(false);
    setError(null);
  }, []);

  return {
    Component,
    loading,
    error,
    loadComponent,
    resetComponent
  };
};

// 記憶化計算hook with 依賴追踪
export const useMemoizedComputation = <T>(
  computation: () => T,
  deps: React.DependencyList,
  options?: {
    maxAge?: number;
    onInvalidate?: () => void;
  }
): T => {
  const cache = useRef<{ value: T; deps: React.DependencyList; timestamp: number } | null>(null);
  const maxAge = options?.maxAge || 5 * 60 * 1000; // 5分鐘預設

  const depsChanged = useMemo(() => {
    if (!cache.current) return true;

    if (cache.current.deps.length !== deps.length) return true;

    for (let i = 0; i < deps.length; i++) {
      if (!Object.is(cache.current.deps[i], deps[i])) return true;
    }

    return false;
  }, deps);

  const needsRecalculation = depsChanged ||
    (cache.current && Date.now() - cache.current.timestamp > maxAge);

  if (needsRecalculation) {
    if (cache.current && options?.onInvalidate) {
      options.onInvalidate();
    }

    const value = computation();
    cache.current = {
      value,
      deps: [...deps],
      timestamp: Date.now()
    };
  }

  return cache.current!.value;
};

// 批次更新hook
export const useBatchUpdate = <T>(
  initialData: T,
  batchSize: number = 10,
  delay: number = 16 // 約60fps
) => {
  const [data, setData] = useState<T>(initialData);
  const updatesRef = useRef<Array<Partial<T>>>([]);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const batchUpdate = useCallback((update: Partial<T>) => {
    updatesRef.current.push(update);

    if (updatesRef.current.length >= batchSize) {
      flushUpdates();
    } else if (!timeoutRef.current) {
      timeoutRef.current = setTimeout(flushUpdates, delay);
    }
  }, [batchSize, delay]);

  const flushUpdates = useCallback(() => {
    if (updatesRef.current.length === 0) return;

    setData(prevData => {
      let result = { ...prevData };
      updatesRef.current.forEach(update => {
        result = { ...result, ...update };
      });
      return result;
    });

    updatesRef.current = [];

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    data,
    batchUpdate,
    flushUpdates,
    pendingUpdates: updatesRef.current.length
  };
};

// 服務端狀態同步hook
export const useServerState = <T>(
  key: string,
  initialData: T,
  options?: {
    syncInterval?: number;
    onSync?: (data: T) => void;
    onConflict?: (local: T, remote: T) => T;
  }
) => {
  const [data, setData] = useState<T>(initialData);
  const [lastSynced, setLastSynced] = useState<number>(Date.now());
  const [syncing, setSyncing] = useState(false);

  const syncInterval = options?.syncInterval || 30000; // 30秒

  // 模擬從服務端獲取數據
  const fetchFromServer = useCallback(async (): Promise<T> => {
    // 在實際應用中，這裡會調用API
    const stored = localStorage.getItem(`server_state_${key}`);
    return stored ? JSON.parse(stored) : initialData;
  }, [key, initialData]);

  // 模擬同步到服務端
  const syncToServer = useCallback(async (newData: T): Promise<void> => {
    // 在實際應用中，這裡會調用API
    localStorage.setItem(`server_state_${key}`, JSON.stringify(newData));
    localStorage.setItem(`server_state_timestamp_${key}`, Date.now().toString());
  }, [key]);

  const syncData = useCallback(async () => {
    if (syncing) return;

    setSyncing(true);
    try {
      const remoteData = await fetchFromServer();

      if (options?.onConflict) {
        const resolvedData = options.onConflict(data, remoteData);
        if (!Object.is(resolvedData, data)) {
          setData(resolvedData);
          await syncToServer(resolvedData);
        }
      } else {
        setData(remoteData);
      }

      setLastSynced(Date.now());
      options?.onSync?.(remoteData);
    } catch (error) {
      console.error('Failed to sync server state:', error);
    } finally {
      setSyncing(false);
    }
  }, [data, syncing, fetchFromServer, syncToServer, options]);

  const updateData = useCallback(async (newData: T | ((prev: T) => T)) => {
    const updatedData = typeof newData === 'function'
      ? (newData as (prev: T) => T)(data)
      : newData;

    setData(updatedData);
    await syncToServer(updatedData);
    setLastSynced(Date.now());
  }, [data, syncToServer]);

  useEffect(() => {
    // 初始同步
    syncData();

    // 定期同步
    const interval = setInterval(syncData, syncInterval);

    // 頁面可見性變化時同步
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        syncData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [syncData, syncInterval]);

  return {
    data,
    updateData,
    syncData,
    syncing,
    lastSynced
  };
};

// 效能優化hook - 防抖
export const useDebounce = <T extends any[]>(
  callback: (...args: T) => void,
  delay: number
) => {
  const timeoutRef = useRef<NodeJS.Timeout>();

  const debouncedCallback = useCallback((...args: T) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
};

// 效能優化hook - 節流
export const useThrottle = <T extends any[]>(
  callback: (...args: T) => void,
  delay: number
) => {
  const lastCallRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const throttledCallback = useCallback((...args: T) => {
    const now = Date.now();
    const timeSinceLastCall = now - lastCallRef.current;

    if (timeSinceLastCall >= delay) {
      callback(...args);
      lastCallRef.current = now;
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
        lastCallRef.current = Date.now();
      }, delay - timeSinceLastCall);
    }
  }, [callback, delay]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return throttledCallback;
};

// 動態import hook with 錯誤處理和重試
export const useDynamicImport = <T>(
  importFunc: () => Promise<T>,
  options?: {
    retryCount?: number;
    retryDelay?: number;
    onError?: (error: Error) => void;
  }
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const retryCount = options?.retryCount || 3;
  const retryDelay = options?.retryDelay || 1000;

  const loadData = useCallback(async (attempt: number = 0) => {
    setLoading(true);
    setError(null);

    try {
      const result = await importFunc();
      setData(result);
    } catch (err) {
      const error = err as Error;

      if (attempt < retryCount) {
        setTimeout(() => loadData(attempt + 1), retryDelay * (attempt + 1));
      } else {
        setError(error);
        options?.onError?.(error);
      }
    } finally {
      setLoading(false);
    }
  }, [importFunc, retryCount, retryDelay, options]);

  const retry = useCallback(() => {
    loadData(0);
  }, [loadData]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    data,
    loading,
    error,
    retry
  };
};