// ESG儀表板監控服務
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
  // 核心Web Vitals
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
  status: 'healthy' | 'warning' | 'error' | 'critical';
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
    // 初始化效能監控
    this.setupPerformanceMonitoring();
    this.setupErrorTracking();
    this.setupUserInteractionTracking();

    // 定期清理舊事件
    setInterval(() => this.cleanupOldEvents(), 5 * 60 * 1000); // 每5分鐘清理一次
  }

  private setupPerformanceMonitoring(): void {
    // 監控Core Web Vitals
    if ('PerformanceObserver' in window) {
      // LCP監控
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        if (lastEntry) {
          this.recordMetric('LCP', lastEntry.startTime);
        }
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // CLS監控
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        for (const entry of list.getEntries() as any[]) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        this.recordMetric('CLS', clsValue);
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });

      // FID監控
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as any[]) {
          this.recordMetric('FID', entry.processingStart - entry.startTime);
        }
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // FCP監控
      const fcpObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as any[]) {
          this.recordMetric('FCP', entry.startTime);
        }
      });
      fcpObserver.observe({ entryTypes: ['paint'] });

      this.observers = [lcpObserver, clsObserver, fidObserver, fcpObserver];
    }

    // 監控資源載入
    const resourceObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as any[]) {
        this.trackEvent('performance', 'resource_loaded', {
          name: entry.name,
          duration: entry.duration,
          size: entry.transferSize,
          type: entry.initiatorType
        });
      }
    });
    resourceObserver.observe({ entryTypes: ['resource'] });
    this.observers.push(resourceObserver);
  }

  private setupErrorTracking(): void {
    // 全域錯誤處理
    window.addEventListener('error', (event) => {
      this.trackError('javascript_error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error?.toString()
      });
    });

    // Promise拒絕處理
    window.addEventListener('unhandledrejection', (event) => {
      this.trackError('promise_rejection', {
        reason: event.reason?.toString(),
        promise: event.promise?.toString()
      });
    });

    // React錯誤邊界回調
    this.errorHandler = (error: Error) => {
      this.trackError('react_error', {
        message: error.message,
        stack: error.stack
      });
    };
  }

  private setupUserInteractionTracking(): void {
    // 頁面可見性變化
    document.addEventListener('visibilitychange', () => {
      this.trackEvent('user_action', 'visibility_change', {
        visible: !document.hidden,
        timestamp: Date.now()
      });
    });

    // 頁面卸載
    window.addEventListener('beforeunload', () => {
      this.trackEvent('user_action', 'page_unload', {
        timestamp: Date.now()
      });
    });

    // 追蹤路由變化 (如果使用React Router)
    if (window.history && window.history.pushState) {
      const originalPushState = window.history.pushState;
      window.history.pushState = function(state, title, url) {
        originalPushState.call(this, state, title, url);
        monitoringService.trackEvent('user_action', 'route_change', {
          to: url,
          state
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
      url: window.location.href
    };

    this.events.push(event);

    // 即時發送到監控後端 (在生產環境中)
    if (process.env.NODE_ENV === 'production') {
      this.sendToBackend(event);
    }

    // 控制台日誌 (開發環境)
    if (process.env.NODE_ENV === 'development') {
      console.log(`[MONITORING] ${type}:${action}`, data);
    }
  }

  // 追蹤錯誤
  trackError(errorType: string, errorData: Record<string, any>): void {
    this.trackEvent('error', errorType, errorData);
  }

  // 記錄效能指標
  recordMetric(metricName: keyof PerformanceMetrics, value: number): void {
    this.metrics[metricName] = value;
    this.trackEvent('performance', 'metric_recorded', {
      metric: metricName,
      value
    });
  }

  // 記錄API調用
  trackApiCall(endpoint: string, method: string, duration: number, status: number): void {
    this.trackEvent('performance', 'api_call', {
      endpoint,
      method,
      duration,
      status,
      success: status >= 200 && status < 300
    });
  }

  // 記錄用戶行為
  trackUserAction(action: string, data: Record<string, any> = {}): void {
    this.trackEvent('user_action', action, data);
  }

  // 記錄安全性事件
  trackSecurityEvent(eventType: string, data: Record<string, any>): void {
    this.trackEvent('security', eventType, data);
  }

  // 獲取系統健康狀態
  async getSystemHealth(): Promise<SystemHealth> {
    const now = Date.now();

    // 模擬系統健康檢查 (在實際應用中，這會調用後端API)
    const health: SystemHealth = {
      status: 'healthy',
      uptime: now - performance.timing.navigationStart,
      memory: {
        used: (performance as any).memory?.usedJSHeapSize || 0,
        total: (performance as any).memory?.totalJSHeapSize || 0,
        percentage: 0
      },
      cpu: {
        usage: 0,
        loadAverage: [0, 0, 0]
      },
      services: {
        database: true,
        cache: true,
        api: true,
        cdn: true
      },
      lastChecked: now
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

  // 獲取效能指標
  getPerformanceMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  // 獲取最近事件
  getRecentEvents(limit: number = 100): MonitoringEvent[] {
    return this.events.slice(-limit);
  }

  // 清理舊事件
  private cleanupOldEvents(): void {
    const cutoffTime = Date.now() - (24 * 60 * 60 * 1000); // 24小時前
    this.events = this.events.filter(event => event.timestamp > cutoffTime);
  }

  // 生成唯一ID
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // 獲取會話ID
  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('monitoring_session_id');
    if (!sessionId) {
      sessionId = this.generateId();
      sessionStorage.setItem('monitoring_session_id', sessionId);
    }
    return sessionId;
  }

  // 發送到後端 (生產環境)
  private async sendToBackend(event: MonitoringEvent): Promise<void> {
    try {
      // 在實際應用中，這裡會發送到監控服務如DataDog, New Relic等
      const response = await fetch('/api/monitoring/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });

      if (!response.ok) {
        console.warn('Failed to send monitoring event to backend');
      }
    } catch (error) {
      console.warn('Error sending monitoring event:', error);
    }
  }

  // 清理資源
  destroy(): void {
    this.observers.forEach(observer => observer.disconnect());
    window.removeEventListener('error', this.handleGlobalError);
    window.removeEventListener('unhandledrejection', this.handlePromiseRejection);
  }

  private handleGlobalError = (event: ErrorEvent) => {
    this.trackError('javascript_error', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error?.toString()
    });
  };

  private handlePromiseRejection = (event: PromiseRejectionEvent) => {
    this.trackError('promise_rejection', {
      reason: event.reason?.toString(),
      promise: event.promise?.toString()
    });
  };
}

// 創建全域實例
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
    getRecentEvents: monitoringService.getRecentEvents.bind(monitoringService)
  };
};