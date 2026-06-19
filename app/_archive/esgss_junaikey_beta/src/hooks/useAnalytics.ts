import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { analyticsService } from '@/services/AnalyticsService';

export const useAnalytics = () => {
    const location = useLocation();

    // Auto-track page views
    useEffect(() => {
        analyticsService.trackPageView(location.pathname);
    }, [location]);

    return {
        trackEvent: (category: string, action: string, label?: string, value?: number, metadata?: Record<string, any>) => {
            analyticsService.trackEvent(category, action, label, value, metadata);
        },
        identify: (userId: string, traits?: Record<string, any>) => {
            analyticsService.identify(userId, traits);
        }
    };
};

export const usePageTracking = () => {
    const location = useLocation();
    useEffect(() => {
        analyticsService.trackPageView(location.pathname);
    }, [location]);
};
