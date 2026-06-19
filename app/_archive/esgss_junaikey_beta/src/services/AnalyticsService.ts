export interface AnalyticsEvent {
    category: string;
    action: string;
    label?: string;
    value?: number;
    metadata?: Record<string, any>;
}

export interface AnalyticsAdapter {
    initialize(): void;
    trackEvent(event: AnalyticsEvent): void;
    trackPageView(path: string): void;
    identifyUser(userId: string, traits?: Record<string, any>): void;
}

class ConsoleAdapter implements AnalyticsAdapter {
    initialize() {
        console.log('[Analytics] Initialized (Console Mode)');
    }
    trackEvent(event: AnalyticsEvent) {
        console.groupCollapsed(`[Analytics] Event: ${event.category} - ${event.action}`);
        console.log(event);
        console.groupEnd();
    }
    trackPageView(path: string) {
        console.log(`[Analytics] PageView: ${path}`);
    }
    identifyUser(userId: string, traits?: Record<string, any>) {
        console.log(`[Analytics] Identify: ${userId}`, traits);
    }
}

class AnalyticsService {
    private adapter: AnalyticsAdapter;
    private isInitialized = false;

    constructor() {
        // In strict enterprise mode, this would switch based on env (e.g., Mixpanel/GoogleAnalytics)
        this.adapter = new ConsoleAdapter();
    }

    public init() {
        if (this.isInitialized) return;
        this.adapter.initialize();
        this.isInitialized = true;
    }

    public trackEvent(category: string, action: string, label?: string, value?: number, metadata?: Record<string, any>) {
        this.adapter.trackEvent({ category, action, label, value, metadata });
    }

    public trackPageView(path: string) {
        this.adapter.trackPageView(path);
    }

    public identify(userId: string, traits?: Record<string, any>) {
        this.adapter.identifyUser(userId, traits);
    }
}

export const analyticsService = new AnalyticsService();
