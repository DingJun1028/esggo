/**
 * verify-hub-phase2.ts
 * [🧪驗證] 永續報告中心 Phase 2 整合測試
 */

import { sustainabilityReportService } from '../src/services/SustainabilityReportService.js';
import { complianceSentinel } from '../src/services/esg/ComplianceSentinel.js';
import { taskMatrixService } from '../src/services/esg/TaskMatrixService.js';

async function verifyHub() {
    console.log("🚀 Starting Phase 2 Hub Verification...");

    // 1. 建立報告與指標
    const draft = await sustainabilityReportService.createDraft("Omni Corp", 2026);
    await sustainabilityReportService.addMetric(draft.uid, {
        category: "Electricity",
        scope: "SCOPE_2",
        value: 5000,
        unit: "kWh"
    });

    console.log("✅ Step 1: Draft created and metrics added.");

    // 2. 執行報告組裝 (Factory Engine)
    const index = await sustainabilityReportService.assembleReport(draft.uid, "GRI");
    console.log("✅ Step 2: Report assembled. Chapters:", index.chapters.length);

    console.log("🛠️ Step 3: Triggering Compliance Sentinel audit...");
    const audit = await complianceSentinel.auditReport(draft, "GRI");
    console.log("✅ Step 3: Audit completed. Score:", audit.score);

    // 4. 生成任務矩陣 (Task Matrix)
    const tasks = await taskMatrixService.generateTaskMatrix(draft.uid, audit.gaps);
    console.log("✅ Step 4: Task matrix generated. Tasks:", tasks.length);
    console.log("   First Task:", tasks[0].title);

    console.log("\n🎉 Phase 2 Hub Verification Successful!");
}

verifyHub().catch(err => {
    console.error("❌ Verification Failed:", err);
    process.exit(1);
});
