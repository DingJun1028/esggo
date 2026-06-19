/**
 * 🏛️ OmniGateway - 奧秘圓通統一閘道服務
 * 
 * 作為所有 Omni 服務的統一入口，提供智能路由、負載均衡、
 * 請求分發、監控和日誌記錄的整合層。
 * 
 * 核心準則：英碼繁博 (English Logic / Traditional Chinese JSDoc)
 * 5T 協議實作：Traceable (可溯源), Trackable (可追蹤), Transparent (透明), Trustworthy (不可篡改)
 * 
 * @version 1.0.0
 * @date 2026-02-09
 */

import { omniLogger, LogCategory, LogLevel } from '../../src/omni/infrastructure/logging/OmniLogger.js';
/**
 * 🏛️ OmniGateway: 奧秘服務總網關
 * 
 * 核心功能：
 * 1. 請求路由 (Request Routing)：將請求分發至正確的奧秘服務。
 * 2. 服務註冊 (Service Registry)：管理所有已註冊服務的元數據與健康狀態。
 * 3. 中間件機制 (Middleware System)：處理校驗、認證與速率限制。
 * 4. 健康檢查 (Health Monitoring)：監控全域系統可用性。
 * 
 * 遵循 5T 協議：Traceable (可溯源), Trackable (可追蹤), Transparent (透明), Trustworthy (不可篡改)。
 */

import { v4 as uuidv4 } from 'uuid';

// ============================================================================
// 奧秘類型與介面定義 (Types & Interfaces)
// ============================================================================

/**
 * 奧秘服務類型列舉 (Omni Service Types)
 */
export type OmniServiceType =
    | 'CRM'
    | 'TABLE'
    | 'NOTE'
    | 'ACCEPTANCE'
    | 'SYNC'
    | 'ANALYTICS'
    | 'REPORT'
    | 'AGENT'
    | 'GATEWAY'
    | 'AI'
    | 'UNKNOWN';

/**
 * 奧秘標準請求介面 (Omni Request Interface)
 */
export interface OmniRequest {
    id: string;               // 隨機 UUID [Traceable]
    type: OmniServiceType;    // 服務類型
    action: string;           // 具體動作
    payload: Record<string, unknown>; // 載荷數據
    context?: OmniContext;    // 請求上下文
    traceId: string;         // 追蹤 ID [Trackable]
    timestamp: number;        // 時間戳
    priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
    metadata?: Record<string, unknown>;
}

export interface OmniContext {
    userId?: string;
    sessionId?: string;
    source?: string;
    correlationId?: string;
    environment?: string;
}

export interface OmniResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: OmniError;
    stream?: AsyncGenerator<string, void, unknown>;
    meta: {
        requestId: string;
        traceId: string;
        serviceType: OmniServiceType;
        duration: number;
        timestamp: number;
    };
}

export interface OmniError {
    code: string;
    message: string;
    details?: Record<string, unknown>;
    retryable: boolean;
}

export interface OmniRoute {
    pattern: RegExp;
    service: OmniServiceType;
    handler: string;
    methods: string[];
    middleware: OmniMiddleware[];
}

export interface OmniMiddleware {
    name: string;
    priority: number;
    execute: (req: OmniRequest, context: OmniContext) => Promise<boolean> | boolean;
}

// ============================================================================
// 奧秘服務註冊表 (Service Registry)
// ============================================================================

export class OmniServiceRegistry {
    private static instance: OmniServiceRegistry;
    private services: Map<string, OmniServiceInfo> = new Map();
    private healthStatus: Map<string, 'HEALTHY' | 'DEGRADED' | 'DOWN' | 'UNKNOWN'> = new Map();

    private constructor() {
        this.registerBuiltInServices();
    }

    /**
     * 獲取單例實例 (Get Singleton Instance)
     */
    static getInstance(): OmniServiceRegistry {
        if (!OmniServiceRegistry.instance) {
            OmniServiceRegistry.instance = new OmniServiceRegistry();
        }
        return OmniServiceRegistry.instance;
    }

