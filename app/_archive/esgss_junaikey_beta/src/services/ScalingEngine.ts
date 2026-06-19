import { omniCache } from './OmniCacheService.js';
import { omniLogger, LogCategory } from './omniLogger.js';

export interface ScalingDecision {
    action: 'UP' | 'DOWN' | 'NONE';
    reason: string;
    resourceType: 'MEMORY' | 'COMPUTE' | 'CACHE';
    confidence: number;
}

/**
 * Service 4.4: AI Auto-Scaling Engine
 * 負責分析系統負載並提供自動縮放建議
 */
export class ScalingEngine {
    private static instance: ScalingEngine;
    private readonly THRESHOLD_HIGH_HIT_RATE = 0.95;
    private readonly THRESHOLD_LOW_HIT_RATE = 0.40;
    private readonly THRESHOLD_HIGH_MEMORY = 80; // %

    private constructor() {
        omniLogger.info(LogCategory.SYSTEM, '🚀 ScalingEngine Initialized');
    }

    static getInstance(): ScalingEngine {
        if (!ScalingEngine.instance) {
            ScalingEngine.instance = new ScalingEngine();
        }
        return ScalingEngine.instance;
    }

    /**
     * 進行擴寫預測與縮放決策
     */
    public async evaluateScaling(): Promise<ScalingDecision[]> {
        const stats = omniCache.getStats();
        const decisions: ScalingDecision[] = [];

        // 1. 基於快取命中率的決策
        if (stats.hitRate < this.THRESHOLD_LOW_HIT_RATE && stats.totalItems > 100) {
            decisions.push({
                action: 'UP',
                reason: `Low Cache Hit Rate (${stats.hitRate}%). Suggesting cache expansion.`,
                resourceType: 'CACHE',
                confidence: 0.85
            });
        } else if (stats.hitRate > this.THRESHOLD_HIGH_HIT_RATE && stats.totalItems > 500) {
            decisions.push({
                action: 'DOWN',
                reason: `Hyperefficient Cache (${stats.hitRate}%). Opportunity for resource optimization.`,
                resourceType: 'CACHE',
                confidence: 0.7
            });
        }

        // 2. 基於記憶體使用的決策
        const memoryMB = stats.memoryUsage;
        if (memoryMB > 1024) { // 簡單假設 > 1GB 觸發警告
            decisions.push({
                action: 'UP',
                reason: `Cache Memory usage high (${memoryMB} MB).`,
                resourceType: 'MEMORY',
                confidence: 0.9
            });
        }

        if (decisions.length > 0) {
            omniLogger.info(LogCategory.SYSTEM, '📉 Scaling decisions generated', { decisions });
        }

        return decisions;
    }
}

export const scalingEngine = ScalingEngine.getInstance();
