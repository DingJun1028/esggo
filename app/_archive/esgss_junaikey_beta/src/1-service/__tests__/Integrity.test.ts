import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { OmniTruthEngine } from '../OmniTruthEngine';
import { EvidenceVaultService } from '../EvidenceVaultService';
import { IComponentCore } from '@/0-domain/contracts/IComponentCore';
import { OmniCrypto } from '@/utils/OmniCrypto';

// Mock Loggers and UUID
vi.mock('@infra/logging/OmniLogger', () => ({
    omniLogger: {
        info: vi.fn(),
        warn: vi.fn(),
        error: vi.fn(),
        debug: vi.fn(),
    },
    LogCategory: {
        SYSTEM: 'SYSTEM',
        VALIDATION: 'VALIDATION',
        BLOCKCHAIN: 'BLOCKCHAIN',
        KNOWLEDGE: 'KNOWLEDGE'
    },
}));

// We don't mock EvidenceVaultService because we want to test its integration with TruthEngine
// But we might need to mock EvidencePersistence if we want clean state, or just use fresh UUIDs.

describe('Integrity & Truth Engine E2E', () => {
    let truthEngine: OmniTruthEngine;
    let evidenceVault: EvidenceVaultService;

    beforeEach(() => {
        truthEngine = OmniTruthEngine.getInstance();
        evidenceVault = EvidenceVaultService.getInstance();
    });

    const createMockEvidence = (uuid: string): IComponentCore => ({
        uuid,
        version: '1.0.0',
        timestamp: Date.now(),
        status: 'Draft',
        evidence: {
            traceable: { source_origin: 'test', verification_links: [] },
            transparent: { formula: 'E=MC2' },
            trustworthy: { hash_lock: '', is_frozen: false }
        },
        data: { content: 'evidence-data' }
    });

    it('should verify chain of custody for valid signed evidence', async () => {
        const uuid = `ev-${Date.now()}`;
        // 1. Create & Sign Evidence
        let evidence = createMockEvidence(uuid);
        const signedEvidence = await evidenceVault.signEvidence(evidence);
        const saveResult = await evidenceVault.save(signedEvidence);

        expect(saveResult.success).toBe(true);
        expect(signedEvidence.status).toBe('Trustworthy');

        // 2. Register Claim linking to this evidence (using new service logic)
        const claim = await truthEngine.registerClaimWithEvidence(
            'The data is valid.',
            [uuid]
        );

        expect(claim).toBeDefined();
        expect(claim.evidenceVaultRefs).toContain(uuid);

        // 3. Verify CoC
        const result = await truthEngine.verifyChainOfCustody(claim.id);

        expect(result.verified).toBe(true);
        expect(result.integrity).toBe('INTACT');
    });

    it('should fail chain of custody if evidence is missing', async () => {
        const missingUuid = `missing-${Date.now()}`;

        // 1. Manually register a claim with missing evidence ID
        // Since registerClaimWithEvidence attempts to fetch validity, we might get a warning or partial claim.
        // But if we force it:
        const claim = await truthEngine.registerClaimWithEvidence('Missing Evidence Claim', [missingUuid]);

        // By default, my implementation filters invalid IDs into validIds, wait.
        // My implementation: 
        // if (asset) validIds.push(id)
        // evidenceVaultRefs: validIds
        // So if evidence is missing, it won't be in evidenceVaultRefs.
        // Thus verifyChainOfCustody won't check it (or returns NO_EVIDENCE_LINKED).

        // Let's verify that behavior:
        expect(claim.evidenceVaultRefs).not.toContain(missingUuid);

        const result = await truthEngine.verifyChainOfCustody(claim.id);
        // If refs empty -> NO_EVIDENCE_LINKED (verified: false) in my implementation
        expect(result.verified).toBe(false);
        expect(result.integrity).toBe('NO_EVIDENCE_LINKED');
    });

    it('should fail chain of custody if evidence is technically present but not Trustworthy', async () => {
        const uuid = `tampered-${Date.now()}`;
        const unsignedEv = createMockEvidence(uuid);

        // Mock getAsset to return unsigned evidence
        // We need to spy on evidenceVault.getAsset
        const getAssetSpy = vi.spyOn(evidenceVault, 'getAsset').mockResolvedValue(unsignedEv);

        // We force a claim registration with this ID (assuming we bypass the check or mock it for registration too)
        // registerClaimWithEvidence calls getAsset too. It checks if asset exists. 
        // Unsigned asset exists, so it will be added.

        const claim = await truthEngine.registerClaimWithEvidence('Tampered Claim', [uuid]);
        expect(claim.evidenceVaultRefs).toContain(uuid);

        // Verify CoC
        const result = await truthEngine.verifyChainOfCustody(claim.id);
        expect(result.verified).toBe(false); // Should fail because not Trustworthy

        getAssetSpy.mockRestore();
    });
});
