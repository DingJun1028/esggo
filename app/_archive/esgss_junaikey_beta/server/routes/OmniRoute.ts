/**
 * OmniRoute - 奧秘圓通統一 API 路由層
 * 
 * 作為所有 Omni 服務的統一 API 入口，提供 RESTful 風格的
 * 端點來訪問所有奧秘圓通功能。
 * 
 * @version 1.0.0
 * @date 2026-02-09
 */

import { Router, Request, Response, NextFunction } from 'express';
import { omniLogger, LogCategory, LogLevel } from '../../src/omni/infrastructure/logging/OmniLogger.js';
import {
    OmniGateway,
    createOmniGateway,
    createOmniRequest,
    OmniServiceType,
    OmniContext
} from '../services/OmniGateway.js';
import {
    OmniAgent,
    createOmniAgent,
    createNaturalLanguageRequest,
    AgentTask
} from '../services/OmniAgent.js';
import {
    OmniMonitor,
    createOmniMonitor,
    MonitorHealth,
    MonitorAlert
} from '../services/OmniMonitor.js';
import {
    OmniCache,
    createOmniCache,
    CacheStats
} from '../services/OmniCache.js';
import {
    OmniQueue,
    createOmniQueue,
    QueueStats,
    OmniScheduler,
    createOmniScheduler
} from '../services/OmniQueue.js';
import { v4 as uuidv4 } from 'uuid';
import { omniAvatarService, OmniAvatarService } from '../../src/services/OmniAvatarService.js';
import { L1AssessmentService } from '../services/L1AssessmentService.js';

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface OmniRouteConfig {
    prefix: string;
    enableAuth: boolean;
    rateLimit: number;
    corsOrigin: string;
}

export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: {
        code: string;
        message: string;
        details?: unknown;
    };
    meta: {
        requestId: string;
        timestamp: number;
        version: string;
    };
}

// ============================================================================
// Request Middleware
// ============================================================================

export function createOmniMiddleware() {
    const router = Router();

    // Request ID middleware
    router.use((req: Request, _res: Response, next: NextFunction) => {
        (req as any).requestId = req.headers['x-request-id'] || uuidv4();
        next();
    });

    // Logging middleware
    router.use((req: Request, _res: Response, next: NextFunction) => {
        omniLogger.info(LogCategory.API, `[OmniRoute] Incoming request`, {
            method: req.method,
            path: req.path,
            requestId: (req as any).requestId
        });
        next();
    });

    // Error handling middleware
    router.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
        omniLogger.error(LogCategory.API, '[OmniRoute] Request error', { error: err.message });
        res.status(500).json({
            success: false,
            error: {
                code: 'INTERNAL_ERROR',
                message: err.message
            },
            meta: {
                requestId: (_req as any).requestId,
                timestamp: Date.now(),
                version: '1.0.0'
            }
        });
    });

    return router;
}

// ============================================================================
// Main OmniRoute Class
// ============================================================================

export class OmniRoute {
    private static instance: OmniRoute;
    private router: Router;
    private gateway: OmniGateway;
    private agent: OmniAgent;
    private monitor: OmniMonitor;
    private cache: OmniCache;
    private queue: OmniQueue;
    private scheduler: OmniScheduler;
    private avatarService: OmniAvatarService;
    private assessmentService: typeof L1AssessmentService;
    private config: OmniRouteConfig;
    private isInitialized = false;

    private constructor(config?: Partial<OmniRouteConfig>) {
        this.config = {
            prefix: config?.prefix || '/api/omni',
            enableAuth: config?.enableAuth ?? true,
            rateLimit: config?.rateLimit || 100,
            corsOrigin: config?.corsOrigin || '*'
        };

        this.router = Router();
        this.gateway = createOmniGateway();
        this.agent = createOmniAgent();
        this.monitor = createOmniMonitor();
        this.cache = createOmniCache();
        this.queue = createOmniQueue();
        this.scheduler = createOmniScheduler();
        this.avatarService = omniAvatarService;
        this.assessmentService = L1AssessmentService;
    }