    private registerBuiltInServices(): void {
        // Register built-in core services
        this.registerService({
            name: 'Gateway',
            type: 'GATEWAY',
            version: '1.0.0',
            endpoints: ['/api/gateway'],
            healthEndpoint: '/api/gateway/health',
            capabilities: ['routing', 'balancing']
        });

        this.registerService({
            name: 'JunAiKey',
            type: 'AI',
            version: '1.0.0',
            endpoints: ['/api/ai'],
            healthEndpoint: '/api/ai/health',
            capabilities: ['chat', 'vision', 'knowledge']
        });

        // Register all built-in Omni services
        this.registerService({
            name: 'OmniCRMService',
            type: 'CRM',
            version: '1.0.0',
            endpoints: ['contacts', 'deals', 'business-development'],
            healthEndpoint: '/health/crm',
            capabilities: ['AI_NLP', 'CONTACT_MANAGEMENT', 'DEAL_TRACKING']
        });

        this.registerService({
            name: 'OmniTableService',
            type: 'TABLE',
            version: '1.0.0',
            endpoints: ['generate', 'sync', 'records'],
            healthEndpoint: '/health/table',
            capabilities: ['AI_GENERATION', 'DATA_SYNC', 'BULK_OPERATIONS']
        });

        this.registerService({
            name: 'OmniNoteService',
            type: 'NOTE',
            version: '1.0.0',
            endpoints: ['notes', 'annotations', 'comments'],
            healthEndpoint: '/health/note',
            capabilities: ['CRUD', 'SHARING', 'VERSIONING']
        });

        this.registerService({
            name: 'OmniAcceptanceService',
            type: 'ACCEPTANCE',
            version: '1.0.0',
            endpoints: ['criteria', 'validation', 'artifacts'],
            healthEndpoint: '/health/acceptance',
            capabilities: ['VALIDATION', 'ARTIFACT_MANAGEMENT', 'WORKFLOW']
        });

        omniLogger.info(LogCategory.SYSTEM, '[OmniGateway] Built-in services registered');
    }

    registerService(info: OmniServiceInfo): void {
        this.services.set(info.name, { ...info, registeredAt: Date.now() });
        this.healthStatus.set(info.name, 'HEALTHY');
        omniLogger.info(LogCategory.SYSTEM, `[OmniGateway] Service registered: ${info.name} (${info.type})`);
    }

    getService(type: OmniServiceType): OmniServiceInfo | undefined {
        for (const service of this.services.values()) {
            if (service.type === type) {
                return service;
            }
        }
        return undefined;
    }

    getAllServices(): OmniServiceInfo[] {
        return Array.from(this.services.values());
    }

    /**
     * 更新服務健康狀態 (Update Health Status)
     */
    updateHealthStatus(serviceName: string, status: 'HEALTHY' | 'DEGRADED' | 'DOWN' | 'UNKNOWN', details?: Record<string, unknown>): void {
        this.healthStatus.set(serviceName, status);
        omniLogger.info(LogCategory.SYSTEM, `[OmniGateway] Service health updated: ${serviceName} -> ${status}`, details);
    }

    /**
     * 獲取全域健康報告 (Get Health Status Report)
     */
    getHealthStatus(): Record<string, 'HEALTHY' | 'DEGRADED' | 'DOWN' | 'UNKNOWN'> {
        return Object.fromEntries(this.healthStatus);
    }
}

export interface OmniServiceInfo {
    name: string;
    type: OmniServiceType;
    version: string;
    endpoints: string[];
    healthEndpoint: string;
    capabilities: string[];
    registeredAt?: number;
}

// ============================================================================
// 奧秘智能路由器 (Smart Router)
// ============================================================================

export class OmniSmartRouter {
    private static instance: OmniSmartRouter;
    private routes: OmniRoute[] = [];
    private fallbackHandler: (req: OmniRequest) => Promise<OmniResponse>;

    private constructor() {
        this.initializeDefaultRoutes();
        this.fallbackHandler = this.createFallbackHandler();
    }

