import { describe, it, expect, beforeEach, vi } from 'vitest';
import { omniCore } from './omni-core';
import type { IEvidence } from '../types/omni-core';
import { verifyZKPProof } from './crypto-proof';

// Mock global fetch for consolidation calls
const mockFetch = vi.fn();
mockFetch.mockResolvedValue({
  json: () => Promise.resolve({ success: true, summary: 'Mock consolidated summary from API' }),
});
vi.stubGlobal('fetch', mockFetch);

// Mock Supabase to bypass RLS and network requirements during tests
const mockMemories: any[] = [];

// Mock Data Connect services to avoid Firebase initialization in tests
const dcMockStore = vi.hoisted(() => ({ ref: [] as any[] }));
vi.mock('./dataconnect-services', () => {
  const store: any[] = [];
  dcMockStore.ref = store;
  return {
    dcUpsertEternalMemory: vi.fn().mockImplementation(async (input: any) => {
      const entry = {
        id: input.id,
        type: input.type,
        content: input.content,
        tags: input.tags,
        hashLock: input.hashLock,
        consolidated: input.consolidated ?? false,
        createdAt: new Date().toISOString()
      };
      const existing = store.findIndex(m => m.id === input.id);
      if (existing >= 0) store[existing] = entry;
      else store.push(entry);
      return entry;
    }),
    dcListEternalMemories: vi.fn().mockImplementation(async () => {
      return [...store];
    }),
  };
});
vi.mock('./supabase', () => ({
  supabase: {
    from: vi.fn().mockReturnValue({
      insert: vi.fn().mockImplementation(({ id, memory_value, hash_lock, context }) => {
        mockMemories.push({
          id,
          memory_value,
          hash_lock,
          context,
          created_at: new Date().toISOString()
        });
        return { error: null };
      }),
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockImplementation(() => ({
        data: [...mockMemories].reverse(),
        error: null
      })),
      limit: vi.fn().mockReturnThis(),
      single: vi.fn().mockImplementation(() => ({
        data: mockMemories.find(m => m.id === 'mock-consolidated-id'),
        error: null
      })),
    }),
    rpc: vi.fn().mockImplementation((fn, params) => {
      if (fn === 'consolidate_eternal_memories') {
        mockMemories.forEach(m => {
          m.context.consolidated = true;
        });
        const newId = 'mock-consolidated-id';
        mockMemories.push({
          id: newId,
          memory_value: { content: 'Consolidated Summary of 2 records' },
          hash_lock: 'mock-seal',
          context: { consolidated: true, tags: ['consolidated'] },
          created_at: new Date().toISOString()
        });
        return { data: newId, error: null };
      }
      return { data: null, error: null };
    }),
  },
}));

