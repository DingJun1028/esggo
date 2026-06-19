import { supabase } from '../db/supabaseClient.js';
import omniLogger, { LogCategory } from '../utils/omniLogger.js';

/**
 * server/services/BehaviorAnalyticsService.ts
 * Advanced Analytics & Habit Modeling
 */
export class BehaviorAnalyticsService {
    /**
     * Analyzes raw events for a user and calculates habit stats.
     * [Trackable] Maps activities to recurring patterns.
     */
    static async analyzeUserHabits(userId: string): Promise<any> {
        try {
            omniLogger.info(LogCategory.SYSTEM, `Starting habit analysis for user: ${userId}`);

            // 1. Fetch recent events
            const { data: events, error: eventError } = await supabase
                .from('behavioral_events')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .limit(500);

            if (eventError) throw eventError;
            if (!events || events.length === 0) return null;

            // 2. Simple Habit Modeling (Example Logic)
            const habitTags: string[] = [];
            const pageVisits: Record<string, number> = {};
            const hourlyActivity: Record<number, number> = {};

            events.forEach(event => {
                // Tracking page visits
                if (event.page_url) {
                    pageVisits[event.page_url] = (pageVisits[event.page_url] || 0) + 1;
                }

                // Tracking peak hours
                const hour = new Date(event.created_at).getUTCHours();
                hourlyActivity[hour] = (hourlyActivity[hour] || 0) + 1;
            });

            // Derive Tags
            if (events.some(e => e.event_type.includes('assessment'))) habitTags.push('ESG_Learner');
            if (events.length > 50) habitTags.push('PowerUser');

            const peakHour = Object.entries(hourlyActivity).sort((a, b) => b[1] - a[1])[0]?.[0];
            if (peakHour !== undefined && parseInt(peakHour) < 9) habitTags.push('EarlyBird');

            // 3. Upsert into user_habit_stats
            const { error: upsertError } = await supabase
                .from('user_habit_stats')
                .upsert({
                    user_id: userId,
                    habit_tags: habitTags,
                    most_visited_pages: pageVisits,
                    peak_activity_hour: peakHour !== undefined ? parseInt(peakHour) : null,
                    last_analyzed_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                });

            if (upsertError) throw upsertError;

            return { userId, habitTags, peakHour };
        } catch (error) {
            omniLogger.error(LogCategory.DATA, `BehaviorAnalyticsService: Habit analysis failed for ${userId}`, error);
            return null;
        }
    }

    /**
     * Generates a global trend summary for Big Data.
     */
    static async summarizeGlobalTrends(): Promise<void> {
        try {
            const now = new Date();
            const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);

            const { data, error } = await supabase
                .from('behavioral_events')
                .select('event_type')
                .gte('created_at', last24h.toISOString());

            if (error) throw error;

            const distribution: Record<string, number> = {};
            data.forEach(row => {
                distribution[row.event_type] = (distribution[row.event_type] || 0) + 1;
            });

            await supabase.from('big_data_summary').insert({
                category: 'global_event_distribution',
                summary_data: distribution,
                period_start: last24h.toISOString(),
                period_end: now.toISOString()
            });

            omniLogger.info(LogCategory.SYSTEM, 'Global trend summary generated.');
        } catch (error) {
            omniLogger.error(LogCategory.DATA, 'BehaviorAnalyticsService: Global summary failed', error);
        }
    }
}
