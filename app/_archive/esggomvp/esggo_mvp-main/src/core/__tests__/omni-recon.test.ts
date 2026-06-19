import { describe, it, expect } from 'vitest';
import { processReconnaissanceIntel, generateHash } from '../omni-recon-center';

describe('Business Reconnaissance Center (BRC) - 5T Gateway', () => {
    const mockRawData = {
        title: 'Global Carbon Tax Impact S1',
        insight: 'Immediate 15% increase in operational costs for EU-market heavy industry.',
        source_url: 'https://unfccc.int/briefing/2026',
        risk_score: 85,
        affected_supply_chain: ['Steel', 'Aluminum'],
        evidence: {
            method: 'S1-Policy-Analysis',
            doc_ref: 'UN-2026-X1'
        }
    };

    it('should correctly process raw data into a 5T Intel Node', () => {
        const node = processReconnaissanceIntel(mockRawData, 'S1');

        expect(node.uuid).toContain('INTEL-S1');
        expect(node.category).toBe('S1');
        expect(node.impact_level).toBe(5); // Risk score 85 > 80
        expect(node.protocol_5T.tangible).toBe(true);
        expect(node.protocol_5T.traceable).toBe(mockRawData.source_url);
        expect(node.protocol_5T.trustworthy).toBe(generateHash(JSON.stringify(mockRawData)));
        expect(node.status).toBe('Trustworthy');
    });

    it('should enforce immutability via Object.freeze', () => {
        const node = processReconnaissanceIntel(mockRawData, 'S1');

        // Attempting to modify should throw in strict mode or fail silently/error in dev
        expect(() => {
            (node as any).category = 'S2';
        }).toThrow();
        
        expect(node.category).toBe('S1');
    });

    it('should generate consistent hash locks', () => {
        const hash1 = generateHash(JSON.stringify(mockRawData));
        const hash2 = generateHash(JSON.stringify(mockRawData));
        expect(hash1).toBe(hash2);
        
        const hash3 = generateHash(JSON.stringify({ ...mockRawData, risk_score: 84 }));
        expect(hash1).not.toBe(hash3);
    });
});
