/**
 * SystemHealthService.test.ts
 * 系統健康服務單元測試
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SystemHealthService } from '../SystemHealthService';

// Mock dependencies
vi.mock('../RedisService', () => ({
    redisService: {
        status: vi.fn(() => true),
    },
}));

vi.mock('../../config/supabase', () => ({
    supabase: {
        from: vi.fn(() => ({
            select: vi.fn(() => ({
                limit: vi.fn(() => Promise.resolve({ data: [], error: null })),
            })),
            insert: vi.fn(() => Promise.resolve({ error: null })),
        })),
    },
}));

vi.mock('../../../utils/omniLogger', () => ({
    default: {
        info: vi.fn(),
        error: vi.fn(),
    },
    LogCategory: {
        SYSTEM: 'SYSTEM',
    },
}));

describe('SystemHealthService', () => {
    let service: SystemHealthService;

    beforeEach(() => {
        service = new SystemHealthService();
    });

    describe('recordRequest', () => {
        it('should increment API hits counter', async () => {
            service.recordRequest();
            service.recordRequest();
            service.recordRequest();

            const snapshot = await service.getSnapshot();
            expect(snapshot.api_hits).toBe(3);
        });
    });

    describe('recordError', () => {
        it('should increment error counter', async () => {
            service.recordError();
            service.recordError();

            const snapshot = await service.getSnapshot();
            expect(snapshot.error_count).toBe(2);
        });
    });

    describe('getLivenessStatus', () => {
        it('should return ok status with uptime', () => {
            const status = service.getLivenessStatus();

            expect(status.status).toBe('ok');
            expect(status.uptime).toBeGreaterThanOrEqual(0);
        });
    });

    describe('getReadinessStatus', () => {
        it('should check database and redis connections', async () => {
            const status = await service.getReadinessStatus();

            expect(status.timestamp).toBeDefined();
            expect(status.checks).toBeDefined();
            expect(status.checks.database).toBeDefined();
            expect(status.checks.redis).toBeDefined();
        });
    });

    describe('getSnapshot', () => {
        it('should return OPTIMAL status when error rate is low', async () => {
            for (let i = 0; i < 100; i++) service.recordRequest();
            service.recordError();

            const snapshot = await service.getSnapshot();
            expect(snapshot.status).toBe('OPTIMAL');
        });

        it('should return DEGRADED status when error rate exceeds 5%', async () => {
            for (let i = 0; i < 100; i++) service.recordRequest();
            for (let i = 0; i < 6; i++) service.recordError();

            const snapshot = await service.getSnapshot();
            expect(snapshot.status).toBe('DEGRADED');
        });

        it('should return CRITICAL status when error rate exceeds 10%', async () => {
            for (let i = 0; i < 100; i++) service.recordRequest();
            for (let i = 0; i < 11; i++) service.recordError();

            const snapshot = await service.getSnapshot();
            expect(snapshot.status).toBe('CRITICAL');
        });

        it('should include uptime in seconds', async () => {
            const snapshot = await service.getSnapshot();
            expect(snapshot.uptime).toBeGreaterThanOrEqual(0);
        });
    });
});
