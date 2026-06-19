// ESG Dashboard Monitoring Service
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger.js';

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
  // Standard Web Vitals
  FCP?: number; // First Contentful Paint
  LCP?: number; // Largest Contentful Paint
  CLS?: number; // Cumulative Layout Shift
  FID?: number; // First Input Delay
  TTFB?: number; // Time to First Byte

  // Custom Metrics
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
    // Initialize monitoring components
    this.setupPerformanceMonitoring();
    this.setupErrorTracking();
    this.setupUserInteractionTracking();

    // Regular cleanup of old events
    this.cleanupInterval = setInterval(() => this.cleanupOldEvents(), 5 * 60 * 1000); // Cleanup every 5 minutes
  }

  private cleanupInterval?: NodeJS.Timeout;

  private setupPerformanceMonitoring(): void {
    // Track Core Web Vitals
    if ('PerformanceObserver' in window) {
      // LCP Tracking
      const lcpObserver = new PerformanceObserver(list => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        if (lastEntry) {
          this.recordMetric('LCP', lastEntry.startTime);
        }
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // CLS Tracking
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

      // FID Tracking
      const fidObserver = new PerformanceObserver(list => {
        for (const entry of list.getEntries() as any[]) {
          this.recordMetric('FID', entry.processingStart - entry.startTime);
        }
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // FCP Tracking
      const fcpObserver = new PerformanceObserver(list => {
        for (const entry of list.getEntries() as any[]) {
          this.recordMetric('FCP', entry.startTime);
        }
      });
      fcpObserver.observe({ entryTypes: ['paint'] });

      this.observers = [lcpObserver, clsObserver, fidObserver, fcpObserver];
    }

    // Track Resource Loading
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
    // Global error handling
    window.addEventListener('error', event => {
      this.trackError('javascript_error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error?.toString(),
      });
    });

    // Promise Rejections
    window.addEventListener('unhandledrejection', event => {
      this.trackError('promise_rejection', {
        reason: event.reason?.toString(),
        promise: event.promise?.toString(),
      });
    });

    // React Error Boundary callback
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

    // Track Route Changes (if using React Router)
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

  // Track Events
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

    // Send to backend (in production environment)
    if (process.env.NODE_ENV === 'production') {
      this.sendToBackend(event);
    }

    // Log to console (in development)
    if (process.env.NODE_ENV === 'development') {
      omniLogger.info(LogCategory.SYSTEM, `Monitoring event: ${type}:${action}`, data);
    }
  }

  // Track Errors
  trackError(errorType: string, errorData: Record<string, any>): void {
    this.trackEvent('error', errorType, errorData);
  }

  // Record Performance Metric
  recordMetric(metricName: keyof PerformanceMetrics, value: number): void {
    this.metrics[metricName] = value;
    this.trackEvent('performance', 'metric_recorded', {
      metric: metricName,
      value,
    });
  }

  // Record API Call
  trackApiCall(endpoint: string, method: string, duration: number, status: number): void {
    this.trackEvent('performance', 'api_call', {
      endpoint,
      method,
      duration,
      status,
      success: status >= 200 && status < 300,
    });
  }

  // Record User Actions
  trackUserAction(action: string, data: Record<string, any> = {}): void {
    this.trackEvent('user_action', action, data);
  }

  // Record Security Events
  trackSecurityEvent(eventType: string, data: Record<string, any>): void {
    this.trackEvent('security', eventType, data);
  }

  // Get System Health Status
  async getSystemHealth(): Promise<SystemHealth> {
    const now = Date.now();

    // Mock system health check (In real production, this calls backend API)
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

    // Additional health checks
    if (this.metrics.errorsCount && this.metrics.errorsCount > 10) {
      health.status = 'warning';
    }

    if (health.memory.percentage > 90) {
      health.status = 'critical';
    }

    return health;
  }

  // Get Performance Metrics
  getPerformanceMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  // Get Recent Events
  getRecentEvents(limit: number = 100): MonitoringEvent[] {
    return this.events.slice(-limit);
  }

  // Cleanup Events
  private cleanupOldEvents(): void {
    const cutoffTime = Date.now() - 24 * 60 * 60 * 1000; // 24 hours ago
    this.events = this.events.filter(event => event.timestamp > cutoffTime);
  }

  // Generate unique ID
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Get Session ID
  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('monitoring_session_id');
    if (!sessionId) {
      sessionId = this.generateId();
      sessionStorage.setItem('monitoring_session_id', sessionId);
    }
    return sessionId;
  }

  // Send to backend (Production)
  private async sendToBackend(event: MonitoringEvent): Promise<void> {
    try {
      // In real production, this would be sent to providers like DataDog, New Relic, etc.
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

  // Cleanup Resources
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

// Create Instance
export const monitoringService = new MonitoringService();

// React Hook for ease of use
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
