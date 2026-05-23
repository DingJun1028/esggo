import { describe, it, expect, beforeEach } from 'vitest';
import { omniCore } from './omni-core';
import type { IEvidence } from '../types/omni-core';

describe('OmniCore Integrity Engine', () => {
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
      
      const memories = omniCore.getMemories();
      expect(memories).toContainEqual(memory);
    });

    it('should consolidate multiple memories into one summary', async () => {
      await omniCore.storeMemory('Event 1', 'EPISODIC', ['tag1']);
      await omniCore.storeMemory('Event 2', 'EPISODIC', ['tag2']);

      const consolidated = await omniCore.consolidateMemories('EPISODIC');
      
      expect(consolidated).not.toBeNull();
      expect(consolidated?.tags).toContain('consolidated');
      expect(consolidated?.content).toContain('Consolidated Summary of 2 EPISODIC records');

      const allMemories = omniCore.getMemories();
      const originals = allMemories.filter(m => m.content === 'Event 1' || m.content === 'Event 2');
      originals.forEach(m => {
        expect(m.consolidated).toBe(true);
      });
    });
  });
});
