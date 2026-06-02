import { describe, it, expect, vi, beforeEach } from 'vitest';
import { healingGuardian } from './healer';
import { supabaseAdmin } from '../supabaseAdmin';

// Mock Supabase Admin
vi.mock('../supabaseAdmin', () => ({
  supabaseAdmin: {
    rpc: vi.fn(),
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    single: vi.fn(),
    insert: vi.fn().mockReturnThis(),
  },
}));

describe('HealingGuardian', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('triggerGlobalHealing', () => {
    it('should call the execute_autonomous_healing RPC and return results', async () => {
      const mockHealedCount = 3;
      const mockLogs = [
        { id: '1', target_gri: 'GRI 305-1', action_taken: 'AUTO_LINK', status: 'success' },
        { id: '2', target_gri: 'GRI 302-1', action_taken: 'AUTO_LINK', status: 'success' },
        { id: '3', target_gri: 'GRI 401-1', action_taken: 'AUTO_LINK', status: 'success' },
      ];

      (supabaseAdmin!.rpc as any).mockResolvedValue({ data: { healed_count: mockHealedCount }, error: null });
      (supabaseAdmin!.from as any)().select().order().limit.mockResolvedValue({ data: mockLogs, error: null });

      const result = await healingGuardian.triggerGlobalHealing('test-company');

      expect(supabaseAdmin!.rpc).toHaveBeenCalledWith('execute_autonomous_healing', { p_company_id: 'test-company' });
      expect(result.healedCount).toBe(mockHealedCount);
      expect(result.logs).toHaveLength(mockHealedCount);
      expect(result.logs[0].target_gri).toBe('GRI 305-1');
    });

    it('should throw an error if the RPC fails', async () => {
      (supabaseAdmin!.rpc as any).mockResolvedValue({ data: null, error: { message: 'Database error' } });

      await expect(healingGuardian.triggerGlobalHealing()).rejects.toThrow('Database error');
    });
  });

  describe('targetHealing', () => {
    it('should perform a targeted heal and return true', async () => {
      const mockEvidence = { id: 'ev_123', file_name: 'test.pdf' };
      
      (supabaseAdmin!.from as any)().select().eq().single.mockResolvedValue({ data: mockEvidence, error: null });
      (supabaseAdmin!.from as any)().insert.mockResolvedValue({ error: null });

      const result = await healingGuardian.targetHealing('GRI 305-1', 'ev_123', 'test-company');

      expect(result).toBe(true);
      expect(supabaseAdmin!.from).toHaveBeenCalledWith('environmental_data');
      expect(supabaseAdmin!.from).toHaveBeenCalledWith('healing_log');
    });

    it('should return false if the evidence is not found', async () => {
      (supabaseAdmin!.from as any)().select().eq().single.mockResolvedValue({ data: null, error: { message: 'Not found' } });

      const result = await healingGuardian.targetHealing('GRI 305-1', 'invalid_ev');

      expect(result).toBe(false);
    });
  });
});
