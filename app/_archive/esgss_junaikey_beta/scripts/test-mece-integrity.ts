import { EnvironmentalForecastService } from '../src/1-service/EnvironmentalForecastService';
import { NatureBasedSolutionsService } from '../src/1-service/NatureBasedSolutionsService';
import { SupplyChainEthicsService } from '../src/1-service/SupplyChainEthicsService';
import { WellbeingIndexService } from '../src/1-service/WellbeingIndexService';
import { RiskIntelligenceService } from '../src/1-service/RiskIntelligenceService';
import { TransparencyEngineService } from '../src/1-service/TransparencyEngineService';
import { StakeholderVotingService } from '../src/1-service/StakeholderVotingService';
import { truthEngine } from '../src/1-service/OmniTruthEngine';
import { omniLogger, LogCategory } from '../src/1-service/omniLogger';

async function verifyMecePhase14() {
    const userUuid = 'user-001';
    omniLogger.info(LogCategory.SYSTEM, '🚀 Starting Phase 14: 24 MECE Integrity Verification...');

    try {
        // 1. Test E7
        const e7 = await EnvironmentalForecastService.generateForecast(userUuid, 'Taipei');
        const e7Valid = await truthEngine.verify5TIntegrity(e7);
        console.log(`[VERIFY] E7 (Environmental Forecast) ->`, e7Valid);

        // 2. Test E8
        const e8 = await NatureBasedSolutionsService.registerProject(userUuid, { name: 'Mangrove Restoration', type: 'Blue Carbon', area: 10 });
        const e8Valid = await truthEngine.verify5TIntegrity(e8);
        console.log(`[VERIFY] E8 (Nature-based Solutions) ->`, e8Valid);

        // 3. Test S7
        const s7 = await SupplyChainEthicsService.performEthicalAudit(userUuid, 'Supplier_X');
        const s7Valid = await truthEngine.verify5TIntegrity(s7);
        console.log(`[VERIFY] S7 (Supply Chain Ethics) ->`, s7Valid);

        // 4. Test S8
        const s8 = await WellbeingIndexService.calculateWellbeingIndex(userUuid, {});
        const s8Valid = await truthEngine.verify5TIntegrity(s8);
        console.log(`[VERIFY] S8 (Wellbeing Index) ->`, s8Valid);

        // 5. Test G5
        const g5 = await RiskIntelligenceService.analyzeRiskLandscape(userUuid, 'Supply_Chain_Gaps');
        const g5Valid = await truthEngine.verify5TIntegrity(g5);
        console.log(`[VERIFY] G5 (Risk Intelligence) ->`, g5Valid);

        // 6. Test G6
        const g6 = await TransparencyEngineService.verifyStatement(userUuid, 'Carbon neutral by 2050', { links: [] });
        const g6Valid = await truthEngine.verify5TIntegrity(g6);
        console.log(`[VERIFY] G6 (Transparency Engine) ->`, g6Valid);

        // 7. Test G8
        const g8 = await StakeholderVotingService.castVote(userUuid, 'Proposal_001', 'Support');
        const g8Valid = await truthEngine.verify5TIntegrity(g8);
        console.log(`[VERIFY] G8 (Stakeholder Voting) ->`, g8Valid);

        // 8. Global Sweep
        const sweep = await truthEngine.performGlobalIntegritySweep();
        console.log(`Global Integrity Sweep: ${sweep.verified}/${sweep.total} passed.`);

        if (e7Valid && e8Valid && s7Valid && s8Valid && g5Valid && g6Valid && g8Valid && sweep.verified === 24) {
            omniLogger.info(LogCategory.SYSTEM, '✅ Phase 14 Verification SUCCESSFUL. 24 MECE Services are 5T Compliant.');
        } else {
            omniLogger.error(LogCategory.SYSTEM, '❌ Phase 14 Verification FAILED. Some checks did not pass.');
            process.exit(1);
        }

    } catch (error) {
        console.error('CRITICAL: Test Execution Error');
        if (error instanceof Error) {
            console.error('Message:', error.message);
            console.error('Stack:', error.stack);
        } else {
            console.error('Unknown Error:', error);
        }
        process.exit(1);
    }
}

verifyMecePhase14();
