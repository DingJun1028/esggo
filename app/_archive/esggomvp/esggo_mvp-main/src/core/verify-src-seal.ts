import { ReportService } from './ReportService';
import { omniLogger, LogCategory } from './omniLogger';

async function testSrcSeal() {
    omniLogger.info(LogCategory.SYSTEM, "Verification: Starting SRC Sealing Test...");

    const mockIndicators = [
        { code: "GRI-305-1", name: "Direct Emissions", value: 1200, unit: "tCO2e", confidence: 0.95 }
    ];

    try {
        // 1. Generate Report
        const report = await ReportService.generateEliteReport("Test Verification Report", mockIndicators);

        console.log("--- Report Manifested ---");
        console.log("UUID:", report.uuid);
        console.log("Status:", report.status);
        console.log("Hash:", (report as any).contentHash);
        console.log("Is Frozen:", (report as any).isFrozen);
        console.log("Payload Frozen:", Object.isFrozen(report.payload));
        console.log("Lifecycle Events:", report.lifecycle.length);

        // 2. Verify Immutability
        try {
            report.payload.title = "CANNOT_CHANGE";
            if (report.payload.title === "CANNOT_CHANGE") {
                console.error("❌ ERROR: Object was not frozen! Modification succeeded silently.");
            } else {
                console.log("✅ SUCCESS: Modification failed (silently or otherwise).");
            }
        } catch (e) {
            console.log("✅ SUCCESS: Object is frozen. Modification blocked by Exception.");
        }

        // 3. Verify Hash Consistency
        const originalHash = (report as any).contentHash;
        if (originalHash && originalHash.length === 64) {
            console.log("✅ SUCCESS: Valid SHA-256 hash generated.");
        } else {
            console.error("❌ ERROR: Invalid hash generated.", originalHash);
        }

    } catch (error) {
        console.error("Verification Failed:", error);
    }
}

testSrcSeal();
