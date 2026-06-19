
import { describe, it, expect, vi } from 'vitest';
import { OmniTruthEngine } from '../../1-service/OmniTruthEngine';
import { OmniEsgManager } from '../../1-service/OmniEsgManager';
import { Protocol5T } from '../../omni/core/types/InfoOne.types';
import { OmniTagType } from '../../omni/core/types/OmniCore.types';

// Mock the UI components that cause issues in Node environment
vi.mock('../../omni/interaction/visuals/OmniEsgCell/OmniEsgCell', () => ({
    OmniEsgCell: () => null
}));

describe('Omni Expansion Verification', () => {

    describe('OmniTruthEngine', () => {
        const truthEngine = OmniTruthEngine.getInstance();

        it('should implement ITrinityService.getTrinity', async () => {
            expect(truthEngine.getTrinity).toBeDefined();
            expect(typeof truthEngine.getTrinity).toBe('function');
        });

        it('should be able to retrieve a Trinity for a claim', async () => {
            // Mock a claim registration to test getTrinity
            const claim = await truthEngine.registerClaimWithEvidence('Test Statement', []);
            const trinity = await truthEngine.getTrinity(claim.id);

            expect(trinity).toBeDefined();
            expect(trinity.component.id).toContain('COMP-TRUTH-');
            expect(trinity.knowledge.id).toContain('KB-TRUTH-');
            expect(trinity.identity.id).toContain('TAG-TRUTH-');
        });
    });

    describe('OmniEsgManager', () => {
        const esgManager = OmniEsgManager.getInstance();

        it('should implement ITrinityService.getTrinity', () => {
            expect(esgManager.getTrinity).toBeDefined();
            expect(typeof esgManager.getTrinity).toBe('function');
        });

        it('should implement awakenOmniTag', () => {
            expect(esgManager.awakenOmniTag).toBeDefined();
            expect(typeof esgManager.awakenOmniTag).toBe('function');
        });

        it('should correctly awaken an OmniTag with 5T Protocol', async () => {
            const mockTag = {
                id: 'TAG-TEST-VITEST-001',
                name: 'Test Tag Vitest',
                type: OmniTagType.SKILL,
                confidence: 0.8,
                protocol: [Protocol5T.TANGIBLE],
                owner: 'SYSTEM',
                value: 'test',
                createdAt: new Date(),
                usageCount: 0
            };

            // @ts-ignore - Partial mock is fine for this test
            const awakenedTag = await esgManager.awakenOmniTag(mockTag);

            expect(awakenedTag.protocol).toContain(Protocol5T.TRUSTWORTHY);
            expect(awakenedTag.protocol).toContain(Protocol5T.TRACEABLE);
            // @ts-ignore
            expect(awakenedTag.signature).toBeDefined();
            expect(Object.isFrozen(awakenedTag)).toBe(true);
        });
    });
});
