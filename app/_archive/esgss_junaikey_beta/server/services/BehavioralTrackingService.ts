import { supabase } from '../db/supabaseClient.js';
import omniLogger, { LogCategory } from '../utils/omniLogger.js';
import { OmniError, ErrorCode } from '../utils/omniError.js';
import crypto from 'crypto';

/**
 * server/services/BehavioralTrackingService.ts
 * 5T Protocol Behavioral Tracking Layer
 */

export interface IUserEvent {
    userId?: string;
    eventType: string;
    sessionId?: string;
    pageUrl?: string;
    metadata?: any;
}

export class BehavioralTrackingService {
    /**
     * Tracks a user behavioral event with 5T integrity.
     * [Trustworthy] Hashed for immutability.
     * [Traceable] Linked to user_id and session.
     */
    static async track(event: IUserEvent): Promise<void> {
        try {
            const timestamp = Date.now();
            const dataToHash = JSON.stringify({
                userId: event.userId,
                eventType: event.eventType,
                sessionId: event.sessionId,
                pageUrl: event.pageUrl,
                metadata: event.metadata,
                timestamp
            });

            const dataHash = crypto.createHash('sha256').update(dataToHash).digest('hex');

            const { error } = await supabase.from('behavioral_events').insert({
                user_id: event.userId,
                event_type: event.eventType,
                session_id: event.sessionId,
                page_url: event.pageUrl,
                metadata: event.metadata || {},
                data_hash: dataHash
            });

            if (error) {
                // If the table doesn't exist yet, we still want to log the event in dev
                omniLogger.warn(LogCategory.DATA, `BehavioralTrackingService: DB insert failed (is table behavioral_events created?)`, { error: error.message });
                return;
            }

            omniLogger.debug(LogCategory.SYSTEM, `Behavioral event tracked: ${event.eventType}`, { dataHash });
        } catch (error) {
            omniLogger.error(LogCategory.DATA, 'BehavioralTrackingService: Failed to track event', error);
        }
    }

    /**
     * Aggregates event data for funnel analysis.
     */
    static async getEventCountsGrouped(): Promise<Record<string, number>> {
        try {
            const { data, error } = await supabase
                .from('behavioral_events')
                .select('event_type');

            if (error) throw error;

            const counts: Record<string, number> = {};
            data.forEach(row => {
                counts[row.event_type] = (counts[row.event_type] || 0) + 1;
            });

            return counts;
        } catch (error) {
            omniLogger.error(LogCategory.DATA, 'BehavioralTrackingService: Failed to get event counts', error);
            return {};
        }
    }

    /**
     * Gets calculated habits for a user.
     */
    static async getUserHabits(userId: string): Promise<any> {
        try {
            const { data, error } = await supabase
                .from('user_habit_stats')
                .select('*')
                .eq('user_id', userId)
                .single();

            if (error && error.code !== 'PGRST116') throw error;
            return data;
        } catch (error) {
            omniLogger.error(LogCategory.DATA, `BehavioralTrackingService: Failed to get habits for ${userId}`, error);
            return null;
        }
    }

    /**
     * Gets daily activity counts for the last 365 days.
     */
    static async getDailyActivityCounts(): Promise<{ date: string; count: number }[]> {
        try {
            const now = new Date();
            const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);

            const { data, error } = await supabase
                .from('behavioral_events')
                .select('created_at')
                .gte('created_at', yearAgo.toISOString());

            if (error) throw error;

            const counts: Record<string, number> = {};
            data.forEach((row: any) => {
                const date = new Date(row.created_at).toISOString().split('T')[0];
                counts[date] = (counts[date] || 0) + 1;
            });

            // Map to array format
            const result: { date: string; count: number }[] = [];
            for (let i = 364; i >= 0; i--) {
                const d = new Date(now);
                d.setDate(d.getDate() - i);
                const dateStr = d.toISOString().split('T')[0];
                result.push({
                    date: dateStr,
                    count: counts[dateStr] || 0
                });
            }

            return result;
        } catch (error) {
            omniLogger.error(LogCategory.DATA, 'BehavioralTrackingService: Failed to get daily activity', error);
            return [];
        }
    }

    /**
     * Aggregates event data for funnel analysis with specific steps.
     */
    static async getEventCountsForFunnel(steps: string[]): Promise<Record<string, number>> {
        try {
            const { data, error } = await supabase
                .from('behavioral_events')
                .select('event_type')
                .in('event_type', steps);

            if (error) throw error;

            const counts: Record<string, number> = {};
            steps.forEach(step => counts[step] = 0); // Initialize

            data.forEach(row => {
                if (counts.hasOwnProperty(row.event_type)) {
                    counts[row.event_type]++;
                }
            });

            return counts;
        } catch (error) {
            omniLogger.error(LogCategory.DATA, 'BehavioralTrackingService: Failed to get funnel counts', error);
            return {};
        }
    }
}
