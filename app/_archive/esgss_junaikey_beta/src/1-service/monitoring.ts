// ESG儀表板監控服務
import { omniLogger, LogCategory } from '@infra/logging/OmniLogger';
import type { SystemHealthStatus } from '../types/core';

export interface MonitoringEvent {
  id: string;
  timestamp: number;
  type: 'performance' | 'error' | 'user_action' | 'system' | 'security';
  category: string;
  action: string;
  data: Record<string, any>;
  userId?: string;
  sessionId: string;
  userAgent: string;
  url: string;
}

export interface PerformanceMetrics {
  // 核心 Web Vitals
  FCP?: number; // First Contentful Paint
  LCP?: number; // Largest Contentful Paint
  CLS?: number; // Cumulative Layout Shift
  FID?: number; // First Input Delay
  TTFB?: number; // Time to First Byte

  // 自定義指標
  componentRenderTime?: number;
  apiResponseTime?: number;
  memoryUsage?: number;
  networkRequests?: number;
  errorsCount?: number;
}

export interface SystemHealth {
  status: SystemHealthStatus;
  uptime: number;
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  cpu: {
    usage: number;
    loadAverage: number[];
  };
  services: {
    database: boolean;
    cache: boolean;
    api: boolean;
    cdn: boolean;
  };
  lastChecked: number;
}

class MonitoringService {
  private events: MonitoringEvent[] = [];
  private metrics: PerformanceMetrics = {};
  private observers: PerformanceObserver[] = [];
  private errorHandler: ((error: Error) => void) | null = null;

  constructor() {
    this.initialize();
  }

  private initialize(): void {
    // 初始化監控
    this.setupPerformanceMonitoring();
    this.setupErrorTracking();
    this.setupUserInteractionTracking();

    // 定期清理舊事件
    this.cleanupInterval = setInterval(() => this.cleanupOldEvents(), 5 * 60 * 1000); // 每五分鐘清理一次
  }

  private cleanupInterval?: NodeJS.Timeout;

