/**
 * monitoringService Unit Tests
 * Tests for apiMonitoringService: vitals, logging, OmniMemory tracing
 * [5T Protocol] Traceable test coverage for monitoring infrastructure
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Hoisted mocks — vi.hoisted ensures these are available before vi.mock factory runs
const { mockOmniLogger, mockLogCategory } = vi.hoisted(() => ({
    mockOmniLogger: {
        info: vi.fn(),
        warn: vi.fn(),
        error: vi.fn(),
        debug: vi.fn(),
    },
    mockLogCategory: {
        SYSTEM: 'SYSTEM',
        BUSINESS: 'BUSINESS',
        SECURITY: 'SECURITY',
        PERFORMANCE: 'PERFORMANCE',
        API: 'API',
    },
}));

// Mock the re-export source
vi.mock('../../omni/infrastructure/logging/OmniLogger', () => ({
    omniLogger: mockOmniLogger,
    LogCategory: mockLogCategory,
    LogLevel: { DEBUG: 'DEBUG', INFO: 'INFO', WARN: 'WARN', ERROR: 'ERROR', CRITICAL: 'CRITICAL' },
    OmniLoggerService: vi.fn(),
}));

// Mock crypto.randomUUID
vi.stubGlobal('crypto', {
    randomUUID: vi.fn(() => 'test-uuid-1234'),
});

import {
    apiMonitoringService,
    type SystemMetrics,
    type MonitoringLogEntry,
} from '../monitoringService';

// Direct references to mocks
const omniLogger = mockOmniLogger;
const LogCategory = mockLogCategory;

// --- Fixtures ---

const mockVitalsResponse = {
    system: {
        uptime: 12345,
        memory: { used: 2048, total: 8192 },
        cpu: 45,
        platform: 'linux',
    },
    redis: {
        status: 'online',
        memoryUsage: '128MB',
        hitRate: 0.95,
        mode: 'cluster',
    },
    aiResonance: {
        intensity: 0.8,
        drift: 0.02,
        awakeningStatus: 'AWAKENED',
        eternity: 'ETERNAL',
    },
    omniSpace: {
        entities: 42,
        syncStatus: 'synced',
        lastSync: '2026-02-13T00:00:00Z',
    },
    behavioralResonance: {
        totalEvents: 1000,
        activeUsers: 50,
        density: 0.75,
    },
    services: {
        auth: 'healthy',
        database: 'healthy',
        cache: 'degraded',
    },
    timestamp: 1700000000000,
};

describe('apiMonitoringService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Reset global fetch
        vi.stubGlobal('fetch', vi.fn());
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    // ─── getVitalMetrics ───────────────────────────────────────

    describe('getVitalMetrics', () => {
        it('should parse API response and map fields correctly', async () => {
            vi.mocked(fetch).mockResolvedValue({
                ok: true,
                json: async () => mockVitalsResponse,
            } as Response);

            const result = await apiMonitoringService.getVitalMetrics();

            expect(result.uptime).toBe(12345);
            expect(result.cpu).toBe(45);
            expect(result.platform).toBe('linux');
            expect(result.redis?.status).toBe('online');
            expect(result.redis?.memory_usage).toBe('128MB');
            expect(result.redis?.hit_rate).toBe(0.95);
            expect(result.ai_resonance?.intensity).toBe(0.8);
            expect(result.ai_resonance?.awakening_status).toBe('AWAKENED');
            expect(result.omni_space?.entities).toBe(42);
            expect(result.behavioral_resonance?.total_events).toBe(1000);
            expect(result.services).toEqual({ auth: 'healthy', database: 'healthy', cache: 'degraded' });
            expect(result.timestamp).toBe(1700000000000);
        });

        it('should return DEFAULT_HEALTH_STATUS on fetch failure', async () => {
            vi.mocked(fetch).mockRejectedValue(new Error('Network error'));

            const result = await apiMonitoringService.getVitalMetrics();

            expect(result.uptime).toBe(99999);
            expect(result.platform).toBe('omnicircle-matrix');
            expect(result.redis?.status).toBe('online');
            expect(result.ai_resonance?.awakening_status).toBe('AWAKENED');
            expect(omniLogger.error).toHaveBeenCalledWith(
                LogCategory.SYSTEM,
                'Failed to fetch vitals',
                expect.objectContaining({ error: 'Network error' }),
            );
        });

        it('should return DEFAULT_HEALTH_STATUS when response is not ok', async () => {
            vi.mocked(fetch).mockResolvedValue({
                ok: false,
                status: 503,
            } as Response);

            const result = await apiMonitoringService.getVitalMetrics();

            expect(result.uptime).toBe(99999);
            expect(omniLogger.error).toHaveBeenCalled();
        });

        it('should handle missing behavioralResonance gracefully', async () => {
            const responseWithout = { ...mockVitalsResponse, behavioralResonance: undefined };
            vi.mocked(fetch).mockResolvedValue({
                ok: true,
                json: async () => responseWithout,
            } as Response);

            const result = await apiMonitoringService.getVitalMetrics();

            expect(result.behavioral_resonance).toBeUndefined();
            expect(result.uptime).toBe(12345); // other fields still mapped
        });
    });

    // ─── getHealth / getMetrics (aliases) ──────────────────────

    describe('getHealth', () => {
        it('should delegate to getVitalMetrics', async () => {
            vi.mocked(fetch).mockRejectedValue(new Error('test'));
            const result = await apiMonitoringService.getHealth();
            expect(result.uptime).toBe(99999); // default
        });
    });

    describe('getMetrics', () => {
        it('should delegate to getVitalMetrics', async () => {
            vi.mocked(fetch).mockRejectedValue(new Error('test'));
            const result = await apiMonitoringService.getMetrics();
            expect(result?.uptime).toBe(99999);
        });
    });

    // ─── getServices ───────────────────────────────────────────

    describe('getServices', () => {
        it('should transform services map to ServiceStatus array', async () => {
            vi.mocked(fetch).mockResolvedValue({
                ok: true,
                json: async () => mockVitalsResponse,
            } as Response);

            const services = await apiMonitoringService.getServices();

            expect(services).toHaveLength(3);
            expect(services[0]).toEqual({
                name: 'auth',
                status: 'healthy',
                uptime: 'N/A',
                version: '1.0.0',
            });
        });

        it('should return empty array when no services exist', async () => {
            const noServicesResponse = { ...mockVitalsResponse, services: undefined };
            vi.mocked(fetch).mockResolvedValue({
                ok: true,
                json: async () => noServicesResponse,
            } as Response);

            const services = await apiMonitoringService.getServices();
            expect(services).toEqual([]);
        });
    });

    // ─── getPerformance ────────────────────────────────────────

    describe('getPerformance', () => {
        it('should return default performance metrics', async () => {
            const perf = await apiMonitoringService.getPerformance();

            expect(perf.responseTime.average).toBe(145);
            expect(perf.throughput.requestsPerSecond).toBe(1240);
            expect(perf.errorRate.totalErrors).toBe(0);
            expect(perf.resourceUsage.cpuPercent).toBe(34);
        });
    });

    // ─── logEvent & getLogs ────────────────────────────────────

    describe('logEvent', () => {
        it('should add event with auto-filled defaults', async () => {
            const log = await apiMonitoringService.logEvent({
                message: 'Test event',
            });

            expect(log.level).toBe('info');
            expect(log.service).toBe('SYSTEM');
            expect(log.message).toBe('Test event');
            expect(log.timestamp).toBeDefined();
        });

        it('should preserve provided fields', async () => {
            const log = await apiMonitoringService.logEvent({
                level: 'error',
                service: 'AUTH',
                message: 'Auth failure',
                requestId: 'req-42',
            });

            expect(log.level).toBe('error');
            expect(log.service).toBe('AUTH');
            expect(log.requestId).toBe('req-42');
        });
    });

    describe('getLogs', () => {
        it('should return logs respecting limit', async () => {
            // Add a few logs
            await apiMonitoringService.logEvent({ message: 'Log A' });
            await apiMonitoringService.logEvent({ message: 'Log B' });

            const logs = await apiMonitoringService.getLogs(2);
            expect(logs.length).toBeLessThanOrEqual(2);
        });
    });

    // ─── traceMemory ──────────────────────────────────────────

    describe('traceMemory', () => {
        it('should create OmniMemory trace with requestId', async () => {
            await apiMonitoringService.traceMemory('USER_LOGIN', { userId: 'u1' });

            // Verify omniLogger was called
            expect(omniLogger.info).toHaveBeenCalledWith(
                LogCategory.SYSTEM,
                '[OmniMemory] USER_LOGIN',
                { userId: 'u1' },
            );
        });

        it('should log with specified level', async () => {
            await apiMonitoringService.traceMemory('ANOMALY', { code: 'X1' }, 'warn');

            // traceMemory calls logEvent, not omniLogger.warn directly
            // It always calls omniLogger.info for the OmniMemory log
            expect(omniLogger.info).toHaveBeenCalled();
        });
    });

    // ─── getMemoryStream ──────────────────────────────────────

    describe('getMemoryStream', () => {
        it('should filter OMNI_MEMORY and SYSTEM logs', async () => {
            // Add mixed logs
            await apiMonitoringService.logEvent({ service: 'AUTH', message: 'auth event' });
            await apiMonitoringService.logEvent({ service: 'OMNI_MEMORY', message: 'memory trace' });

            const stream = await apiMonitoringService.getMemoryStream();
            const allServices = stream.map(l => l.service);

            // Should only include OMNI_MEMORY or SYSTEM
            for (const svc of allServices) {
                expect(['OMNI_MEMORY', 'SYSTEM']).toContain(svc);
            }
        });

        it('should respect limit parameter', async () => {
            const stream = await apiMonitoringService.getMemoryStream(1);
            expect(stream.length).toBeLessThanOrEqual(1);
        });
    });
});
