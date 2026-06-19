import { describe, it, expect, vi, beforeEach } from 'vitest';
import { omniImpactCalculator } from '../omni-impact-calculator';
import { OmniNcbService } from '../omni-ncb-service';

// Mock NCB Service
vi.mock('../omni-ncb-service', () => ({
    OmniNcbService: {
        saveCarbonRecord: vi.fn().mockResolvedValue({ success: true }),
        fetchImpactMetrics: vi.fn().mockResolvedValue({
            sroi: 5.5,
            carbon_reduction: 20000,
            water_saved: 100000,
            community_beneficiaries: 50000,
            jobs_created: 1500
        })
    }
}));

describe('OmniImpactCalculatorService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should calculate scope emissions and generate a 5T hash seal', async () => {
        const input = {
            scope1: { stationaryCombustion: 100, mobileCombustion: 50, fugitiveEmissions: 10, processEmissions: 5 },
            scope2: { purchasedElectricity: 200, purchasedSteam: 50 },
            scope3: { businessTravel: 1000, purchasedGoods: 500, employeeCommuting: 200, wasteGenerated: 100, capitalGoods: 200 }
        };

        const result = await omniImpactCalculator.calculateScopeEmissions(input);

        expect(result.total).toBeGreaterThan(0);
        expect(result.hashSeal).toHaveLength(64); // SHA-256 length
        expect(result.verificationStatus).toBe('Immutable');
        expect(OmniNcbService.saveCarbonRecord).toHaveBeenCalled();
    });

    it('should fetch real metrics from NCB and calculate SROI', async () => {
        const investment = 100000;
        const result = await omniImpactCalculator.calculateSroi(investment);

        expect(result.investmentAmount).toBe(investment);
        expect(result.totalReturn).toBe(investment * 5.5);
        expect(result.currency).toBe('USD');
    });

    it('should fallback to base metrics if NCB fails', async () => {
        (OmniNcbService.fetchImpactMetrics as any).mockRejectedValueOnce(new Error('Network error'));

        const metrics = await omniImpactCalculator.getImpactMetrics();
        expect(metrics.sroi).toBe(4.2); // Base value
    });
});
