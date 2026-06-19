// ESG儀表板分析服務
export interface UserEvent {
  id: string;
  timestamp: number;
  userId?: string;
  sessionId: string;
  eventType: 'page_view' | 'click' | 'form_submit' | 'search' | 'purchase' | 'engagement';
  eventName: string;
  properties: Record<string, any>;
  url: string;
  referrer?: string;
  deviceInfo: {
    userAgent: string;
    screenSize: string;
    viewportSize: string;
    deviceType: 'desktop' | 'tablet' | 'mobile';
  };
}

export interface AnalyticsMetrics {
  // 用戶指標
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  returningUsers: number;

  // 參與指標
  sessionDuration: number;
  pageViews: number;
  bounceRate: number;
  engagementRate: number;

  // 轉換指標
  conversionRate: number;
  goalCompletions: number;
  revenue: number;

  // 技術指標
  loadTime: number;
  errorRate: number;
  apiResponseTime: number;

  // ESG特定指標
  esgEngagementScore: number;
  carbonFootprintReduction: number;
  learningCompletionRate: number;
}

export interface ABTest {
  id: string;
  name: string;
  description: string;
  variants: Array<{
    id: string;
    name: string;
    weight: number;
    users: number;
    conversions: number;
  }>;
  status: 'draft' | 'running' | 'completed' | 'paused';
  startDate: number;
  endDate?: number;
  winner?: string;
  confidence: number;
}

class AnalyticsService {
  private events: UserEvent[] = [];
  private metrics: Partial<AnalyticsMetrics> = {};
  private abTests: ABTest[] = [];
  private sessionStartTime = Date.now();
  private sessionId = this.generateSessionId();

  constructor() {
    this.initializeTracking();
    this.loadExistingData();
  }