    /**
     * 獲取單例實例 (Get Singleton Instance)
     */
    static getInstance(): OmniSmartRouter {
        if (!OmniSmartRouter.instance) {
            OmniSmartRouter.instance = new OmniSmartRouter();
        }
        return OmniSmartRouter.instance;
    }

    private initializeDefaultRoutes(): void {
        // CRM routes
        this.addRoute({
            pattern: /^\/omni\/crm\/(contacts|deals|bd)/i,
            service: 'CRM',
            handler: 'OmniCRMService',
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            middleware: []
        });

        // Table routes
        this.addRoute({
            pattern: /^\/omni\/table\/(generate|sync|records)/i,
            service: 'TABLE',
            handler: 'OmniTableService',
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            middleware: []
        });

        // Note routes
        this.addRoute({
            pattern: /^\/omni\/note\/(notes|annotations)/i,
            service: 'NOTE',
            handler: 'OmniNoteService',
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            middleware: []
        });

        // Acceptance routes
        this.addRoute({
            pattern: /^\/omni\/acceptance\/(criteria|validation)/i,
            service: 'ACCEPTANCE',
            handler: 'OmniAcceptanceService',
            methods: ['GET', 'POST', 'PUT'],
            middleware: []
        });

        // AI routes
        this.addRoute({
            pattern: /^\/omni\/ai\/(chat|embed|stream|awaken)/i,
            service: 'AI',
            handler: 'JunAiKey',
            methods: ['POST'],
            middleware: []
        });

        omniLogger.info(LogCategory.SYSTEM, '[OmniRouter] Default routes initialized');
    }

    /**
     * 添加自定義路由 (Add Custom Route)
     */
    addRoute(route: OmniRoute): void {
        this.routes.push(route);
        this.routes.sort((a, b) => a.middleware.length - b.middleware.length);
    }

    /**
     * 執行智能路由分發 (Execute Smart Routing)
     * 
     * @param request 原始奧秘請求
     * @returns 整合後的奧秘響應
     */
    async route(request: OmniRequest): Promise<OmniResponse> {
        const startTime = Date.now();
        omniLogger.info(LogCategory.SYSTEM, `[OmniRouter] Routing request: ${request.type}/${request.action}`);

        try {
            // Find matching route
            const route = this.findRoute(request);
            if (!route) {
                omniLogger.warn(LogCategory.SYSTEM, `[OmniRouter] No route found for: ${request.type}/${request.action}`);
                return this.fallbackHandler(request);
            }

            // Execute middleware chain
            for (const middleware of route.middleware) {
                const result = await middleware.execute(request, request.context || {});
                if (!result) {
                    return this.createErrorResponse(request.id, request.traceId, 'MIDDLEWARE_REJECTED', 'Request rejected by middleware');
                }
            }

            // Route to appropriate service
            const response = await this.dispatchToService(route, request);

            omniLogger.info(LogCategory.SYSTEM, `[OmniRouter] Request routed successfully in ${Date.now() - startTime}ms`);
            return response;

        } catch (error) {
            omniLogger.error(LogCategory.SYSTEM, '[OmniRouter] Routing failed', { error });
            return this.createErrorResponse(
                request.id,
                request.traceId,
                'ROUTING_ERROR',
                (error as Error).message,
                true
            );
        }
    }

    private findRoute(request: OmniRequest): OmniRoute | undefined {
        const path = `/omni/${request.type.toLowerCase()}/${request.action}`.toLowerCase();

        for (const route of this.routes) {
            if (route.pattern.test(path)) {
                return route;
            }
        }
        return undefined;
    }

