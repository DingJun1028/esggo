import { describe, it, expect } from 'vitest';
import { EvidenceVaultService } from '../EvidenceVaultService.ts';

describe('Smoke Test', () => {
    it('should initialize EvidenceVaultService', () => {
        const service = new EvidenceVaultService();
        expect(service).toBeDefined();
    });

    it('should anchor evidence using crypto', async () => {
        const service = new EvidenceVaultService();
        const hash = await service.anchorEvidence('test-uuid', { foo: 'bar' });
        expect(hash).toBeDefined();
        expect(hash.length).toBe(64); // SHA-256 hex length
    });
});
