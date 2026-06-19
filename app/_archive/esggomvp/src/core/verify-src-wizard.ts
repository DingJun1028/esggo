import { ReportService } from './ReportService';
import { omniLogger, LogCategory } from './omniLogger';

async function testSrcWizard() {
    omniLogger.info(LogCategory.SYSTEM, "Verification: Starting SRC Wizard Test...");

    try {
        const context = await ReportService.getWizardContext("Environmental Stewardship");

        console.log("--- Wizard Context Generated ---");
        console.log("Guidance:", context.guidance.substring(0, 100) + "...");
        console.log("Benchmarks Found:", context.benchmarks.length);
        console.log("Weaving - Conservative:", context.weavingOptions.conservative.substring(0, 50) + "...");
        console.log("Weaving - Visionary:", context.weavingOptions.visionary.substring(0, 50) + "...");

        if (context.benchmarks.length > 0) {
            console.log("✅ SUCCESS: Benchmarking retrieved data.");
        } else {
            console.log("⚠️ WARNING: No benchmarks found (expected if DB is empty).");
        }

    } catch (error) {
        console.error("Verification Failed:", error);
    }
}

testSrcWizard();