    private async dispatchToService(route: OmniRoute, request: OmniRequest): Promise<OmniResponse> {
        const registry = OmniServiceRegistry.getInstance();
        const serviceInfo = registry.getService(route.service);

        if (!serviceInfo) {
            return this.createErrorResponse(request.id, request.traceId, 'SERVICE_NOT_FOUND', `Service not found: ${route.service}`);
        }

        const healthStatus = registry.getHealthStatus()[serviceInfo.name];
        if (healthStatus === 'DOWN') {
            return this.createErrorResponse(request.id, request.traceId, 'SERVICE_UNAVAILABLE', `Service unavailable: ${route.service}`);
        }

        // Dynamic service dispatch based on type
        switch (route.service) {
            case 'CRM':
                return this.dispatchCRM(request);
            case 'TABLE':
                return this.dispatchTable(request);
            case 'NOTE':
                return this.dispatchNote(request);
            case 'ACCEPTANCE':
                return this.dispatchAcceptance(request);
            case 'AI':
                return this.dispatchAI(request);
            default:
                return this.fallbackHandler(request);
        }
    }

    /**
     * 路由至 AI 祭司服務 (Router to AI Priest Service)
     */
    private async dispatchAI(request: OmniRequest): Promise<OmniResponse> {
        // Dynamic import to avoid circular dependencies if any, 
        // though OmniPriest is a singleton service.
        const { default: omniPriest } = await import('./OmniPriest.js');

        switch (request.action.toLowerCase()) {
            case 'chat':
                const prompt = request.payload.prompt as string;
                const model = (request.payload.model as string) || 'gemini-2.0-flash';
                const chatSessionId = request.context?.sessionId;
                const result = await omniPriest.execute(prompt, model, chatSessionId);
                return { success: true, data: { response: result }, meta: this.createMeta(request) };

            case 'embed':
                const text = request.payload.text as string;
                const embedding = await omniPriest.embed(text);
                return { success: true, data: { embedding }, meta: this.createMeta(request) };

            case 'stream':
                const streamPrompt = request.payload.prompt as string;
                const modelStream = (request.payload.model as string) || 'gemini-2.0-flash';
                const sessionId = request.context?.sessionId;
                const streamGenerator = omniPriest.stream(streamPrompt, modelStream, sessionId);
                // Return the generator in the response object
                return {
                    success: true,
                    stream: streamGenerator,
                    meta: this.createMeta(request)
                };

            case 'awaken':
                omniPriest.awakenEternal();
                return { success: true, data: { message: 'Eternal Awakening Activated' }, meta: this.createMeta(request) };
        }

        return { success: false, error: { code: 'INVALID_ACTION', message: `Invalid AI action: ${request.action}`, retryable: false }, meta: this.createMeta(request) };
    }

    private async dispatchCRM(request: OmniRequest): Promise<OmniResponse> {
        const { OmniCRMService } = await import('./OmniCRMService.js');

        switch (request.action.toLowerCase()) {
            case 'contacts':
                if (request.metadata?.operation === 'create') {
                    const result = await OmniCRMService.createContactFromNL(request.payload.prompt as string);
                    return { success: result.success, data: result, meta: this.createMeta(request) };
                }
                break;
            case 'deals':
                if (request.metadata?.operation === 'create') {
                    const result = await OmniCRMService.createDealFromNL(request.payload.prompt as string);
                    return { success: result.success, data: result, meta: this.createMeta(request) };
                }
                break;
            case 'bd':
                const bdResult = await OmniCRMService.startBDDevelopment({
                    company: request.payload.company as string,
                    industry: request.payload.industry as string
                });
                return { success: bdResult.success, data: bdResult, meta: this.createMeta(request) };
        }

        return { success: true, data: { message: 'CRM request processed' }, meta: this.createMeta(request) };
    }

    private async dispatchTable(request: OmniRequest): Promise<OmniResponse> {
        const { OmniTableService } = await import('./OmniTableService.js');

        if (request.action.toLowerCase() === 'generate') {
            const result = await OmniTableService.generate({
                type: request.payload.type as 'chart' | 'table' | 'dashboard' | 'database',
                prompt: request.payload.prompt as string,
                context: request.payload.context
            });
            return { success: result.success, data: result, meta: this.createMeta(request) };
        }

        return { success: true, data: { message: 'Table request processed' }, meta: this.createMeta(request) };
    }