describe('OmniCore Integrity Engine', () => {
  beforeEach(() => {
    mockMemories.length = 0;
    dcMockStore.ref.length = 0;
    vi.clearAllMocks();
  });

  describe('5T Gate Validation', () => {
    it('should fail validation for empty metrics', () => {
      const evidence: IEvidence = {
        tangible_metric: '',
        source_origin: '/manual/entry',
        lifecycle_hooks: ['init'],
        formula_ref: 'GRI[302-1]'
      };
      const result = omniCore.validateT5Gate(evidence);
      expect(result.tangible).toBe(false);
    });

    it('should fail traceable check for invalid source paths', () => {
      const evidence: IEvidence = {
        tangible_metric: '12450 kWh',
        source_origin: 'manual/entry', // Missing leading slash
        lifecycle_hooks: ['init'],
        formula_ref: 'GRI[302-1]'
      };
      const result = omniCore.validateT5Gate(evidence);
      expect(result.traceable).toBe(false);
    });

    it('should fail transparent check for missing brackets in formula', () => {
      const evidence: IEvidence = {
        tangible_metric: '12450 kWh',
        source_origin: '/manual/entry',
        lifecycle_hooks: ['init'],
        formula_ref: 'GRI_302_1' // Missing []
      };
      const result = omniCore.validateT5Gate(evidence);
      expect(result.transparent).toBe(false);
    });

    it('should pass all checks for valid evidence', () => {
      const evidence: IEvidence = {
        tangible_metric: '12450 kWh',
        source_origin: '/vault/evidence-123',
        lifecycle_hooks: ['ingest', 'verify'],
        formula_ref: 'GRI[302-1]'
      };
      const result = omniCore.validateT5Gate(evidence);
      expect(result.tangible).toBe(true);
      expect(result.traceable).toBe(true);
      expect(result.trackable).toBe(true);
      expect(result.transparent).toBe(true);
    });
  });

  describe('Cryptographic Sealing & Verification', () => {
    it('should seal a component and verify its integrity', async () => {
      const component = await omniCore.sealComponent(
        '5000 kWh',
        '/api/meter/reading',
        'GRI[302-1]'
      );

      expect(component.status).toBe('Trustworthy');
      expect(component.hash_lock).toBeDefined();

      const isValid = await omniCore.verifyComponent(component);
      expect(isValid).toBe(true);
    });

    it('should detect tampering in evidence data', async () => {
      const component = await omniCore.sealComponent(
        '5000 kWh',
        '/api/meter/reading',
        'GRI[302-1]'
      );

      // Tamper with the metric
      const tamperedComponent = {
        ...component,
        evidence: {
          ...component.evidence,
          tangible_metric: '5001 kWh' // Changed value
        }
      };

      const isValid = await omniCore.verifyComponent(tamperedComponent);
      expect(isValid).toBe(false);
    });

    it('should detect tampering in metadata (timestamp)', async () => {
      const component = await omniCore.sealComponent(
        '5000 kWh',
        '/api/meter/reading',
        'GRI[302-1]'
      );

      // Tamper with the timestamp
      const tamperedComponent = {
        ...component,
        timestamp: component.timestamp + 1000
      };

      const isValid = await omniCore.verifyComponent(tamperedComponent);
      expect(isValid).toBe(false);
    });
  });

  describe('Eternal Memory Integrity', () => {
    it('should store memory with a valid hash lock', async () => {
      const memory = await omniCore.storeMemory('Project Alpha initialized', 'SEMANTIC', ['init']);

      expect(memory.hash_lock).toBeDefined();
      expect(memory.consolidated).toBe(false);

      const memories = await omniCore.getMemories();
      expect(memories.length).toBe(1);
      expect(memories[0].content).toBe('Project Alpha initialized');
    });

    it('should consolidate multiple memories into one summary', async () => {
      await omniCore.storeMemory('Event 1', 'EPISODIC', ['tag1']);
      await omniCore.storeMemory('Event 2', 'EPISODIC', ['tag2']);

      const consolidated = await omniCore.consolidateMemories('EPISODIC');

      expect(consolidated).not.toBeNull();
      expect(consolidated?.consolidated).toBe(true);

      const allMemories = await omniCore.getMemories();
      // 2 original + 1 consolidated
      expect(allMemories.length).toBe(3);
      
      const originals = allMemories.filter(m => m.content.includes('Event'));
      originals.forEach(m => {
        expect(m.consolidated).toBe(true);
      });
    });
  });

  describe('ZKP Privacy Proofs', () => {
    it('should generate a valid range proof for a secret value', async () => {
      const secretValue = 150;
      const min = 100;
      const max = 200;
      const blindingFactor = 'test-blinding-factor-123456789012';

      const proof = await omniCore.generatePrivacyProof('Electricity', secretValue, min, max, blindingFactor);

      expect(proof.inRange).toBe(true);
      expect(proof.min).toBe(min);
      expect(proof.max).toBe(max);
      expect(proof.commitment).toBeDefined();

      // Verify with the correct blinding factor
      const result = await verifyZKPProof(proof.commitment, blindingFactor);
      if (!result.valid) {
        console.log('ZKP Proof Steps:', JSON.stringify(result.steps, null, 2));
      }
      
      const isValid = await omniCore.verifyPrivacyProof(proof, blindingFactor);
      expect(isValid).toBe(true);
    });

    it('should fail verification with an incorrect blinding factor', async () => {
      const blindingFactor = 'test-blinding-factor-123456789012';
      const proof = await omniCore.generatePrivacyProof('Electricity', 150, 100, 200, blindingFactor);
      const isValid = await omniCore.verifyPrivacyProof(proof, 'wrong-factor');
      expect(isValid).toBe(false);
    });
  });
});
