import { MarketAnalysisService } from '../src/services/MarketAnalysisService';
import { omniLogger, LogCategory } from '../src/services/omniLogger';
import { isSupabaseConfigured } from '../src/lib/supabase';

async function verifyMarketIntelligence() {
    omniLogger.info(LogCategory.SYSTEM, '[START] Starting Market Intelligence Verification...');

    const testCompany = 'TSMC';

    try {
        omniLogger.info(LogCategory.SYSTEM, `[TEST] Testing Deep Analysis for: ${testCompany}`);
        const analysis = await MarketAnalysisService.performDeepAnalysis(testCompany);

        console.log('--- Analysis Result ---');
        console.log(`Company: ${analysis.companyName}`);
        console.log(`ESG Score: ${analysis.esgScore}`);
        console.log(`Sentiment: ${analysis.sentiment}`);
        console.log(`Summary: ${analysis.newsSummary}`);
        console.log(`Sources: ${analysis.sources?.join(', ') || 'None'}`);
        console.log('-----------------------');

        if (isSupabaseConfigured) {
            omniLogger.info(LogCategory.SYSTEM, '[OK] Supabase is configured. Persistence check initiated via logs.');
        } else {
            omniLogger.warn(LogCategory.SYSTEM, '[WARN] Supabase not configured. Skipping database check.');
        }

        omniLogger.info(LogCategory.SYSTEM, '[DONE] Verification Script Completed.');
    } catch (error) {
        omniLogger.error(LogCategory.SYSTEM, '[FAIL] Verification Failed', { error });
    }
}

verifyMarketIntelligence();