    private async dispatchNote(request: OmniRequest): Promise<OmniResponse> {
        // Placeholder for note dispatch
        return { success: true, data: { message: 'Note request processed' }, meta: this.createMeta(request) };
    }

    private async dispatchAcceptance(request: OmniRequest): Promise<OmniResponse> {
        // Placeholder for acceptance dispatch
        return { success: true, data: { message: 'Acceptance request processed' }, meta: this.createMeta(request) };
    }

    private createFallbackHandler(): (req: OmniRequest) => Promise<OmniResponse> {
        return async (request: OmniRequest) => {
            omniLogger.warn(LogCategory.SYSTEM, `[OmniRouter] Fallback handler triggered for: ${request.type}`);
            return {
                success: false,
                error: {
                    code: 'FALLBACK Triggered',
                    message: `Request type ${request.type} with action ${request.action} not explicitly handled`,
                    retryable: true
                },
                meta: this.createMeta(request)
            };
        };
    }

    private createMeta(request: OmniRequest): OmniResponse['meta'] {
        return {
            requestId: request.id,
            traceId: request.traceId,
            serviceType: request.type,
            duration: 0,
            timestamp: Date.now()
        };
    }

    private createErrorResponse(
        requestId: string,
        traceId: string,
        code: string,
        message: string,
        retryable = false
    ): OmniResponse {
        return {
            success: false,
            error: { code, message, retryable },
            meta: {
                requestId,
                traceId,
                serviceType: 'UNKNOWN',
                duration: 0,
                timestamp: Date.now()
            }
        };
    }
}

// ============================================================================
// 奧秘閘道主類別 (Main Gateway Class)
// ============================================================================

export class OmniGateway {
    private static instance: OmniGateway;
    private registry: OmniServiceRegistry;
    private router: OmniSmartRouter;
    private middleware: OmniMiddleware[] = [];
    private isInitialized = false;

    private constructor() {
        this.registry = OmniServiceRegistry.getInstance();
        this.router = OmniSmartRouter.getInstance();
        this.initializeMiddleware();
    }

    /**
     * 獲取單例實例 (Get Singleton Instance)
     */
    static getInstance(): OmniGateway {
        if (!OmniGateway.instance) {
            OmniGateway.instance = new OmniGateway();
        }
        return OmniGateway.instance;
    }

    /**
     * 初始化網關 (Initialize Gateway)
     */
    async initialize(): Promise<void> {
        if (this.isInitialized) {
            omniLogger.warn(LogCategory.SYSTEM, '[OmniGateway] Already initialized');
            return;
        }

        omniLogger.info(LogCategory.SYSTEM, '[OmniGateway] Initializing Omni Gateway...');

        this.isInitialized = true;
        omniLogger.info(LogCategory.SYSTEM, '[OmniGateway] Omni Gateway initialized successfully');
    }

    private initializeMiddleware(): void {
        // Request validation middleware
        this.use({
            name: 'requestValidator',
            priority: 1,
            execute: async (req: OmniRequest) => {
                if (!req.type || !req.action) {
                    return false;
                }
                return true;
            }
        });

        // Authentication middleware
        this.use({
            name: 'authValidator',
            priority: 2,
            execute: async (req: OmniRequest) => {
                // Skip auth for now - implement based on requirements
                return true;
            }
        });

        // Rate limiting middleware (placeholder)
        this.use({
            name: 'rateLimiter',
            priority: 3,
            execute: async (req: OmniRequest) => {
                // Implement rate limiting
                return true;
            }
        });

        omniLogger.info(LogCategory.SYSTEM, `[OmniGateway] ${this.middleware.length} middleware registered`);
    }

    use(middleware: OmniMiddleware): void {
        this.middleware.push(middleware);
        this.middleware.sort((a, b) => a.priority - b.priority);
    }

