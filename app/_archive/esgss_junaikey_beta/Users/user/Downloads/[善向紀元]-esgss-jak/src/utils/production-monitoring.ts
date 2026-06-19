// ESG儀表板生產級監控集成
import { monitoringService } from '../services/monitoring';
import { analyticsService } from '../services/analytics';

export interface MonitoringConfig {
  datadog?: {
    apiKey: string;
    appKey: string;
    site: string;
  };
  newRelic?: {
    licenseKey: string;
    applicationId: string;
  };
  sentry?: {
    dsn: string;
    environment: string;
  };
  logRocket?: {
    appId: string;
  };
}

class ProductionMonitoringService {
  private config: MonitoringConfig | null = null;
  private initialized = false;

  constructor() {
    this.loadConfig();
  }

  private loadConfig(): void {
    // 從環境變數加載配置
    this.config = {
      datadog: process.env.VITE_DATADOG_API_KEY ? {
        apiKey: process.env.VITE_DATADOG_API_KEY,
        appKey: process.env.VITE_DATADOG_APP_KEY || '',
        site: process.env.VITE_DATADOG_SITE || 'datadoghq.com'
      } : undefined,

      newRelic: process.env.VITE_NEW_RELIC_LICENSE_KEY ? {
        licenseKey: process.env.VITE_NEW_RELIC_LICENSE_KEY,
        applicationId: process.env.VITE_NEW_RELIC_APP_ID || ''
      } : undefined,

      sentry: process.env.VITE_SENTRY_DSN ? {
        dsn: process.env.VITE_SENTRY_DSN,
        environment: process.env.NODE_ENV || 'development'
      } : undefined,

      logRocket: process.env.VITE_LOGROCKET_APP_ID ? {
        appId: process.env.VITE_LOGROCKET_APP_ID
      } : undefined
    };
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // 初始化DataDog RUM
      if (this.config?.datadog) {
        await this.initializeDataDog();
      }

      // 初始化New Relic
      if (this.config?.newRelic) {
        await this.initializeNewRelic();
      }

      // 初始化Sentry
      if (this.config?.sentry) {
        await this.initializeSentry();
      }

      // 初始化LogRocket
      if (this.config?.logRocket) {
        await this.initializeLogRocket();
      }

      this.initialized = true;

      monitoringService.trackEvent('system', 'monitoring_initialized', {
        providers: Object.keys(this.config || {}).filter(key => this.config![key as keyof MonitoringConfig])
      });

    } catch (error) {
      console.error('Failed to initialize production monitoring:', error);
      monitoringService.trackError('monitoring_initialization_failed', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  private async initializeDataDog(): Promise<void> {
    if (!this.config?.datadog) return;

    try {
      // 動態載入DataDog RUM
      const script = document.createElement('script');
      script.src = `https://www.datadoghq-browser-agent.com/datadog-rum-v4.js`;
      script.onload = () => {
        // @ts-ignore
        window.DD_RUM?.init({
          applicationId: this.config!.datadog!.appKey,
          clientToken: this.config!.datadog!.apiKey,
          site: this.config!.datadog!.site,
          service: 'esg-dashboard',
          env: process.env.NODE_ENV || 'development',
          version: process.env.VITE_APP_VERSION || '1.0.0',
          sessionSampleRate: 100,
          sessionReplaySampleRate: 20,
          trackUserInteractions: true,
          trackResources: true,
          trackLongTasks: true,
          defaultPrivacyLevel: 'mask-user-input'
        });

        console.log('DataDog RUM initialized');
      };
      document.head.appendChild(script);
    } catch (error) {
      console.error('Failed to initialize DataDog:', error);
    }
  }

  private async initializeNewRelic(): Promise<void> {
    if (!this.config?.newRelic) return;

    try {
      // 動態載入New Relic
      const script = document.createElement('script');
      script.innerHTML = `
        window.NREUM||(NREUM={});
        NREUM.init={privacy:{cookies_enabled:true},ajax:{deny_list:["bam.nr-data.net"]}};
        NREUM.loader_config={accountID:"${this.config.newRelic.applicationId}",trustKey:"${this.config.newRelic.licenseKey}",agentID:"${this.config.newRelic.applicationId}",licenseKey:"${this.config.newRelic.licenseKey}",applicationID:"${this.config.newRelic.applicationId}"};
        NREUM.info={beacon:"bam.nr-data.net",errorBeacon:"bam.nr-data.net",licenseKey:"${this.config.newRelic.licenseKey}",applicationID:"${this.config.newRelic.applicationId}",sa:1};
      `;
      document.head.appendChild(script);

      const nrScript = document.createElement('script');
      nrScript.src = 'https://js-agent.newrelic.com/nr-spa-1.247.0.min.js';
      document.head.appendChild(nrScript);

      console.log('New Relic initialized');
    } catch (error) {
      console.error('Failed to initialize New Relic:', error);
    }
  }

  private async initializeSentry(): Promise<void> {
    if (!this.config?.sentry) return;

    try {
      // 動態載入Sentry
      const script = document.createElement('script');
      script.src = 'https://browser.sentry-cdn.com/7.37.2/bundle.min.js';
      script.onload = () => {
        // @ts-ignore
        window.Sentry?.init({
          dsn: this.config!.sentry!.dsn,
          environment: this.config!.sentry!.environment,
          integrations: [
            // @ts-ignore
            new window.Sentry.BrowserTracing(),
            // @ts-ignore
            new window.Sentry.Replay()
          ],
          tracesSampleRate: 1.0,
          replaysSessionSampleRate: 0.1,
          replaysOnErrorSampleRate: 1.0,
        });

        console.log('Sentry initialized');
      };
      document.head.appendChild(script);
    } catch (error) {
      console.error('Failed to initialize Sentry:', error);
    }
  }

  private async initializeLogRocket(): Promise<void> {
    if (!this.config?.logRocket) return;

    try {
      // 動態載入LogRocket
      const script = document.createElement('script');
      script.src = 'https://cdn.lr-ingest.io/LogRocket.min.js';
      script.onload = () => {
        // @ts-ignore
        window.LogRocket?.init(this.config!.logRocket!.appId, {
          network: {
            requestSanitizer: (request: any) => {
              // 清理敏感數據
              if (request.headers.authorization) {
                request.headers.authorization = '[REDACTED]';
              }
              return request;
            }
          },
          dom: {
            inputSanitizer: true
          }
        });

        console.log('LogRocket initialized');
      };
      document.head.appendChild(script);
    } catch (error) {
      console.error('Failed to initialize LogRocket:', error);
    }
  }

  // 增強的錯誤追蹤
  trackError(error: Error, context?: Record<string, any>): void {
    monitoringService.trackError('production_error', {
      message: error.message,
      stack: error.stack,
      context
    });

    // 發送到外部服務
    try {
      // @ts-ignore
      if (window.Sentry) {
        // @ts-ignore
        window.Sentry.captureException(error, { extra: context });
      }

      // @ts-ignore
      if (window.LogRocket) {
        // @ts-ignore
        window.LogRocket.captureException(error, { extra: context });
      }
    } catch (e) {
      console.warn('Failed to send error to external monitoring:', e);
    }
  }

  // 用戶回饋收集
  collectUserFeedback(type: 'bug' | 'feature' | 'general', message: string, metadata?: Record<string, any>): void {
    monitoringService.trackEvent('user_feedback', type, {
      message,
      metadata,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: Date.now()
    });

    // 發送到外部服務
    try {
      // @ts-ignore
      if (window.LogRocket) {
        // @ts-ignore
        window.LogRocket.track(`user_feedback_${type}`, { message, metadata });
      }
    } catch (e) {
      console.warn('Failed to send feedback to external monitoring:', e);
    }
  }

  // 效能指標追蹤
  trackPerformanceMetric(metric: string, value: number, tags?: Record<string, string>): void {
    monitoringService.recordMetric(metric as any, value);

    try {
      // @ts-ignore
      if (window.DD_RUM) {
        // @ts-ignore
        window.DD_RUM.addRumGlobalContext(tags || {});
      }

      // @ts-ignore
      if (window.newrelic) {
        // @ts-ignore
        window.newrelic.addPageAction(metric, { value, ...tags });
      }
    } catch (e) {
      console.warn('Failed to send performance metric to external monitoring:', e);
    }
  }

  // Core Web Vitals 追蹤
  trackWebVitals(): void {
    // 使用web-vitals庫追蹤Core Web Vitals
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS((metric) => {
        this.trackPerformanceMetric('CLS', metric.value, { rating: metric.rating });
      });

      getFID((metric) => {
        this.trackPerformanceMetric('FID', metric.value, { rating: metric.rating });
      });

      getFCP((metric) => {
        this.trackPerformanceMetric('FCP', metric.value, { rating: metric.rating });
      });

      getLCP((metric) => {
        this.trackPerformanceMetric('LCP', metric.value, { rating: metric.rating });
      });

      getTTFB((metric) => {
        this.trackPerformanceMetric('TTFB', metric.value, { rating: metric.rating });
      });
    }).catch((error) => {
      console.warn('Failed to load web-vitals:', error);
    });
  }

