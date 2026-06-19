/**
 * Omni - 奧秘圓通全功能規劃
 * 
 * 統一匯出所有奧秘圓通服務的核心入口點。
 * 
 * @version 1.0.0
 * @date 2026-02-09
 */

// Core Services
import {
    OmniGateway,
    OmniServiceRegistry,
    OmniSmartRouter,
    OmniServiceType,
    OmniRequest,
    OmniResponse,
    createOmniGateway,
    createOmniRequest
} from './OmniGateway.js';

export {
    OmniGateway,
    OmniServiceRegistry,
    OmniSmartRouter,
    OmniServiceType,
    OmniRequest,
    OmniResponse,
    createOmniGateway,
    createOmniRequest
};

import {
    OmniAgent,
    IntentRecognizer,
    TaskDecomposer,
    AgentTask,
    AgentSession,
    NaturalLanguageRequest,
    AgentResponse,
    createOmniAgent,
    createNaturalLanguageRequest
} from './OmniAgent.js';

export {
    OmniAgent,
    IntentRecognizer,
    TaskDecomposer,
    AgentTask,
    AgentSession,
    NaturalLanguageRequest,
    AgentResponse,
    createOmniAgent,
    createNaturalLanguageRequest
};

import {
    OmniMonitor,
    MetricsCollector,
    HealthChecker,
    AlertManager,
    PerformanceTracker,
    MonitorHealth,
    MonitorAlert,
    MonitorMetric,
    createOmniMonitor
} from './OmniMonitor.js';

export {
    OmniMonitor,
    MetricsCollector,
    HealthChecker,
    AlertManager,
    PerformanceTracker,
    MonitorHealth,
    MonitorAlert,
    MonitorMetric,
    createOmniMonitor
};

import {
    OmniCache,
    CacheStats,
    CacheConfig,
    CacheEntry,
    createOmniCache,
    cached
} from './OmniCache.js';

export {
    OmniCache,
    CacheStats,
    CacheConfig,
    CacheEntry,
    createOmniCache,
    cached
};

import {
    OmniQueue,
    OmniScheduler,
    QueueTask,
    QueueStats,
    QueueConfig,
    createOmniQueue,
    createOmniScheduler
} from './OmniQueue.js';

export {
    OmniQueue,
    OmniScheduler,
    QueueTask,
    QueueStats,
    QueueConfig,
    createOmniQueue,
    createOmniScheduler
};

// Route Handler
import {
    OmniRoute,
    createOmniRoute,
    createOmniMiddleware,
    OmniRouteConfig
} from '../routes/OmniRoute.js';

export {
    OmniRoute,
    createOmniRoute,
    createOmniMiddleware,
    OmniRouteConfig
};

// ============================================================================
// Main Omni Orchestrator
// ============================================================================

import { omniLogger, LogCategory, LogLevel } from '../../src/omni/infrastructure/logging/OmniLogger.js';

export interface OmniConfig {
    gateway?: {
        prefix?: string;
        enableAuth?: boolean;
        rateLimit?: number;
    };
    cache?: {
        maxSize?: number;
        defaultTTL?: number;
        strategy?: 'LRU' | 'LFU' | 'FIFO';
        enablePersistence?: boolean;
    };
    queue?: {
        name?: string;
        maxConcurrent?: number;
        defaultTimeout?: number;
        maxRetries?: number;
        enablePersistence?: boolean;
    };
}

export class Omni {
    private static instance: Omni;
    private gateway: OmniGateway;
    private agent: OmniAgent;
    private monitor: OmniMonitor;
    private cache: OmniCache;
    private queue: OmniQueue;
    private route: OmniRoute;
    private isInitialized = false;

    private constructor(config?: OmniConfig) {
        this.gateway = createOmniGateway();
        this.agent = createOmniAgent();
        this.monitor = createOmniMonitor();
        this.cache = createOmniCache(config?.cache);
        this.queue = createOmniQueue(config?.queue);
        this.route = createOmniRoute(config?.gateway);
    }

    static getInstance(config?: OmniConfig): Omni {
        if (!Omni.instance) {
            Omni.instance = new Omni(config);
        }
        return Omni.instance;
    }

    async initialize(): Promise<void> {
        if (this.isInitialized) {
            omniLogger.warn(LogCategory.SYSTEM, '[Omni] Already initialized');
            return;
        }

        omniLogger.info(LogCategory.SYSTEM, '[Omni] Initializing Omni (奧秘圓通) ...');

        // Initialize all services
        await Promise.all([
            this.gateway.initialize(),
            this.agent.initialize(),
            this.monitor.initialize(),
            this.cache.initialize(),
            this.queue.initialize(),
            this.route.initialize()
        ]);

        this.isInitialized = true;

        omniLogger.info(LogCategory.SYSTEM, '[Omni] Omni (奧秘圓通) initialized successfully');
    }

    getGateway(): OmniGateway {
        return this.gateway;
    }

    getAgent(): OmniAgent {
        return this.agent;
    }

    getMonitor(): OmniMonitor {
        return this.monitor;
    }

    getCache(): OmniCache {
        return this.cache;
    }

    getQueue(): OmniQueue {
        return this.queue;
    }

    getRoute(): OmniRoute {
        return this.route;
    }

    async healthCheck(): Promise<{
        overall: string;
        services: Record<string, unknown>;
        uptime: number;
    }> {
        const health = await this.monitor.getHealth();
        return {
            overall: health.overall,
            services: health.services,
            uptime: process.uptime()
        };
    }

    async shutdown(): Promise<void> {
        omniLogger.info(LogCategory.SYSTEM, '[Omni] Shutting down...');

        // Cleanup
        this.cache.clear();

        this.isInitialized = false;
        omniLogger.info(LogCategory.SYSTEM, '[Omni] Shutdown complete');
    }
}

// ============================================================================
// Factory Function
// ============================================================================

export function createOmni(config?: OmniConfig): Omni {
    return Omni.getInstance(config);
}

// ============================================================================
// Default Export
// ============================================================================

export default {
    Omni,
    OmniGateway,
    OmniAgent,
    OmniMonitor,
    OmniCache,
    OmniQueue,
    OmniRoute,
    createOmni,
    createOmniGateway,
    createOmniAgent,
    createOmniMonitor,
    createOmniCache,
    createOmniQueue,
    createOmniRoute
};
