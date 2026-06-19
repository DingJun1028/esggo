import { useState, useEffect, useCallback } from 'react';
import behaviorAnalyticsService, {
    HabitSummary,
    HeatmapPoint,
    GlobalTrendDistribution
} from '../1-service/behaviorAnalyticsService';

interface UseBehaviorAnalyticsReturn {
    trends: GlobalTrendDistribution | null;
    heatmap: HeatmapPoint[];
    userHabits: HabitSummary | null;
    activityData: { date: string; count: number }[];
    funnelData: any[];
    isLoading: boolean;
    refreshAll: () => Promise<void>;
    trackEvent: (eventType: string, metadata?: any) => Promise<void>;
    analyzeUser: (userId: string) => Promise<void>;
}

/**
 * useBehaviorAnalytics
 * Custom hook for behavioral analytics management in the UI.
 */
export const useBehaviorAnalytics = (userId?: string): UseBehaviorAnalyticsReturn => {
    const [trends, setTrends] = useState<GlobalTrendDistribution | null>(null);
    const [heatmap, setHeatmap] = useState<HeatmapPoint[]>([]);
    const [userHabits, setUserHabits] = useState<HabitSummary | null>(null);
    const [activityData, setActivityData] = useState<{ date: string; count: number }[]>([]);
    const [funnelData, setFunnelData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const refreshAll = useCallback(async () => {
        setIsLoading(true);
        try {
            const [trendRes, heatRes, activityRes, funnelRes] = await Promise.all([
                behaviorAnalyticsService.getGlobalTrends(),
                behaviorAnalyticsService.getHeatmapData(),
                behaviorAnalyticsService.getActivityDensity(),
                behaviorAnalyticsService.getFunnelData()
            ]);

            setTrends(trendRes);
            setHeatmap(heatRes);
            setActivityData(activityRes);
            setFunnelData(funnelRes);

            if (userId) {
                const habits = await behaviorAnalyticsService.getUserHabits(userId);
                setUserHabits(habits);
            }
        } catch (error) {
            console.error('Failed to refresh behavioral analytics', error);
        } finally {
            setIsLoading(false);
        }
    }, [userId]);

    const trackEvent = async (eventType: string, metadata?: any) => {
        await behaviorAnalyticsService.trackEvent({
            eventType,
            userId,
            pageUrl: window.location.pathname,
            metadata
        });
    };

    const analyzeUser = async (uid: string) => {
        const result = await behaviorAnalyticsService.analyzeHabits(uid);
        if (result) setUserHabits(result);
    };

    useEffect(() => {
        refreshAll();
    }, [refreshAll]);

    return {
        trends,
        heatmap,
        userHabits,
        activityData,
        funnelData,
        isLoading,
        refreshAll,
        trackEvent,
        analyzeUser
    };
};

export default useBehaviorAnalytics;
