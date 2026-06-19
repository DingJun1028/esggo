// 懶載入工具函數 - 實現代碼分割和動態載入
import React, { ComponentType, lazy } from 'react';
import { LoadingScreen } from '../components/ui/LoadingScreen';

/**
 * 創建懶載入組件的工具函數
 * @param importFunc 動態import函數
 * @param fallbackComponent 加載時顯示的組件
 * @param errorBoundary 錯誤邊界組件
 * @returns React懶載入組件
 */
export function createLazyComponent<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallbackComponent?: React.ComponentType,
  errorBoundary?: React.ComponentType<{ error: Error; retry: () => void }>
) {
  const LazyComponent = lazy(importFunc);

  const Fallback = fallbackComponent || LoadingScreen;

  return React.forwardRef<T, React.ComponentProps<T>>((props, ref) => {
    const [hasError, setHasError] = React.useState(false);
    const [retryCount, setRetryCount] = React.useState(0);

    const handleRetry = React.useCallback(() => {
      setHasError(false);
      setRetryCount(prev => prev + 1);
      // 強制重新渲染以重新觸發懶載入
      window.location.reload();
    }, []);

    if (hasError && errorBoundary) {
      const ErrorBoundaryComponent = errorBoundary;
      return (
        <ErrorBoundaryComponent error={new Error('Failed to load component')} retry={handleRetry} />
      );
    }

    return (
      <React.Suspense fallback={<Fallback />}>
        <LazyComponent {...(props as any)} ref={ref} />
      </React.Suspense>
    );
  });
}

/**
 * 預載組件的工具函數
 * @param importFunc 動態import函數
 */
export function preloadComponent(importFunc: () => Promise<any>): void {
  // 創建一個link標籤來預載資源
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'script';

  // 獲取模組路徑（通過import函數的toString方法）
  const modulePath = importFunc.toString().match(/import\(['"]([^'"]+)['"]\)/)?.[1];

  if (modulePath) {
    link.href = modulePath;
    document.head.appendChild(link);
  }
}

/**
 * 批量預載組件的工具函數
 * @param components 要預載的組件import函數數組
 */
export function preloadComponents(components: Array<() => Promise<any>>): void {
  components.forEach(preloadComponent);
}

/**
 * 條件性懶載入 - 基於條件動態載入組件
 * @param condition 載入條件
 * @param trueImport 條件為真時的import函數
 * @param falseImport 條件為假時的import函數
 * @param fallbackComponent 加載時顯示的組件
 */
export function conditionalLazyLoad<T extends ComponentType<any>>(
  condition: () => boolean,
  trueImport: () => Promise<{ default: T }>,
  falseImport: () => Promise<{ default: T }>,
  fallbackComponent?: React.ComponentType
) {
  const LazyComponent = lazy(() => (condition() ? trueImport() : falseImport()));

  const Fallback = fallbackComponent || LoadingScreen;

  return React.forwardRef<T, React.ComponentProps<T>>((props, ref) => (
    <React.Suspense fallback={<Fallback />}>
      <LazyComponent {...(props as any)} ref={ref} />
    </React.Suspense>
  ));
}

/**
 * 懶載入路由組件 - 專門用於React Router的懶載入
 * @param importFunc 動態import函數
 * @param fallbackComponent 加載時顯示的組件
 */
export function lazyRoute<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallbackComponent?: React.ComponentType
) {
  return createLazyComponent(importFunc, fallbackComponent);
}

/**
 * 懶載入的錯誤處理Wrapper
 */
export const LazyErrorBoundary: React.FC<{
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
}> = ({ children, fallback: Fallback }) => {
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      // 只處理動態載入相關的錯誤
      if (event.error && event.error.message?.includes('Loading chunk')) {
        setError(event.error);
        event.preventDefault();
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (event.reason && event.reason.message?.includes('Loading chunk')) {
        setError(event.reason);
        event.preventDefault();
      }
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  const handleRetry = React.useCallback(() => {
    setError(null);
    // 清除快取並重新載入
    window.location.reload();
  }, []);

  if (error && Fallback) {
    return <Fallback error={error} retry={handleRetry} />;
  }

  return <>{children}</>;
};

/**
 * 預載策略Hook
 * 用於實現智慧預載邏輯
 */
export function usePreloadStrategy(
  components: Array<() => Promise<any>>,
  options: {
    trigger?: 'hover' | 'visible' | 'idle' | 'immediate';
    delay?: number;
    rootMargin?: string;
  } = {}
) {
  const { trigger = 'idle', delay = 1000, rootMargin = '50px' } = options;

  const [isPreloaded, setIsPreloaded] = React.useState(false);

  React.useEffect(() => {
    if (isPreloaded) return;

    const preload = () => {
      if (!isPreloaded) {
        preloadComponents(components);
        setIsPreloaded(true);
      }
    };

    switch (trigger) {
      case 'immediate':
        preload();
        break;

      case 'idle':
        if ('requestIdleCallback' in window) {
          requestIdleCallback(preload, { timeout: delay });
        } else {
          setTimeout(preload, delay);
        }
        break;

      case 'hover':
        // 這個需要在具體的元素上實現
        break;

      case 'visible':
        // 使用Intersection Observer
        if ('IntersectionObserver' in window) {
          const observer = new IntersectionObserver(
            entries => {
              if (entries.some(entry => entry.isIntersecting)) {
                preload();
                observer.disconnect();
              }
            },
            { rootMargin }
          );

          // 觀察當前組件
          const element = document.querySelector('[data-preload-trigger]');
          if (element) {
            observer.observe(element);
          }

          return () => observer.disconnect();
        }
        break;
    }

    return undefined;
  }, [components, trigger, delay, rootMargin, isPreloaded]);

  return isPreloaded;
}

// 導出常用的懶載入組件
// export const LazyESGConsole = createLazyComponent(
//   () => import('../src/components/ESGConsole'),
// );

// export const LazyESGDashboard = createLazyComponent(
//   () => import('../src/components/ESGDashboard')
// );

// 預載策略 - 在應用啟動時預載關鍵組件
export function preloadCriticalComponents() {
  const criticalComponents: Array<() => Promise<any>> = [
    // () => import('../src/components/ESGConsole'),
    // () => import('../src/components/ESGDashboard'),
  ];
  //...

  // 立即預載關鍵組件
  preloadComponents(criticalComponents);
}

// 在模組載入時預載關鍵組件
if (typeof window !== 'undefined') {
  // 使用requestIdleCallback或setTimeout來避免阻塞主線程
  const preload = () => preloadCriticalComponents();

  if ('requestIdleCallback' in window) {
    requestIdleCallback(preload, { timeout: 2000 });
  } else {
    setTimeout(preload, 2000);
  }
}