    static getInstance(config?: Partial<OmniRouteConfig>): OmniRoute {
        if (!OmniRoute.instance) {
            OmniRoute.instance = new OmniRoute(config);
        }
        return OmniRoute.instance;
    }

    async initialize(): Promise<void> {
        if (this.isInitialized) {
            omniLogger.warn(LogCategory.SYSTEM, '[OmniRoute] Already initialized');
            return;
        }

        omniLogger.info(LogCategory.SYSTEM, '[OmniRoute] Initializing Omni Route...', {
            prefix: this.config.prefix
        });

        // Initialize all services
        await Promise.all([
            this.gateway.initialize(),
            this.agent.initialize(),
            this.monitor.initialize(),
            this.cache.initialize(),
            this.queue.initialize(),
            this.scheduler.initialize()
        ]);

        // Setup routes
        this.setupRoutes();

        this.isInitialized = true;
        omniLogger.info(LogCategory.SYSTEM, '[OmniRoute] Omni Route initialized successfully');
    }

    private setupRoutes(): void {
        // Health check
        this.router.get('/health', this.healthCheck.bind(this));
        this.router.get('/health/detailed', this.detailedHealthCheck.bind(this));

        // Gateway routes
        this.router.post('/gateway/process', this.processGatewayRequest.bind(this));
        this.router.get('/gateway/services', this.getServices.bind(this));

        // Agent routes
        this.router.post('/agent/chat', this.chatWithAgent.bind(this));
        this.router.get('/agent/session/:sessionId', this.getSession.bind(this));
        this.router.get('/agent/tasks/:userId', this.getUserTasks.bind(this));
        this.router.delete('/agent/tasks/:taskId', this.cancelTask.bind(this));

        // Monitor routes
        this.router.get('/monitor/metrics', this.getMetrics.bind(this));
        this.router.get('/monitor/alerts', this.getAlerts.bind(this));
        this.router.post('/monitor/alerts/:alertId/acknowledge', this.acknowledgeAlert.bind(this));
        this.router.post('/monitor/alerts/:alertId/resolve', this.resolveAlert.bind(this));

        // Cache routes
        this.router.get('/cache/stats', this.getCacheStats.bind(this));
        this.router.delete('/cache', this.clearCache.bind(this));
        this.router.delete('/cache/by-tags', this.deleteCacheByTags.bind(this));

        // Queue routes
        this.router.get('/queue/stats', this.getQueueStats.bind(this));
        this.router.post('/queue/enqueue', this.enqueueTask.bind(this));
        this.router.post('/queue/enqueue-batch', this.enqueueBatchTasks.bind(this));
        this.router.get('/queue/pending', this.getPendingTasks.bind(this));
        this.router.get('/queue/failed', this.getFailedTasks.bind(this));
        this.router.delete('/queue/tasks/:taskId', this.cancelQueueTask.bind(this));
        this.router.post('/queue/tasks/:taskId/retry', this.retryQueueTask.bind(this));
        this.router.delete('/queue/clear-failed', this.clearFailedTasks.bind(this));

        // Scheduler routes
        this.router.post('/scheduler/schedule', this.scheduleTask.bind(this));
        this.router.delete('/scheduler/jobs/:jobId', this.cancelScheduledJob.bind(this));

        // MVP Avatar routes
        this.router.post('/avatar/sync', this.syncAvatar.bind(this));
        this.router.post('/avatar/crystallize', this.crystallizeKnowledge.bind(this));

        // MVP Assessment routes
        this.router.post('/assessment/l1', this.performL1Assessment.bind(this));

        // Service info
        this.router.get('/info', this.getServiceInfo.bind(this));
    }

    // ============================================================================
    // Health Check Endpoints
    // ============================================================================