  // 用戶行為追蹤
  trackUserAction(action: string, properties?: Record<string, any>): void {
    analyticsService.trackEvent('user_action' as any, action, properties);

    try {
      // @ts-ignore
      if (window.LogRocket) {
        // @ts-ignore
        window.LogRocket.track(action, properties);
      }

      // @ts-ignore
      if (window.DD_RUM) {
        // @ts-ignore
        window.DD_RUM.addAction(action, properties);
      }
    } catch (e) {
      console.warn('Failed to send user action to external monitoring:', e);
    }
  }

  // 獲取監控狀態
  getStatus(): {
    initialized: boolean;
    providers: string[];
    configLoaded: boolean;
  } {
    return {
      initialized: this.initialized,
      providers: Object.keys(this.config || {}).filter(key => this.config![key as keyof MonitoringConfig]),
      configLoaded: !!this.config
    };
  }
}

// 創建全域實例
export const productionMonitoring = new ProductionMonitoringService();

// 自動初始化（在生產環境中）
if (process.env.NODE_ENV === 'production') {
  // 延遲初始化以避免阻塞頁面載入
  setTimeout(() => {
    productionMonitoring.initialize().catch(console.error);
    productionMonitoring.trackWebVitals();
  }, 1000);
}

// React Hook
export const useProductionMonitoring = () => {
  return {
    trackError: productionMonitoring.trackError.bind(productionMonitoring),
    collectUserFeedback: productionMonitoring.collectUserFeedback.bind(productionMonitoring),
    trackPerformanceMetric: productionMonitoring.trackPerformanceMetric.bind(productionMonitoring),
    trackUserAction: productionMonitoring.trackUserAction.bind(productionMonitoring),
    getStatus: productionMonitoring.getStatus.bind(productionMonitoring)
  };
};