import { forensicOracle } from "./lib/services/forensic-oracle";
import { supplyChainService } from "./lib/services/supply-chain-service";

async function testForensics() {
    console.log("=== Phase 9 Forensic Verification ===");

    // 1. Test Supply Chain Analytics
    const analytics = supplyChainService.getAnalytics();
    console.log("Supply Chain Analytics:", JSON.stringify(analytics, null, 2));

    // 2. Test Multi-tier Traceability
    const tierData = await supplyChainService.traceMultiTier("SUP-001");
    console.log("Tier-2/3 Data:", JSON.stringify(tierData, null, 2));

    // 3. Test Forensic Oracle
    const report = await forensicOracle.analyzeSupplyChain("SUP-001");
    console.log("Forensic Report:", JSON.stringify(report, null, 2));

    if (report.integrity.zkpVested) {
        console.log("SUCCESS: ZKP Vested status confirmed.");
    } else {
        console.log("FAILURE: ZKP Vested status missing.");
    }
}

testForensics().catch(console.error);
