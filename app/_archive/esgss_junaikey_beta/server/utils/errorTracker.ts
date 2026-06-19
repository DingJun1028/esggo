import { LogCategory } from '../../shared/logger.shared.js';
import omniLogger from './omniLogger.js';

/**
 * server/utils/errorTracker.ts
 * 
 * Foundational error tracking for 5T Protocol compliance.
 * [Traceable] Hooks into centralized error logging
 * [Transparent] Provides aggregated error metrics
 * [Trustworthy] Environment-aware reporting
 */

interface ErrorMetrics {
    count: number;
    lastSeen: string;
    contexts: Set<string>;
}

class ErrorTracker {
    private static instance: ErrorTracker;
    private metrics: Map<string, ErrorMetrics> = new Map();
    private readonly MAX_TRACKED_ERRORS = 100;

    private constructor() {
        // Periodically log error stats
        setInterval(() => this.logStats(), 1000 * 60 * 60); // Hourly
    }

    public static getInstance(): ErrorTracker {
        if (!ErrorTracker.instance) {
            ErrorTracker.instance = new ErrorTracker();
        }
        return ErrorTracker.instance;
    }

    /**
     * Track an error for pattern analysis
     */
    public track(error: any, context: string = 'global'): void {
        const errorKey = this.serializeError(error);
        const now = new Date().toISOString();

        if (!this.metrics.has(errorKey)) {
            if (this.metrics.size >= this.MAX_TRACKED_ERRORS) {
                // Simple LRU-ish cleanup: remove first entry
                const firstKey = this.metrics.keys().next().value;
                if (firstKey) this.metrics.delete(firstKey);
            }

            this.metrics.set(errorKey, {
                count: 1,
                lastSeen: now,
                contexts: new Set([context])
            });
        } else {
            const current = this.metrics.get(errorKey)!;
            current.count++;
            current.lastSeen = now;
            current.contexts.add(context);
        }

        // High frequency error detection
        const metrics = this.metrics.get(errorKey)!;
        if (metrics.count > 50) {
            this.sendNotification(errorKey, metrics, context);
            omniLogger.warn(LogCategory.SYSTEM, `High intensity error detected: ${errorKey.substring(0, 50)}...`, {
                count: metrics.count,
                context
            });
        }
    }

    /**
     * Simulated notification hook for critical system issues
     * [5T: Trustworthy] Ensures visibility of recurring faults.
     */
    private sendNotification(errorKey: string, metrics: ErrorMetrics, context: string): void {
        // In a real system, this would integrate with Slack, PagerDuty, or Email
        omniLogger.info(LogCategory.SYSTEM, `[NOTIFICATION-HOOK] Alert sent for recurring error: ${errorKey}`, {
            frequency: metrics.count,
            lastSeen: metrics.lastSeen,
            context
        });
    }

    private serializeError(error: any): string {
        if (error instanceof Error) {
            return `${error.name}: ${error.message}`;
        }
        return typeof error === 'string' ? error : JSON.stringify(error);
    }

    private logStats(): void {
        const totalErrors = Array.from(this.metrics.values()).reduce((sum, m) => sum + m.count, 0);
        if (totalErrors > 0) {
            omniLogger.info(LogCategory.PERFORMANCE, `Error Tracker Heartbeat: ${totalErrors} errors tracked locally.`, {
                uniqueErrors: this.metrics.size,
                totalErrors
            });
        }
    }

    public getStats() {
        return Array.from(this.metrics.entries()).map(([key, value]) => ({
            error: key,
            count: value.count,
            lastSeen: value.lastSeen,
            contexts: Array.from(value.contexts)
        }));
    }
}

export const errorTracker = ErrorTracker.getInstance();
