"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const healer_1 = require("./healer");
const supabaseAdmin_1 = require("../supabaseAdmin");
// Mock Supabase Admin
vitest_1.vi.mock('../supabaseAdmin', () => ({
    supabaseAdmin: {
        rpc: vitest_1.vi.fn(),
        from: vitest_1.vi.fn().mockReturnThis(),
        select: vitest_1.vi.fn().mockReturnThis(),
        eq: vitest_1.vi.fn().mockReturnThis(),
        order: vitest_1.vi.fn().mockReturnThis(),
        limit: vitest_1.vi.fn().mockReturnThis(),
        single: vitest_1.vi.fn(),
        insert: vitest_1.vi.fn().mockReturnThis(),
    },
}));
(0, vitest_1.describe)('HealingGuardian', () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.describe)('triggerGlobalHealing', () => {
        (0, vitest_1.it)('should call the execute_autonomous_healing RPC and return results', async () => {
            const mockHealedCount = 3;
            const mockLogs = [
                { id: '1', target_gri: 'GRI 305-1', action_taken: 'AUTO_LINK', status: 'success' },
                { id: '2', target_gri: 'GRI 302-1', action_taken: 'AUTO_LINK', status: 'success' },
                { id: '3', target_gri: 'GRI 401-1', action_taken: 'AUTO_LINK', status: 'success' },
            ];
            supabaseAdmin_1.supabaseAdmin.rpc.mockResolvedValue({ data: { healed_count: mockHealedCount }, error: null });
            supabaseAdmin_1.supabaseAdmin.from().select().order().limit.mockResolvedValue({ data: mockLogs, error: null });
            const result = await healer_1.healingGuardian.triggerGlobalHealing('test-company');
            (0, vitest_1.expect)(supabaseAdmin_1.supabaseAdmin.rpc).toHaveBeenCalledWith('execute_autonomous_healing', { p_company_id: 'test-company' });
            (0, vitest_1.expect)(result.healedCount).toBe(mockHealedCount);
            (0, vitest_1.expect)(result.logs).toHaveLength(mockHealedCount);
            (0, vitest_1.expect)(result.logs[0].target_gri).toBe('GRI 305-1');
        });
        (0, vitest_1.it)('should throw an error if the RPC fails', async () => {
            supabaseAdmin_1.supabaseAdmin.rpc.mockResolvedValue({ data: null, error: { message: 'Database error' } });
            await (0, vitest_1.expect)(healer_1.healingGuardian.triggerGlobalHealing()).rejects.toThrow('Database error');
        });
    });
    (0, vitest_1.describe)('targetHealing', () => {
        (0, vitest_1.it)('should perform a targeted heal and return true', async () => {
            const mockEvidence = { id: 'ev_123', file_name: 'test.pdf' };
            supabaseAdmin_1.supabaseAdmin.from().select().eq().single.mockResolvedValue({ data: mockEvidence, error: null });
            supabaseAdmin_1.supabaseAdmin.from().insert.mockResolvedValue({ error: null });
            const result = await healer_1.healingGuardian.targetHealing('GRI 305-1', 'ev_123', 'test-company');
            (0, vitest_1.expect)(result).toBe(true);
            (0, vitest_1.expect)(supabaseAdmin_1.supabaseAdmin.from).toHaveBeenCalledWith('environmental_data');
            (0, vitest_1.expect)(supabaseAdmin_1.supabaseAdmin.from).toHaveBeenCalledWith('healing_log');
        });
        (0, vitest_1.it)('should return false if the evidence is not found', async () => {
            supabaseAdmin_1.supabaseAdmin.from().select().eq().single.mockResolvedValue({ data: null, error: { message: 'Not found' } });
            const result = await healer_1.healingGuardian.targetHealing('GRI 305-1', 'invalid_ev');
            (0, vitest_1.expect)(result).toBe(false);
        });
    });
});
//# sourceMappingURL=healer.test.js.map