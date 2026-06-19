import { describe, it, expect } from 'vitest';
import { OmniAtomSchema } from '../omni-schemas';

describe('OmniAtom Schema Validation (5T Protocol)', () => {
    const validAtomBase = {
        uuid: '550e8400-e29b-41d4-a716-446655440000',
        version: '1.0.0',
        timestamp: Date.now(),
        evidence: {},
        lifecycle_events: [
            { event: 'CREATED', actor: 'SYSTEM', time: Date.now() }
        ],
        isFrozen: false,
        originHash: 'abc123hash',
        genealogy: ['GENESIS'],
        sourceOrigin: 'TEST_NODE',
        algorithmId: 'V1',
        verificationProof: 'PROOF_123',
        formula: 'E=mc2',
        renderType: 'LiquidGlass',
        interaction: 'Fluid',
        auraColor: '#63a6b0',
        signerKey: 'KEY_001',
        consensusTimestamp: Date.now(),
        contentHash: 'hash',
        circleId: 'ALPHA',
        interoperability: true,
        quality: 8,
        domainRef: 'TEST_DOMAIN',
        tags: [
            { id: 'tag-1', semantic: '#test', dimension: 'context', weight: 0.5 }
        ],
        payload: { foo: 'bar' },
        signature: 'SIG',
        hash_lock: 'LOCK',
        intent: 'Test manifestation',
        lifecycle: []
    };

    it('should validate a correct 5T Atom structure', () => {
        const result = OmniAtomSchema.safeParse(validAtomBase);
        expect(result.success).toBe(true);
    });

    it('should fail if UUID is invalid', () => {
        const invalidAtom = { ...validAtomBase, uuid: 'not-a-uuid' };
        const result = OmniAtomSchema.safeParse(invalidAtom);
        expect(result.success).toBe(false);
    });

    it('should fail if 5T renderType is invalid', () => {
        const invalidAtom = { ...validAtomBase, renderType: 'Generic' };
        const result = OmniAtomSchema.safeParse(invalidAtom);
        expect(result.success).toBe(false);
    });

    it('should fail if auraColor header is missing', () => {
        const invalidAtom = { ...validAtomBase, auraColor: 'red' };
        const result = OmniAtomSchema.safeParse(invalidAtom);
        expect(result.success).toBe(false);
    });

    it('should fail if required 5T dimensions are missing', () => {
        const { originHash, ...incompleteAtom } = validAtomBase as any;
        const result = OmniAtomSchema.safeParse(incompleteAtom);
        expect(result.success).toBe(false);
    });
});
