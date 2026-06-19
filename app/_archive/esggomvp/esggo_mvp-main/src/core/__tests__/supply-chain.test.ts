import { describe, it, expect, vi, beforeEach } from 'vitest';
import { omniSupplyChain } from '../omni-supply-chain';
import { OmniNcbService } from '../omni-ncb-service';
import { riskPredictor } from '../omni-risk-predictor';

vi.mock('../omni-ncb-service', () => ({
    OmniNcbService: {
        fetchSuppliers: vi.fn().mockResolvedValue([
            { id: 's1', name: 'Green Energy Co', esg_rating: 'A', risk_level: 'low', hash: 'sealed-hash-001' },
            { id: 's2', name: 'Dirty Coal Ltd', esg_rating: 'E', risk_level: 'critical' }
        ]),
        listReports: vi.fn().mockResolvedValue([])
    }
}));

describe('OmniSupplyChainService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should map suppliers and identify unsealed risks', async () => {
        const suppliers = await omniSupplyChain.getSuppliers();

        expect(suppliers).toHaveLength(2);
        expect(suppliers[0].hashLock).toBe('sealed-hash-001');
        expect(suppliers[1].hashLock).toBe('unsealed');
        expect(suppliers[1].riskLevel).toBe('critical');
    });

    it('should identify risk nodes linked to global risk predictor', async () => {
        const riskNodes = await omniSupplyChain.getRiskNodes();

        expect(riskNodes.length).toBeGreaterThan(0);
        expect(riskNodes.some(n => n.severity === 'critical')).toBe(true);
        expect(riskNodes[0].mitigationPlan).toContain('backup');
    });

    it('should calculate supply chain stats accurately', async () => {
        const stats = await omniSupplyChain.getSupplyChainStats();

        expect(stats.totalSuppliers).toBe(2);
        expect(stats.highRiskCount).toBe(1);
        expect(stats.compliantCount).toBe(1);
    });
});