    /**
     * 處理奧秘請求 (Process Omni Request)
     * 
     * 全域入口點，負責：
     * 1. 確保系統已初始化。
     * 2. 生成/提取連鎖追蹤碼 (Trace ID)。
     * 3. 執行全域中間件 (Global Middleware)。
     * 4. 調用路由分發器進行各服務派遣。
     * 
     * @param request 原始請求
     */
    async processRequest(request: OmniRequest): Promise<OmniResponse> {
        const startTime = Date.now();

        // Ensure initialization
        if (!this.isInitialized) {
            await this.initialize();
        }

        // Generate trace ID if not provided
        const traceId = request.traceId || uuidv4();

        omniLogger.info(LogCategory.SYSTEM, `[OmniGateway] Processing request: ${request.id}`, {
            type: request.type,
            action: request.action,
            traceId,
            sourceOrigin: request.metadata?.source_origin || 'UNKNOWN' // [T2-Traceable]
        });

        try {
            // Execute global middleware chain
            for (const middleware of this.middleware) {
                const result = await middleware.execute(request, request.context || {});
                if (!result) {
                    omniLogger.warn(LogCategory.SYSTEM, `[OmniGateway] Middleware rejected: ${middleware.name}`);
                    return {
                        success: false,
                        error: {
                            code: 'MIDDLEWARE_REJECTED',
                            message: `Request rejected by middleware: ${middleware.name}`,
                            retryable: false
                        },
                        meta: {
                            requestId: request.id,
                            traceId,
                            serviceType: 'UNKNOWN',
                            duration: Date.now() - startTime,
                            timestamp: Date.now()
                        }
                    };
                }
            }

            // Route and process request
            const response = await this.router.route({ ...request, traceId });
            response.meta.duration = Date.now() - startTime;

            omniLogger.info(LogCategory.SYSTEM, `[OmniGateway] Request completed: ${request.id}`, {
                success: response.success,
                duration: response.meta.duration
            });

            return response;

        } catch (error) {
            omniLogger.error(LogCategory.SYSTEM, '[OmniGateway] Request processing failed', {
                requestId: request.id,
                error
            });

            return {
                success: false,
                error: {
                    code: 'GATEWAY_ERROR',
                    message: (error as Error).message,
                    retryable: true
                },
                meta: {
                    requestId: request.id,
                    traceId,
                    serviceType: 'UNKNOWN',
                    duration: Date.now() - startTime,
                    timestamp: Date.now()
                }
            };
        }
    }

    /**
     * 執行全域健康檢查 (Execute Global Health Check)
     */
    async healthCheck(): Promise<{
        status: 'HEALTHY' | 'DEGRADED' | 'DOWN';
        services: Record<string, 'HEALTHY' | 'DEGRADED' | 'DOWN' | 'UNKNOWN'>;
        uptime: number;
    }> {
        const services = this.registry.getHealthStatus();
        const allHealthy = Object.values(services).every(s => s === 'HEALTHY');

        return {
            status: allHealthy ? 'HEALTHY' : 'DEGRADED',
            services,
            uptime: process.uptime()
        };
    }

    getServiceInfo(): OmniServiceInfo[] {
        return this.registry.getAllServices();
    }
}

// ============================================================================
// Export Factory Function
// ============================================================================

export function createOmniGateway(): OmniGateway {
    return OmniGateway.getInstance();
}

export function createOmniResponse<T = unknown>(
    request: OmniRequest,
    success: boolean,
    data?: T,
    error?: OmniError
): OmniResponse<T> {
    return {
        success,
        data,
        error,
        meta: {
            requestId: request.id,
            traceId: request.traceId,
            serviceType: request.type,
            duration: Date.now() - request.timestamp,
            timestamp: Date.now()
        }
    };
}

export function createOmniRequest(
    type: OmniServiceType,
    action: string,
    payload: Record<string, unknown>,
    context?: OmniContext
): OmniRequest {
    return {
        id: uuidv4(),
        type,
        action,
        payload,
        context,
        traceId: uuidv4(),
        timestamp: Date.now(),
        priority: 'NORMAL'
    };
}

// ============================================================================
// Default Export
// ============================================================================

export default {
    Gateway: OmniGateway,
    Registry: OmniServiceRegistry,
    Router: OmniSmartRouter,
    createOmniGateway,
    createOmniRequest
};
