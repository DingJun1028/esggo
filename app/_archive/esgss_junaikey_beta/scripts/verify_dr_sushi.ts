
import { reportGenerationService } from '../server/services/ReportGenerationService.js';
import { supabase } from '../server/src/config/supabase.js';

async function verifyDrSushi() {
    console.log("🍣 Initiating Dr. Sushi Report Verification...");

    // 0. Debug Check
    console.log("Environment Context:", {
        supabaseUrl: process.env.VITE_SUPABASE_URL,
        hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        nodeEnv: process.env.NODE_ENV
    });

    const userId = "00000000-0000-0000-0000-000000000000";

    // 2. Fetch some sample market items for context
    const { data: items } = await supabase
        .from('market_intelligence_items')
        .select('id')
        .limit(3);

    const itemIds = items?.map(i => i.id) || [];
    console.log(`📦 Using ${itemIds.length} items as context.`);

    // 3. Generate Report
    try {
        const report = await reportGenerationService.generateReport({
            userId,
            type: 'ESG_Intelligence',
            itemIds
        });

        console.log("\n✅ Report Generated Successfully!");
        console.log("-----------------------------------");
        console.log(`ID: ${report.id}`);
        console.log(`Title: ${report.title}`);
        console.log("Content Preview (Raw):", JSON.stringify(report.content).substring(0, 200) + "...");
        console.log("-----------------------------------");

        // 4. Verify in DB via direct query (Supabase client in script)
        const { data: verified } = await supabase
            .from('market_intelligence_reports')
            .select('*')
            .eq('id', report.id)
            .single();

        if (verified) {
            console.log("✨ Persistence Verified: Report exists in Supabase.");
        } else {
            console.error("❌ Persistence Failure: Report not found in DB.");
        }

    } catch (e) {
        console.error("❌ Verification Failed:", e);
    }
}

verifyDrSushi();
