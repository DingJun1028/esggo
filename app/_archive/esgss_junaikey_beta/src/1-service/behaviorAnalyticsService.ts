import { omniLogger, LogCategory } from '@infra/logging/OmniLogger';

const API_BEHAVIOR = '/api/behavior';

export interface HabitSummary {
    userId: string;
    habitTags: string[];
    peakHour: number;
}

export interface HeatmapPoint {
    x: string;
    y: string;
    value: number;
}

export interface GlobalTrendDistribution {
    summary_data: Record<string, number>;
    top_event_types: { type: string; count: number }[];
    period_start: string;
    period_end: string;
}

/**
 * Funnel stage data structure
 */
export interface FunnelData {
    name: string;
    value: number;
    description?: string;
    fill?: string;
}

/**
 * behaviorAnalyticsService
 * Frontend service for user behavior tracking and insight retrieval.
 */
export const behaviorAnalyticsService = {
    /**
     * Track a behavioral event.
     */
    trackEvent: async (event: {
        eventType: string;
        userId?: string;
        pageUrl?: string;
        metadata?: any;
    }): Promise<void> => {
        try {
            await fetch(`${API_BEHAVIOR}/track`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(event),
            });
        } catch (error) {
            omniLogger.error(LogCategory.DATA, 'Failed to track behavioral event', error);
        }
    },

    /**
     * Get habit summary for a specific user.
     */
    getUserHabits: async (userId: string): Promise<HabitSummary | null> => {
        try {
            const response = await fetch(`${API_BEHAVIOR}/habits/${userId}`);
            if (!response.ok) throw new Error('Failed to fetch habit stats');
            const { data } = await response.json();
            return data;
        } catch (error) {
            omniLogger.error(LogCategory.DATA, `Failed to fetch habits for ${userId}`, error);
            return null;
        }
    },

    /**
     * Trigger and get the latest habit analysis for a user.
     */
    analyzeHabits: async (userId: string): Promise<HabitSummary | null> => {
        try {
            const response = await fetch(`${API_BEHAVIOR}/analyze/${userId}`, { method: 'POST' });
            if (!response.ok) throw new Error('Analysis request failed');
            const { result } = await response.json();
            return result;
        } catch (error) {
            omniLogger.error(LogCategory.DATA, `Analysis failed for ${userId}`, error);
            return null;
        }
    },

    /**
     * Get global trend distribution from the last 24h.
     */
    getGlobalTrends: async (): Promise<GlobalTrendDistribution | null> => {
        try {
            const response = await fetch(`${API_BEHAVIOR}/trends`);
            if (!response.ok) throw new Error('Failed to fetch global trends');
            const { data } = await response.json();
            return data;
        } catch (error) {
            omniLogger.error(LogCategory.DATA, 'Global trends fetch failed', error);
            return null;
        }
    },

    /**
     * Get interaction heatmap data points.
     */
    getHeatmapData: async (): Promise<HeatmapPoint[]> => {
        try {
            const response = await fetch(`${API_BEHAVIOR}/heatmap`);
            if (!response.ok) throw new Error('Failed to fetch heatmap');
            const { data } = await response.json();
            return data;
        } catch (error) {
            omniLogger.error(LogCategory.DATA, 'Heatmap fetch failed', error);
            return [];
        }
    },

    /**
     * Get activity density data (e.g. for GitHub-style heatmap).
     */
    getActivityDensity: async (): Promise<{ date: string; count: number }[]> => {
        try {
            const response = await fetch(`${API_BEHAVIOR}/activity`);
            if (!response.ok) throw new Error('Failed to fetch activity density');
            const { data } = await response.json();
            return data;
        } catch (error) {
            omniLogger.error(LogCategory.DATA, 'Activity density fetch failed', error);
            return [];
        }
    },

    /**
     * Get funnel data for specified steps.
     */
    getFunnelData: async (steps?: string[]): Promise<FunnelData[]> => {
        try {
            const url = steps ? `${API_BEHAVIOR}/funnel?steps=${steps.join(',')}` : `${API_BEHAVIOR}/funnel`;
            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch funnel data');
            const { data } = await response.json();
            return data || [];
        } catch (error) {
            omniLogger.error(LogCategory.DATA, 'Funnel data fetch failed', error);
            return [];
        }
    }
};

export default behaviorAnalyticsService;
