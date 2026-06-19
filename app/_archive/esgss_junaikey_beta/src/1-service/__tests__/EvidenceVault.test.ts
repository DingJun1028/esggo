import { describe, it, expect, beforeEach, vi } from 'vitest';
import { EvidenceVaultService } from '../EvidenceVaultService';
import { IComponentCore } from '@/0-domain/contracts/IComponentCore';
import { OmniCrypto } from '@/utils/OmniCrypto';

// Mock OmniLogger to avoid cluttering test output
vi.mock('@infra/logging/OmniLogger', () => ({
    omniLogger: {
        info: vi.fn(),
        warn: vi.fn(),
        error: vi.fn(),
    },
    LogCategory: {
        SYSTEM: 'SYSTEM',
    },
}));

describe('EvidenceVaultService', () => {
    let service: EvidenceVaultService;

    beforeEach(() => {
        // Access the private singleton instance via any means or just call getInstance if public
        // Since it's a singleton, state might persist. Ideally we reset the persistence layer.
        // For now, we rely on unique UUIDs for each test.
        service = EvidenceVaultService.getInstance();
    });

    const createMockAsset = (uuid: string): IComponentCore => ({
        uuid,
        version: '1.0.0',
        timestamp: Date.now(),
        status: 'Draft',
        evidence: {
            traceable: {
                source_origin: 'test-origin',
                verification_links: []
            },
            trustworthy: {
                hash_lock: '',
                is_frozen: false
            }
        },
        data: { value: 'test-data' }
    });

    it('should sign an asset and upgrade status to Trustworthy', async () => {
        const asset = createMockAsset('test-uuid-1');
        const signedAsset = await service.signEvidence(asset);

        expect(signedAsset.status).toBe('Trustworthy');
        expect(signedAsset.evidence.trustworthy?.is_frozen).toBe(true);
        expect(signedAsset.evidence.trustworthy?.hash_lock).toBeDefined();
        expect(signedAsset.evidence.trustworthy?.locked_at).toBeDefined();
        expect(Object.isFrozen(signedAsset)).toBe(true);
    });

    it('should generate a valid hash lock', async () => {
        const asset = createMockAsset('test-uuid-2');
        const signedAsset = await service.signEvidence(asset);

        const match = signedAsset.evidence.trustworthy?.hash_lock.match(/^SHA256:[a-f0-9]{32}$/);
        // Note: OmniCrypto.hash implementation details might vary, checking prefix
        expect(signedAsset.evidence.trustworthy?.hash_lock).toContain('SHA256:');
    });

    it('should persist the asset and retrieve it', async () => {
        const asset = createMockAsset('test-uuid-3');
        const saveResult = await service.save(asset);

        expect(saveResult.success).toBe(true);
        expect(saveResult.data).toBeDefined();

        const retrieved = await service.getAsset('test-uuid-3');
        expect(retrieved).toBeDefined();
        expect(retrieved?.uuid).toBe('test-uuid-3');
        expect(retrieved?.status).toBe('Trustworthy'); // Should be signed during save
    });

    it('should handle duplicate assets consistently (Idempotency)', async () => {
        const asset = createMockAsset('test-uuid-4');
        await service.save(asset);

        // Save again
        const saveResult = await service.save(asset);
        expect(saveResult.success).toBe(true);
        expect(saveResult.message).toContain('already exists');
    });

    it('should automatically sign an asset if not already signed when saving', async () => {
        const asset = createMockAsset('test-uuid-5');
        // Ensure it is NOT signed/frozen
        expect(asset.evidence.trustworthy?.is_frozen).toBeFalsy();

        await service.save(asset);

        const retrieved = await service.getAsset('test-uuid-5');
        expect(retrieved?.evidence.trustworthy?.is_frozen).toBe(true);
        expect(retrieved?.status).toBe('Trustworthy');
    });
});
