import client from 'prom-client';

/**
 * Prometheus Metrics Configuration
 * Collects system, business, and performance metrics for Grafana visualization
 * 
 * Observability Impact: Enhanced system monitoring to identify performance bottlenecks
 */

// Enable default metrics collection (CPU, memory, event loop lag, etc.)
const register = new client.Registry();
client.collectDefaultMetrics({ register, prefix: 'infoone_' });

// ============================================================================
// HTTP METRICS
// ============================================================================

export const httpRequestDuration = new client.Histogram({
    name: 'infoone_http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10], // Response time buckets in seconds
    registers: [register],
});

export const httpRequestTotal = new client.Counter({
    name: 'infoone_http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code'],
    registers: [register],
});

export const httpRequestErrors = new client.Counter({
    name: 'infoone_http_request_errors_total',
    help: 'Total number of HTTP request errors',
    labelNames: ['method', 'route', 'error_code'],
    registers: [register],
});

// ============================================================================
// DATABASE METRICS
// ============================================================================

export const dbQueryDuration = new client.Histogram({
    name: 'infoone_db_query_duration_seconds',
    help: 'Duration of database queries in seconds',
    labelNames: ['operation', 'table'],
    buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5],
    registers: [register],
});

export const dbConnectionPoolSize = new client.Gauge({
    name: 'infoone_db_connection_pool_total',
    help: 'Number of active database connections',
    registers: [register],
});

export const dbQueryErrors = new client.Counter({
    name: 'infoone_db_query_errors_total',
    help: 'Total number of database query errors',
    labelNames: ['operation', 'error_type'],
    registers: [register],
});

// ============================================================================
// REDIS CACHE METRICS
// ============================================================================

export const cacheHits = new client.Counter({
    name: 'infoone_cache_hits_total',
    help: 'Total number of cache hits',
    labelNames: ['cache_key'],
    registers: [register],
});

export const cacheMisses = new client.Counter({
    name: 'infoone_cache_misses_total',
    help: 'Total number of cache misses',
    labelNames: ['cache_key'],
    registers: [register],
});

export const cacheLatency = new client.Histogram({
    name: 'infoone_cache_operation_duration_seconds',
    help: 'Duration of cache operations in seconds',
    labelNames: ['operation'], // 'get', 'set', 'delete'
    buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5],
    registers: [register],
});

// ============================================================================
// BUSINESS METRICS (ESG-Specific)
// ============================================================================

export const esgAssessmentCompleted = new client.Counter({
    name: 'infoone_esg_assessments_completed_total',
    help: 'Total number of completed ESG assessments',
    labelNames: ['assessment_type'], // 'l1', 'l2', 'comprehensive'
    registers: [register],
});

export const marketIntelligenceQueries = new client.Counter({
    name: 'infoone_market_intelligence_queries_total',
    help: 'Total number of market intelligence queries',
    labelNames: ['query_type'], // 'news', 'briefing', 'incidents'
    registers: [register],
});

export const aiChatRequests = new client.Counter({
    name: 'infoone_ai_chat_requests_total',
    help: 'Total number of AI chat requests (Dr. Thoth / JunAiKey)',
    labelNames: ['agent'], // 'dr_thoth', 'junaikey', 'amice'
    registers: [register],
});

export const certificationsIssued = new client.Counter({
    name: 'infoone_certifications_issued_total',
    help: 'Total number of certifications issued',
    labelNames: ['certification_type'], // 'berkeley', 'custom'
    registers: [register],
});

// ============================================================================
// SYSTEM HEALTH METRICS
// ============================================================================

export const systemUptime = new client.Gauge({
    name: 'infoone_system_uptime_seconds',
    help: 'System uptime in seconds',
    registers: [register],
});

export const activeUsers = new client.Gauge({
    name: 'infoone_active_users_total',
    help: 'Number of currently active users',
    registers: [register],
});

export const activeSessions = new client.Gauge({
    name: 'infoone_active_sessions_total',
    help: 'Number of active sessions',
    registers: [register],
});

// ============================================================================
// SECURITY METRICS
// ============================================================================

export const authenticationAttempts = new client.Counter({
    name: 'infoone_authentication_attempts_total',
    help: 'Total number of authentication attempts',
    labelNames: ['result'], // 'success', 'failure'
    registers: [register],
});

export const csrfValidationFailures = new client.Counter({
    name: 'infoone_csrf_validation_failures_total',
    help: 'Total number of CSRF validation failures',
    registers: [register],
});

export const rateLimitExceeded = new client.Counter({
    name: 'infoone_rate_limit_exceeded_total',
    help: 'Total number of rate limit violations',
    labelNames: ['endpoint'],
    registers: [register],
});

// ============================================================================
// REGISTRY EXPORT
// ============================================================================

export default register;
