import { describe, it, expect } from 'vitest';
import { forensicOracle } from "./lib/services/forensic-oracle";
import { supplyChainService } from "./lib/services/supply-chain-service";

describe('Phase 9: Forensic & Multi-tier Traceability', () => {
    it('should aggregate supply chain analytics correctly', () => {
        const analytics = supplyChainService.getAnalytics();
        expect(analytics.supplierCount).toBeGreaterThan(0);
        expect(analytics.totalScope3Emissions).toBeDefined();
    });

    it('should perform multi-tier traceability scans', async () => {
        const tierData = await supplyChainService.traceMultiTier("SUP-001");
        expect(tierData.length).toBeGreaterThan(0);
        expect(tierData[0].tier).toBe(2);
    });

    it('should generate forensic reports with ZKP Vested status', async () => {
        const report = await forensicOracle.analyzeSupplyChain("SUP-001");
        expect(report.integrity).toBeDefined();
        expect(report.integrity.zkpVested).toBe(true);
        expect(report.recommendation).toBeDefined();
    });
});