  private initializeTracking(): void {
    // 頁面可見性追蹤
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.trackSessionDuration();
      } else {
        this.sessionStartTime = Date.now();
      }
    });

    // 頁面卸載時追蹤
    window.addEventListener('beforeunload', () => {
      this.trackSessionDuration();
      this.flushEvents();
    });

    // 定期刷新指標
    setInterval(() => this.updateMetrics(), 30000);
  }

  private loadExistingData(): void {
    // 從localStorage加載現有數據
    const storedEvents = localStorage.getItem('analytics_events');
    const storedTests = localStorage.getItem('analytics_abtests');

    if (storedEvents) {
      try {
        this.events = JSON.parse(storedEvents);
      } catch (error) {
        console.warn('Failed to load stored analytics events:', error);
      }
    }

    if (storedTests) {
      try {
        this.abTests = JSON.parse(storedTests);
      } catch (error) {
        console.warn('Failed to load stored A/B tests:', error);
      }
    }
  }

  // 追蹤用戶事件
  trackEvent(
    eventType: UserEvent['eventType'],
    eventName: string,
    properties: Record<string, any> = {}
  ): void {
    const event: UserEvent = {
      id: this.generateId(),
      timestamp: Date.now(),
      sessionId: this.sessionId,
      eventType,
      eventName,
      properties,
      url: window.location.href,
      referrer: document.referrer,
      deviceInfo: {
        userAgent: navigator.userAgent,
        screenSize: `${screen.width}x${screen.height}`,
        viewportSize: `${window.innerWidth}x${window.innerHeight}`,
        deviceType: this.getDeviceType()
      }
    };

    this.events.push(event);

    // 本地存儲（生產環境應發送到服務端）
    this.persistEvent(event);

    // 即時更新指標
    this.updateMetricsFromEvent(event);

    // 控制台日誌（開發環境）
    if (process.env.NODE_ENV === 'development') {
      console.log('[ANALYTICS]', eventType, eventName, properties);
    }
  }

  // 追蹤頁面瀏覽
  trackPageView(pageName: string, properties: Record<string, any> = {}): void {
    this.trackEvent('page_view', 'page_view', {
      page: pageName,
      ...properties
    });
  }

  // 追蹤用戶點擊
  trackClick(element: string, properties: Record<string, any> = {}): void {
    this.trackEvent('click', 'element_click', {
      element,
      ...properties
    });
  }

  // 追蹤表單提交
  trackFormSubmit(formName: string, properties: Record<string, any> = {}): void {
    this.trackEvent('form_submit', 'form_submit', {
      form: formName,
      ...properties
    });
  }

  // 追蹤搜尋行為
  trackSearch(query: string, results: number, properties: Record<string, any> = {}): void {
    this.trackEvent('search', 'search_performed', {
      query,
      results,
      ...properties
    });
  }

  // 追蹤用戶參與度
  trackEngagement(action: string, value: number, properties: Record<string, any> = {}): void {
    this.trackEvent('engagement', action, {
      value,
      ...properties
    });
  }

  // 追蹤ESG相關指標
  trackESGMetrics(metrics: {
    carbonReduction?: number;
    learningProgress?: number;
    communityEngagement?: number;
  }): void {
    this.trackEvent('engagement', 'esg_metrics', metrics);
  }

  // 獲取分析指標
  getMetrics(): AnalyticsMetrics {
    return {
      totalUsers: this.metrics.totalUsers || 0,
      activeUsers: this.metrics.activeUsers || 0,
      newUsers: this.metrics.newUsers || 0,
      returningUsers: this.metrics.returningUsers || 0,
      sessionDuration: this.metrics.sessionDuration || 0,
      pageViews: this.metrics.pageViews || 0,
      bounceRate: this.metrics.bounceRate || 0,
      engagementRate: this.metrics.engagementRate || 0,
      conversionRate: this.metrics.conversionRate || 0,
      goalCompletions: this.metrics.goalCompletions || 0,
      revenue: this.metrics.revenue || 0,
      loadTime: this.metrics.loadTime || 0,
      errorRate: this.metrics.errorRate || 0,
      apiResponseTime: this.metrics.apiResponseTime || 0,
      esgEngagementScore: this.metrics.esgEngagementScore || 0,
      carbonFootprintReduction: this.metrics.carbonFootprintReduction || 0,
      learningCompletionRate: this.metrics.learningCompletionRate || 0
    };
  }

  // 獲取用戶事件
  getEvents(limit: number = 100): UserEvent[] {
    return this.events.slice(-limit);
  }

  // A/B測試管理
  createABTest(test: Omit<ABTest, 'id' | 'status' | 'confidence'>): string {
    const abTest: ABTest = {
      ...test,
      id: this.generateId(),
      status: 'draft',
      confidence: 0
    };

    this.abTests.push(abTest);
    this.persistABTests();
    return abTest.id;
  }

  startABTest(testId: string): boolean {
    const test = this.abTests.find(t => t.id === testId);
    if (!test || test.status !== 'draft') return false;

    test.status = 'running';
    test.startDate = Date.now();
    this.persistABTests();
    return true;
  }

  getABTestVariant(testId: string, userId: string): string | null {
    const test = this.abTests.find(t => t.id === testId && t.status === 'running');
    if (!test) return null;

    // 簡單的用戶分配邏輯（生產環境應使用更複雜的算法）
    const userHash = this.simpleHash(userId + testId);
    const totalWeight = test.variants.reduce((sum, v) => sum + v.weight, 0);

    let cumulativeWeight = 0;
    for (const variant of test.variants) {
      cumulativeWeight += variant.weight;
      if (userHash % totalWeight < cumulativeWeight) {
        return variant.id;
      }
    }

    return test.variants[0].id;
  }

  recordABTestConversion(testId: string, variantId: string): void {
    const test = this.abTests.find(t => t.id === testId);
    if (!test) return;

    const variant = test.variants.find(v => v.id === variantId);
    if (variant) {
      variant.conversions++;
      this.persistABTests();
    }
  }

  getABTests(): ABTest[] {
    return [...this.abTests];
  }

  // 導出數據
  exportData(): {
    events: UserEvent[];
    metrics: AnalyticsMetrics;
    abTests: ABTest[];
  } {
    return {
      events: [...this.events],
      metrics: this.getMetrics(),
      abTests: [...this.abTests]
    };
  }

  private trackSessionDuration(): void {
    const duration = Date.now() - this.sessionStartTime;
    this.trackEvent('engagement', 'session_duration', { duration });
  }

  private updateMetricsFromEvent(event: UserEvent): void {
    switch (event.eventType) {
      case 'page_view':
        this.metrics.pageViews = (this.metrics.pageViews || 0) + 1;
        break;
      case 'form_submit':
        this.metrics.goalCompletions = (this.metrics.goalCompletions || 0) + 1;
        break;
      case 'engagement':
        if (event.properties.esg_metrics) {
          const esg = event.properties.esg_metrics;
          this.metrics.esgEngagementScore = (this.metrics.esgEngagementScore || 0) + (esg.communityEngagement || 0);
          this.metrics.carbonFootprintReduction = (this.metrics.carbonFootprintReduction || 0) + (esg.carbonReduction || 0);
          this.metrics.learningCompletionRate = (this.metrics.learningCompletionRate || 0) + (esg.learningProgress || 0);
        }
        break;
    }
  }

  private updateMetrics(): void {
    // 計算活躍用戶數（過去24小時內有活動的會話）
    const activeThreshold = Date.now() - 24 * 60 * 60 * 1000;
    const activeSessions = new Set(
      this.events
        .filter(e => e.timestamp > activeThreshold)
        .map(e => e.sessionId)
    );
    this.metrics.activeUsers = activeSessions.size;

    // 計算跳出率
    const pageViews = this.events.filter(e => e.eventType === 'page_view');
    const singlePageSessions = new Set(
      pageViews
        .filter(e => {
          const sessionEvents = this.events.filter(se => se.sessionId === e.sessionId);
          return sessionEvents.length === 1;
        })
        .map(e => e.sessionId)
    );
    this.metrics.bounceRate = pageViews.length > 0 ? (singlePageSessions.size / new Set(pageViews.map(e => e.sessionId)).size) * 100 : 0;
  }

  private persistEvent(event: UserEvent): void {
    try {
      const recentEvents = this.events.slice(-1000); // 只保留最近1000個事件
      localStorage.setItem('analytics_events', JSON.stringify(recentEvents));
    } catch (error) {
      console.warn('Failed to persist analytics event:', error);
    }
  }

  private persistABTests(): void {
    try {
      localStorage.setItem('analytics_abtests', JSON.stringify(this.abTests));
    } catch (error) {
      console.warn('Failed to persist A/B tests:', error);
    }
  }

  private getDeviceType(): 'desktop' | 'tablet' | 'mobile' {
    const width = window.innerWidth;
    if (width >= 1024) return 'desktop';
    if (width >= 768) return 'tablet';
    return 'mobile';
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private generateSessionId(): string {
    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = this.generateId();
      sessionStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
  }

  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // 轉換為32位整數
    }
    return Math.abs(hash);
  }

  destroy(): void {
    this.flushEvents();
    // 清理事件監聽器
  }

  private flushEvents(): void {
    // 在生產環境中，這裡會將所有待發送事件發送到服務端
    if (this.events.length > 0) {
      console.log(`[ANALYTICS] Flushing ${this.events.length} events`);
      // 實際實現會調用API
    }
  }
}

// 創建全域實例
export const analyticsService = new AnalyticsService();

// React Hook for 使用分析服務
export const useAnalytics = () => {
  return {
    trackEvent: analyticsService.trackEvent.bind(analyticsService),
    trackPageView: analyticsService.trackPageView.bind(analyticsService),
    trackClick: analyticsService.trackClick.bind(analyticsService),
    trackFormSubmit: analyticsService.trackFormSubmit.bind(analyticsService),
    trackSearch: analyticsService.trackSearch.bind(analyticsService),
    trackEngagement: analyticsService.trackEngagement.bind(analyticsService),
    trackESGMetrics: analyticsService.trackESGMetrics.bind(analyticsService),
    getMetrics: analyticsService.getMetrics.bind(analyticsService),
    getEvents: analyticsService.getEvents.bind(analyticsService),
    createABTest: analyticsService.createABTest.bind(analyticsService),
    getABTestVariant: analyticsService.getABTestVariant.bind(analyticsService),
    recordABTestConversion: analyticsService.recordABTestConversion.bind(analyticsService),
    getABTests: analyticsService.getABTests.bind(analyticsService),
    exportData: analyticsService.exportData.bind(analyticsService)
  };
};