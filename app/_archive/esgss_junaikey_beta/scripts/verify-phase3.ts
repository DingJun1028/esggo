/**
 * verify-phase3.ts
 * [🧪驗證] Phase 3 終態驗證：全域合成與 4T 封鎖
 */

import { sustainabilityReportService } from '../src/services/SustainabilityReportService.js';
import { omniExportService } from '../src/services/esg/OmniExportService.js';

async function verifyPhase3() {
    console.log("🚀 Starting Phase 3 Final Verification...");

    // 1. 建立報告草稿
    const draft = await sustainabilityReportService.createDraft("Omni Sentient Corp", 2026);
    await sustainabilityReportService.addMetric(draft.uid, {
        category: "Renewable Energy",
        scope: "SCOPE_2",
        value: 1000,
        unit: "MWh"
    });

    console.log("✅ Step 1: Draft and Metrics initialized.");

    // 2. 編譯全語義報告
    const content = await sustainabilityReportService.compileFullReport(draft.uid);
    console.log("✅ Step 2: Full report compiled. Content snapshot:", content.substring(0, 100) + "...");

    // 3. 執行終極 4T 封鎖 (Crystallization)
    const globalHash = await sustainabilityReportService.sealReport(draft.uid);
    console.log("✅ Step 3: Report SEALED. Global Hash:", globalHash);
    console.log("   Status Check:", draft.status);

    // 4. 執行高保真度匯出
    const pdfPath = await omniExportService.exportReport(draft, 'PDF');
    const wordPath = await omniExportService.exportReport(draft, 'DOCX');

    console.log(`✅ Step 4: Export successful.\n   - PDF: ${pdfPath}\n   - Word: ${wordPath}`);

    // 5. 生成附錄摘要
    const appendix = omniExportService.generateEvidenceAbstract(draft);
    console.log("✅ Step 5: Appendix generated.\n", appendix);

    console.log("\n💎 Phase 3 Verification Successful! The system is now TRANSCENDED.");
}

verifyPhase3().catch(err => {
    console.error("❌ Final Verification Failed:", err);
    process.exit(1);
});