    private async healthCheck(_req: Request, res: Response): Promise<void> {
        try {
            const health = await this.monitor.getHealth();
            const status = health.overall === 'HEALTHY' ? 200 : health.overall === 'DEGRADED' ? 200 : 503;

            res.status(status).json({
                success: health.overall !== 'DOWN',
                data: health,
                meta: {
                    requestId: uuidv4(),
                    timestamp: Date.now(),
                    version: '1.0.0'
                }
            });
        } catch (error) {
            res.status(503).json({
                success: false,
                error: {
                    code: 'HEALTH_CHECK_FAILED',
                    message: (error as Error).message
                },
                meta: {
                    requestId: uuidv4(),
                    timestamp: Date.now(),
                    version: '1.0.0'
                }
            });
        }
    }

    private async detailedHealthCheck(_req: Request, res: Response): Promise<void> {
        try {
            const health = await this.monitor.getHealth();
            const performance = this.monitor.getPerformance();
            const queueStats = await this.queue.getStats();
            const cacheStats = await this.cache.getStats();

            res.json({
                success: true,
                data: {
                    health,
                    performance,
                    queue: queueStats,
                    cache: cacheStats
                },
                meta: {
                    requestId: uuidv4(),
                    timestamp: Date.now(),
                    version: '1.0.0'
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: {
                    code: 'HEALTH_CHECK_FAILED',
                    message: (error as Error).message
                },
                meta: {
                    requestId: uuidv4(),
                    timestamp: Date.now(),
                    version: '1.0.0'
                }
            });
        }
    }

    // ============================================================================
    // Gateway Endpoints
    // ============================================================================

    private async processGatewayRequest(req: Request, res: Response): Promise<void> {
        try {
            const { type, action, payload, context } = req.body;

            if (!type || !action) {
                res.status(400).json({
                    success: false,
                    error: {
                        code: 'INVALID_REQUEST',
                        message: 'Missing required fields: type, action'
                    },
                    meta: {
                        requestId: uuidv4(),
                        timestamp: Date.now(),
                        version: '1.0.0'
                    }
                });
                return;
            }

            const request = createOmniRequest(
                type as OmniServiceType,
                action,
                payload || {},
                context
            );

            const response = await this.gateway.processRequest(request);

            res.json(response);
        } catch (error) {
            res.status(500).json({
                success: false,
                error: {
                    code: 'GATEWAY_ERROR',
                    message: (error as Error).message
                },
                meta: {
                    requestId: uuidv4(),
                    timestamp: Date.now(),
                    version: '1.0.0'
                }
            });
        }
    }

    private async getServices(_req: Request, res: Response): Promise<void> {
        const services = this.gateway.getServiceInfo();
        res.json({
            success: true,
            data: services,
            meta: {
                requestId: uuidv4(),
                timestamp: Date.now(),
                version: '1.0.0'
            }
        });
    }

    // ============================================================================
    // Agent Endpoints
    // ============================================================================

    private async chatWithAgent(req: Request, res: Response): Promise<void> {
        try {
            const { text, userId, sessionId, context } = req.body;

            if (!text) {
                res.status(400).json({
                    success: false,
                    error: {
                        code: 'INVALID_REQUEST',
                        message: 'Missing required field: text'
                    },
                    meta: {
                        requestId: uuidv4(),
                        timestamp: Date.now(),
                        version: '1.0.0'
                    }
                });
                return;
            }

            const nlpRequest = createNaturalLanguageRequest(text, userId, context);
            const response = await this.agent.processNaturalLanguage(nlpRequest);

            res.json(response);
        } catch (error) {
            res.status(500).json({
                success: false,
                error: {
                    code: 'AGENT_ERROR',
                    message: (error as Error).message
                },
                meta: {
                    requestId: uuidv4(),
                    timestamp: Date.now(),
                    version: '1.0.0'
                }
            });
        }
    }

    private async getSession(req: Request, res: Response): Promise<void> {
        try {
            const { sessionId } = req.params;
            const session = await this.agent.getSession(sessionId);

            res.json({
                success: true,
                data: session,
                meta: {
                    requestId: uuidv4(),
                    timestamp: Date.now(),
                    version: '1.0.0'
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: {
                    code: 'SESSION_ERROR',
                    message: (error as Error).message
                },
                meta: {
                    requestId: uuidv4(),
                    timestamp: Date.now(),
                    version: '1.0.0'
                }
            });
        }
    }

    private async getUserTasks(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.params;
            const tasks = await this.agent.getActiveTasks(userId);

            res.json({
                success: true,
                data: tasks,
                meta: {
                    requestId: uuidv4(),
                    timestamp: Date.now(),
                    version: '1.0.0'
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: {
                    code: 'TASKS_ERROR',
                    message: (error as Error).message
                },
                meta: {
                    requestId: uuidv4(),
                    timestamp: Date.now(),
                    version: '1.0.0'
                }
            });
        }
    }

    private async cancelTask(req: Request, res: Response): Promise<void> {
        try {
            const { taskId } = req.params;
            const success = await this.agent.cancelTask(taskId);

            res.json({
                success,
                data: { cancelled: success },
                meta: {
                    requestId: uuidv4(),
                    timestamp: Date.now(),
                    version: '1.0.0'
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: {
                    code: 'CANCEL_ERROR',
                    message: (error as Error).message
                },
                meta: {
                    requestId: uuidv4(),
                    timestamp: Date.now(),
                    version: '1.0.0'
                }
            });
        }
    }

    // ============================================================================
    // Monitor Endpoints
    // ============================================================================

    private async getMetrics(req: Request, res: Response): Promise<void> {
        try {
            const { name, limit } = req.query;
            const metrics = this.monitor.getMetrics(name as string);
            const aggregated = this.monitor.getAggregatedMetrics();

            res.json({
                success: true,
                data: {
                    metrics: metrics.slice(0, Number(limit) || 100),
                    aggregated
                },
                meta: {
                    requestId: uuidv4(),
                    timestamp: Date.now(),
                    version: '1.0.0'
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: {
                    code: 'METRICS_ERROR',
                    message: (error as Error).message
                },
                meta: {
                    requestId: uuidv4(),
                    timestamp: Date.now(),
                    version: '1.0.0'
                }
            });
        }
    }

    private async getAlerts(_req: Request, res: Response): Promise<void> {
        try {
            const alerts = this.monitor.getActiveAlerts();

            res.json({
                success: true,
                data: alerts,
                meta: {
                    requestId: uuidv4(),
                    timestamp: Date.now(),
                    version: '1.0.0'
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: {
                    code: 'ALERTS_ERROR',
                    message: (error as Error).message
                },
                meta: {
                    requestId: uuidv4(),
                    timestamp: Date.now(),
                    version: '1.0.0'
                }
            });
        }
    }

    private async acknowledgeAlert(req: Request, res: Response): Promise<void> {
        try {
            const { alertId } = req.params;
            const success = this.monitor.acknowledgeAlert(alertId);

            res.json({
                success,
                data: { acknowledged: success },
                meta: {
                    requestId: uuidv4(),
                    timestamp: Date.now(),
                    version: '1.0.0'
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: {
                    code: 'ALERT_ERROR',
                    message: (error as Error).message
                },
                meta: {
                    requestId: uuidv4(),
                    timestamp: Date.now(),
                    version: '1.0.0'
                }
            });
        }
    }

    private async resolveAlert(req: Request, res: Response): Promise<void> {
        try {
            const { alertId } = req.params;
            const success = this.monitor.resolveAlert(alertId);

            res.json({
                success,
                data: { resolved: success },
                meta: {
                    requestId: uuidv4(),
                    timestamp: Date.now(),
                    version: '1.0.0'
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: {
                    code: 'ALERT_ERROR',
                    message: (error as Error).message
                },
                meta: {
                    requestId: uuidv4(),
                    timestamp: Date.now(),
                    version: '1.0.0'
                }
            });
        }
    }

    // ============================================================================
    // Cache Endpoints
    // ============================================================================

    private async getCacheStats(_req: Request, res: Response): Promise<void> {
        try {
            const stats = await this.cache.getStats();

            res.json({
                success: true,
                data: stats,
                meta: {
                    requestId: uuidv4(),
                    timestamp: Date.now(),
                    version: '1.0.0'
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: {
                    code: 'CACHE_ERROR',
                    message: (error as Error).message
                },
                meta: {
                    requestId: uuidv4(),
                    timestamp: Date.now(),
                    version: '1.0.0'
                }
            });
        }
    }

    private async clearCache(_req: Request, res: Response): Promise<void> {
        try {
            await this.cache.clear();

            res.json({
                success: true,
                data: { message: 'Cache cleared' },
                meta: {
                    requestId: uuidv4(),
                    timestamp: Date.now(),
                    version: '1.0.0'
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: {
                    code: 'CACHE_ERROR',
                    message: (error as Error).message
                },
                meta: {
                    requestId: uuidv4(),
                    timestamp: Date.now(),
                    version: '1.0.0'
                }
            });
        }
    }

    private async deleteCacheByTags(req: Request, res: Response): Promise<void> {
        try {
            const { tags } = req.body;

            if (!tags || !Array.isArray(tags)) {
                res.status(400).json({
                    success: false,
                    error: {
                        code: 'INVALID_REQUEST',
                        message: 'Missing required field: tags (array)'
                    },
                    meta: {
                        requestId: uuidv4(),
                        timestamp: Date.now(),
                        version: '1.0.0'
                    }
                });
                return;
            }

            const deleted = await this.cache.deleteByTags(tags);

            res.json({
                success: true,
                data: { deleted },
                meta: {
                    requestId: uuidv4(),
                    timestamp: Date.now(),
                    version: '1.0.0'
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: {
                    code: 'CACHE_ERROR',
                    message: (error as Error).message
                },
                meta: {
                    requestId: uuidv4(),
                    timestamp: Date.now(),
                    version: '1.0.0'
                }
            });
        }
    }

    // ============================================================================
    // Queue Endpoints
    // ============================================================================

    private async getQueueStats(_req: Request, res: Response): Promise<void> {
        try {
            const stats = await this.queue.getStats();

            res.json({
                success: true,
                data: stats,
                meta: {
                    requestId: uuidv4(),
                    timestamp: Date.now(),
                    version: '1.0.0'
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: {
                    code: 'QUEUE_ERROR',
                    message: (error as Error).message
                },
                meta: {
                    requestId: uuidv4(),
                    timestamp: Date.now(),
                    version: '1.0.0'
                }
            });
        }
    }

    private async enqueueTask(req: Request, res: Response): Promise<void> {
        try {
            const { type, payload, priority, scheduledAt, metadata } = req.body;

            if (!type || !payload) {
                res.status(400).json({
                    success: false,
                    error: {
                        code: 'INVALID_REQUEST',
                        message: 'Missing required fields: type, payload'
                    },
                    meta: {
                        requestId: uuidv4(),
                        timestamp: Date.now(),
                        version: '1.0.0'
                    }
                });
                return;
            }

            const task = await this.queue.enqueue(type, payload, {
                priority,
                scheduledAt,
                metadata
            });

            res.json({
                success: true,
                data: task,
                meta: {
                    requestId: uuidv4(),
                    timestamp: Date.now(),
                    version: '1.0.0'
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: {
                    code: 'QUEUE_ERROR',
                    message: (error as Error).message
                },
                meta: {
                    requestId: uuidv4(),
                    timestamp: Date.now(),
                    version: '1.0.0'
                }
            });
        }
    }

    private async enqueueBatchTasks(req: Request, res: Response): Promise<void> {
        try {
            const { tasks } = req.body;

            if (!tasks || !Array.isArray(tasks)) {
                res.status(400).json({
                    success: false,
                    error: {
                        code: 'INVALID_REQUEST',
                        message: 'Missing required field: tasks (array)'
                    },
                    meta: {
                        requestId: uuidv4(),
                        timestamp: Date.now(),
                        version: '1.0.0'
                    }
                });
                return;
            }

            const created = await this.queue.enqueueBatch(tasks);

            res.json({
                success: true,
                data: created,
                meta: {
                    requestId: uuidv4(),
                    timestamp: Date.now(),
                    version: '1.0.0'
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: {
                    code: 'QUEUE_ERROR',
                    message: (error as Error).message
                },
                meta: {
                    requestId: uuidv4(),
                    timestamp: Date.now(),
                    version: '1.0.0'
                }
            });
        }
    }

    private async getPendingTasks(req: Request, res: Response): Promise<void> {
        try {
            const { limit } = req.query;
            const tasks = await this.queue.getPendingTasks(Number(limit) || 100);

            res.json({
                success: true,
                data: tasks,
                meta: {
                    requestId: uuidv4(),
                    timestamp: Date.now(),
                    version: '1.0.0'
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: {
                    code: 'QUEUE_ERROR',
                    message: (error as Error).message
                },
                meta: {
                    requestId: uuidv4(),
                    timestamp: Date.now(),
                    version: '1.0.0'
                }
            });
        }
    }

    private async getFailedTasks(req: Request, res: Response): Promise<void> {
        try {
            const { limit } = req.query;
            const tasks = await this.queue.getFailedTasks(Number(limit) || 100);

            res.json({
                success: true,
                data: tasks,
                meta: {
                    requestId: uuidv4(),
                    timestamp: Date.now(),
                    version: '1.0.0'
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: {
                    code: 'QUEUE_ERROR',
                    message: (error as Error).message
                },
                meta: {
                    requestId: uuidv4(),
                    timestamp: Date.now(),
                    version: '1.0.0'
                }
            });
        }
    }

    private async cancelQueueTask(req: Request, res: Response): Promise<void> {
        try {
            const { taskId } = req.params;
            const success = await this.queue.cancelTask(taskId);

            res.json({
                success,
                data: { cancelled: success },
                meta: {
                    requestId: uuidv4(),
                    timestamp: Date.now(),
                    version: '1.0.0'
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: {
                    code: 'QUEUE_ERROR',
                    message: (error as Error).message
                },
                meta: {
                    requestId: uuidv4(),
                    timestamp: Date.now(),
                    version: '1.0.0'
                }
            });
        }
    }

    private async retryQueueTask(req: Request, res: Response): Promise<void> {
        try {
            const { taskId } = req.params;
            const success = await this.queue.retryTask(taskId);

            res.json({
                success,
                data: { retried: success },
                meta: {
                    requestId: uuidv4(),
                    timestamp: Date.now(),
                    version: '1.0.0'
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: {
                    code: 'QUEUE_ERROR',
                    message: (error as Error).message
                },
                meta: {
                    requestId: uuidv4(),
                    timestamp: Date.now(),
                    version: '1.0.0'
                }
            });
        }
    }

    private async clearFailedTasks(_req: Request, res: Response): Promise<void> {
        try {
            const cleared = await this.queue.clearFailed();

            res.json({
                success: true,
                data: { cleared },
                meta: {
                    requestId: uuidv4(),
                    timestamp: Date.now(),
                    version: '1.0.0'
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: {
                    code: 'QUEUE_ERROR',
                    message: (error as Error).message
                },
                meta: {
                    requestId: uuidv4(),
                    timestamp: Date.now(),
                    version: '1.0.0'
                }
            });
        }
    }

    // ============================================================================
    // Scheduler Endpoints
    // ============================================================================

    private async scheduleTask(req: Request, res: Response): Promise<void> {
        try {
            const { type, payload, delay, jobId, priority, metadata } = req.body;

            if (!type || !payload || !delay) {
                res.status(400).json({
                    success: false,
                    error: {
                        code: 'INVALID_REQUEST',
                        message: 'Missing required fields: type, payload, delay'
                    },
                    meta: {
                        requestId: uuidv4(),
                        timestamp: Date.now(),
                        version: '1.0.0'
                    }
                });
                return;
            }

            const jobIdResult = await this.scheduler.schedule(type, payload, delay, {
                jobId,
                priority,
                metadata
            });

            res.json({
                success: true,
                data: { jobId: jobIdResult },
                meta: {
                    requestId: uuidv4(),
                    timestamp: Date.now(),
                    version: '1.0.0'
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: {
                    code: 'SCHEDULER_ERROR',
                    message: (error as Error).message
                },
                meta: {
                    requestId: uuidv4(),
                    timestamp: Date.now(),
                    version: '1.0.0'
                }
            });
        }
    }

    private async cancelScheduledJob(req: Request, res: Response): Promise<void> {
        try {
            const { jobId } = req.params;
            const success = this.scheduler.cancel(jobId);

            res.json({
                success,
                data: { cancelled: success },
                meta: {
                    requestId: uuidv4(),
                    timestamp: Date.now(),
                    version: '1.0.0'
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: {
                    code: 'SCHEDULER_ERROR',
                    message: (error as Error).message
                },
                meta: {
                    requestId: uuidv4(),
                    timestamp: Date.now(),
                    version: '1.0.0'
                }
            });
        }
    }

    // ============================================================================
    // Service Info Endpoint
    // ============================================================================

    private async getServiceInfo(_req: Request, res: Response): Promise<void> {
        const services = this.gateway.getServiceInfo();
        const health = await this.monitor.getHealth();
        const queueStats = await this.queue.getStats();

        res.json({
            success: true,
            data: {
                name: 'OmniRoute - 奧秘圓通統一 API',
                version: '1.0.0',
                description: '奧秘圓通全功能規劃 - 統一服務入口',
                services: services.length,
                status: health.overall,
                uptime: process.uptime(),
                timestamp: Date.now()
            },
            meta: {
                requestId: uuidv4(),
                timestamp: Date.now(),
                version: '1.0.0'
            }
        });
    }

    // ============================================================================
    // Public Methods
    // ============================================================================

    getRouter(): Router {
        if (!this.isInitialized) {
            throw new Error('OmniRoute not initialized. Call initialize() first.');
        }
        return this.router;
    }

    /**
     * Handle errors consistently across all route handlers
     */
    private handleError(res: Response, error: any, context: string): void {
        console.error(`[OmniRoute] Error in ${context}:`, error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : String(error),
            meta: {
                timestamp: Date.now(),
                requestId: uuidv4()
            }
        });
    }

    getPrefix(): string {
        return this.config.prefix;
    }

    // ============================================================================
    // MVP Service Handlers
    // ============================================================================

    /**
     * 同步 Avatar Persona 到 Supabase
     */
    private async syncAvatar(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.body;
            if (!userId) {
                res.status(400).json({ success: false, error: 'Missing userId' });
                return;
            }
            const result = await this.avatarService.syncPersonaWithSupabase(userId);
            res.json({ success: true, data: result });
        } catch (error) {
            this.handleError(res, error, 'Sync Avatar');
        }
    }

    /**
     * 觸發知識結晶化
     */
    private async crystallizeKnowledge(req: Request, res: Response): Promise<void> {
        try {
            const { userId, data } = req.body;
            if (!userId) {
                res.status(400).json({ success: false, error: 'Missing userId' });
                return;
            }
            const result = await this.avatarService.triggerKnowledgeCrystallization(userId, data);
            res.json({ success: true, data: result });
        } catch (error) {
            this.handleError(res, error, 'Crystallize Knowledge');
        }
    }

    /**
     * 執行 L1 評估 (MECE)
     */
    private async performL1Assessment(req: Request, res: Response): Promise<void> {
        try {
            const { data } = req.body;
            if (!data) {
                res.status(400).json({ success: false, error: 'Missing assessment data' });
                return;
            }
            const result = await this.assessmentService.assess(data);
            res.json({ success: true, data: result });
        } catch (error) {
            this.handleError(res, error, 'L1 Assessment');
        }
    }
}

// ============================================================================
// Export Factory Function
// ============================================================================

export function createOmniRoute(config?: Partial<OmniRouteConfig>): OmniRoute {
    return OmniRoute.getInstance(config);
}

// ============================================================================
// Default Export
// ============================================================================

export default {
    OmniRoute,
    createOmniRoute,
    createOmniMiddleware
};