  private setupPerformanceMonitoring(): void {
    // 監控 Core Web Vitals
    if ('PerformanceObserver' in window) {
      // LCP 監控器
      const lcpObserver = new PerformanceObserver(list => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        if (lastEntry) {
          this.recordMetric('LCP', lastEntry.startTime);
        }
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // CLS 監控器
      const clsObserver = new PerformanceObserver(list => {
        let clsValue = 0;
        for (const entry of list.getEntries() as any[]) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        this.recordMetric('CLS', clsValue);
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });

      // FID 監控器
      const fidObserver = new PerformanceObserver(list => {
        for (const entry of list.getEntries() as any[]) {
          this.recordMetric('FID', entry.processingStart - entry.startTime);
        }
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // FCP 監控器
      const fcpObserver = new PerformanceObserver(list => {
        for (const entry of list.getEntries() as any[]) {
          this.recordMetric('FCP', entry.startTime);
        }
      });
      fcpObserver.observe({ entryTypes: ['paint'] });

      this.observers = [lcpObserver, clsObserver, fidObserver, fcpObserver];
    }

    // 監控資源載入
    const resourceObserver = new PerformanceObserver(list => {
      for (const entry of list.getEntries() as any[]) {
        this.trackEvent('performance', 'resource_loaded', {
          name: entry.name,
          duration: entry.duration,
          size: entry.transferSize,
          type: entry.initiatorType,
        });
      }
    });
    resourceObserver.observe({ entryTypes: ['resource'] });
    this.observers.push(resourceObserver);
  }

  private setupErrorTracking(): void {
    // 全局錯誤捕獲
    window.addEventListener('error', event => {
      this.trackError('javascript_error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error?.toString(),
      });
    });

    // Promise 拒絕捕獲
    window.addEventListener('unhandledrejection', event => {
      this.trackError('promise_rejection', {
        reason: event.reason?.toString(),
        promise: event.promise?.toString(),
      });
    });

    // React 錯誤邊界回調
    this.errorHandler = (error: Error) => {
      this.trackError('react_error', {
        message: error.message,
        stack: error.stack,
      });
    };
  }

  private setupUserInteractionTracking(): void {
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', this.handleVisibilityChange);
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', this.handleBeforeUnload);
    }

    // 追蹤路由變更 (如果使用 React Router)
    if (window.history && window.history.pushState) {
      const originalPushState = window.history.pushState;
      window.history.pushState = function (state, title, url) {
        originalPushState.call(this, state, title, url);
        monitoringService.trackEvent('user_action', 'route_change', {
          to: url,
          state,
        });
      };
    }
  }

  // 追蹤事件
  trackEvent(type: MonitoringEvent['type'], action: string, data: Record<string, any> = {}): void {
    const event: MonitoringEvent = {
      id: this.generateId(),
      timestamp: Date.now(),
      type,
      category: type,
      action,
      data,
      sessionId: this.getSessionId(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    this.events.push(event);

    // 非同步發送到監控後端 (生產環境中)
    if (process.env.NODE_ENV === 'production') {
      this.sendToBackend(event);
    }

    // 控制台日誌 (開發模式)
    if (process.env.NODE_ENV === 'development') {
      omniLogger.info(LogCategory.SYSTEM, `Monitoring event: ${type}:${action}`, data);
    }
  }

  // 追蹤錯誤
  trackError(errorType: string, errorData: Record<string, any>): void {
    this.trackEvent('error', errorType, errorData);
  }

  // 記錄性能指標
  recordMetric(metricName: keyof PerformanceMetrics, value: number): void {
    this.metrics[metricName] = value;
    this.trackEvent('performance', 'metric_recorded', {
      metric: metricName,
      value,
    });
  }

  // 記錄 API 調用
  trackApiCall(endpoint: string, method: string, duration: number, status: number): void {
    this.trackEvent('performance', 'api_call', {
      endpoint,
      method,
      duration,
      status,
      success: status >= 200 && status < 300,
    });
  }

  // 記錄用戶行為
  trackUserAction(action: string, data: Record<string, any> = {}): void {
    this.trackEvent('user_action', action, data);
  }

  // 記錄安全事件
  trackSecurityEvent(eventType: string, data: Record<string, any>): void {
    this.trackEvent('security', eventType, data);
  }

  // 取得系統健康狀態
  async getSystemHealth(): Promise<SystemHealth> {
    const now = Date.now();

    // 模擬系統健康檢查 (在實際實作中，這會調用後端 API)
    const health: SystemHealth = {
      status: 'healthy',
      uptime: now - performance.timing.navigationStart,
      memory: {
        used: (performance as any).memory?.usedJSHeapSize || 0,
        total: (performance as any).memory?.totalJSHeapSize || 0,
        percentage: 0,
      },
      cpu: {
        usage: 0,
        loadAverage: [0, 0, 0],
      },
      services: {
        database: true,
        cache: true,
        api: true,
        cdn: true,
      },
      lastChecked: now,
    };

    if (health.memory.total > 0) {
      health.memory.percentage = (health.memory.used / health.memory.total) * 100;
    }

    // 根據指標判斷健康狀態
    if (this.metrics.errorsCount && this.metrics.errorsCount > 10) {
      health.status = 'warning';
    }

    if (health.memory.percentage > 90) {
      health.status = 'critical';
    }

    return health;
  }

  // 取得性能指標
  getPerformanceMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  // 取得最近事件
  getRecentEvents(limit: number = 100): MonitoringEvent[] {
    return this.events.slice(-limit);
  }

  // 清理舊事件
  private cleanupOldEvents(): void {
    const cutoffTime = Date.now() - 24 * 60 * 60 * 1000; // 24 小時前
    this.events = this.events.filter(event => event.timestamp > cutoffTime);
  }

  // 生成唯一 ID
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // 取得會話 ID
  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('monitoring_session_id');
    if (!sessionId) {
      sessionId = this.generateId();
      sessionStorage.setItem('monitoring_session_id', sessionId);
    }
    return sessionId;
  }

  // 發送到後端 (生產模式)
  private async sendToBackend(event: MonitoringEvent): Promise<void> {
    try {
      // 在實際實作中，這裡會發送到監控平台如 DataDog, New Relic 等
      const response = await fetch('/api/monitoring/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });

      if (!response.ok) {
        omniLogger.warn(LogCategory.SYSTEM, 'Failed to send monitoring event to backend', {
          status: response.status,
        });
      }
    } catch (error) {
      omniLogger.warn(LogCategory.SYSTEM, 'Error sending monitoring event', { error });
    }
  }

  // 清理資源
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = undefined;
    }

    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];

    if (typeof window !== 'undefined') {
      window.removeEventListener('error', this.handleGlobalError);
      window.removeEventListener('unhandledrejection', this.handlePromiseRejection);
      window.removeEventListener('beforeunload', this.handleBeforeUnload);
    }

    if (typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    }

    omniLogger.info(LogCategory.SYSTEM, 'MonitoringService destroyed');
  }

  private handleGlobalError = (event: ErrorEvent) => {
    this.trackError('javascript_error', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error?.toString(),
    });
  };

  private handlePromiseRejection = (event: PromiseRejectionEvent) => {
    this.trackError('promise_rejection', {
      reason: event.reason?.toString(),
      promise: event.promise?.toString(),
    });
  };

  private handleVisibilityChange = () => {
    if (typeof document === 'undefined') return;
    this.trackEvent('user_action', 'visibility_change', {
      visible: !document.hidden,
      timestamp: Date.now(),
    });
  };

  private handleBeforeUnload = () => {
    this.trackEvent('user_action', 'page_unload', {
      timestamp: Date.now(),
    });
  };
}

// 創建單例實例
export const monitoringService = new MonitoringService();

// React Hook for 使用監控服務
export const useMonitoring = () => {
  return {
    trackEvent: monitoringService.trackEvent.bind(monitoringService),
    trackError: monitoringService.trackError.bind(monitoringService),
    trackUserAction: monitoringService.trackUserAction.bind(monitoringService),
    trackApiCall: monitoringService.trackApiCall.bind(monitoringService),
    getPerformanceMetrics: monitoringService.getPerformanceMetrics.bind(monitoringService),
    getSystemHealth: monitoringService.getSystemHealth.bind(monitoringService),
    getRecentEvents: monitoringService.getRecentEvents.bind(monitoringService),
  };
};
