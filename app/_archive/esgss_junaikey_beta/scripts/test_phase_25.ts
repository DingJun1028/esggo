
import { riskForecastingEngine } from '../src/services/RiskForecastingEngine.js';
import { scalingEngine } from '../src/services/ScalingEngine.js';
import { AICoordinationService } from '../src/services/AICoordinationService.js';
import { omniLogger, LogCategory } from '../src/services/omniLogger.js';

/**
 * 🧪 Phase 25: AI-Driven Auto-Scaling & Predictive Risk Analytics Verification
 * Validates the forecasting logic and system auto-scaling decisions.
 */
async function verifyPhase25() {
    console.log('--- 🧪 [Phase 25] AI Auto-Scaling & Risk Analytics Verification Start ---');

    // 1. Test Risk Forecasting Logic
    console.log('1. Testing Risk Forecasting Engine...');
    try {
        const mockHistory = [
            { timestamp: Date.now() - 3600000, metrics: { cpu: 45, memory: 60 } },
            { timestamp: Date.now() - 1800000, metrics: { cpu: 55, memory: 65 } },
            { timestamp: Date.now(), metrics: { cpu: 75, memory: 80 } }
        ];

        const forecasts = await riskForecastingEngine.forecastRisk(mockHistory);
        console.log('✅ Risk Forecasting successful!');
        forecasts.forEach((f, i) => {
            console.log(`   [Forecast ${i + 1}] Risk: ${f.riskType} | Level: ${f.riskLevel} | Confidence: ${f.confidence}`);
            console.log(`     Mitigation: ${f.mitigationStrategy}`);
        });

        // 2. Test Scaling Engine
        console.log('\n2. Testing Scaling Engine Decisions...');
        const scalingDecisions = await scalingEngine.evaluateScaling();
        console.log('✅ Scaling Evaluation successful!');
        if (scalingDecisions.length > 0) {
            scalingDecisions.forEach((d, i) => {
                console.log(`   [Decision ${i + 1}] Action: ${d.action} | Resource: ${d.resourceType} | Confidence: ${d.confidence}`);
                console.log(`     Reason: ${d.reason}`);
            });
        } else {
            console.log('   (No urgent scaling actions needed at this time based on system stats)');
        }

        // 3. Test Orchestration via AICoordinationService
        console.log('\n3. Testing AI Coordination Orchestration...');
        const coordinatedForecasts = await AICoordinationService.performPredictiveRiskAnalysis(mockHistory);
        console.log(`✅ Coordinated analysis returned ${coordinatedForecasts.length} results.`);

    } catch (error) {
        console.error('❌ Phase 25 Verification Failed:', error);
        process.exit(1);
    }

    console.log('\n--- 🧪 Phase 25 Verification Completed ---');
}

verifyPhase25().catch(err => {
    console.error('Unhandled error during verification:', err);
    process.exit(1);
});
