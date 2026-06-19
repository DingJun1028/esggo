/**
 * Phase 61: Sentient Risk Verification Script
 * ------------------------------------------
 * Verifies that the AdaptiveRiskMatrixService correctly detects volatility 
 * and that the RiskMitigationActionSuite generates appropriate plans.
 */

import { adaptiveRiskMatrixService } from '../server/services/AdaptiveRiskMatrixService.js';
import { riskMitigationActionSuite } from '../server/services/RiskMitigationActionSuite.js';
import { OmniComponentCoreFactory } from '../server/services/OmniComponentCore.js';

async function runVerification() {
    console.log('🚀 Starting Phase 61: Sentient Risk Orchestration Verification...');

    // 1. Setup Simulation Data
    const baseCore = OmniComponentCoreFactory.create({
        sourceOrigin: 'Verification:Phase61',
        rawDataPath: 'test/risk_v11.1.json',
        verificationMethod: 'Test Simulation',
        version: '11.1.0-alpha'
    });

    // Simulate history for volatility calculation
    const history = [
        { ...baseCore, timestamp: Date.now() - 5000, status: 'Calculated' as any },
        { ...baseCore, timestamp: Date.now() - 4000, status: 'Violated' as any }, // Shift in status
        { ...baseCore, timestamp: Date.now() - 3000, status: 'Calculated' as any },
        { ...baseCore, timestamp: Date.now() - 500, status: 'Violated' as any }   // High frequency change
    ];

    console.log('\n🏗️  Testing Adaptive Risk Matrix...');
    const volatility = adaptiveRiskMatrixService.calculateVolatility(history);
    console.log(`Detected Volatility: ${volatility.toFixed(2)}`);

    const currentCore = history[history.length - 1]!;
    const riskScore = adaptiveRiskMatrixService.modelThreatEnvironment(currentCore);
    console.log(`Risk Score Profile: ${JSON.stringify(riskScore, null, 2)}`);
    console.log(`Composite Risk: ${riskScore.composite.toFixed(2)}`);

    // 2. Testing Mitigation
    console.log('\n🛡️  Testing Risk Mitigation Action Suite...');
    const plan = riskMitigationActionSuite.generateMitigationPlan(currentCore, riskScore);

    console.log(`Plan ID: ${plan.planId}`);
    console.log(`Actions Generated: ${plan.actions.length}`);
    plan.actions.forEach(a => console.log(` - [${a.type}] ${a.description} (Priority: ${a.priority})`));

    // Add a case for an un-secured core (v10.1 or below missing quantum anchors)
    console.log('\n🚨 Testing Un-secured Core Scenario (v11.1 without anchors)...');
    const unSecuredCore = {
        ...baseCore,
        uuid: 'unsecured-soul-node',
        version: '11.1.0-compromised',
        evidence: {
            ...baseCore.evidence,
            trustworthy: { hash_lock: 'fake-hash' } // Missing quantum_anchor
        }
    } as any;

    const unSecuredRiskScore = adaptiveRiskMatrixService.modelThreatEnvironment(unSecuredCore);
    console.log(`Un-secured Core Risk Score: ${unSecuredRiskScore.composite.toFixed(2)}`);
    const unSecuredPlan = riskMitigationActionSuite.generateMitigationPlan(unSecuredCore, unSecuredRiskScore);
    console.log(`Un-secured Core Plan Actions: ${unSecuredPlan.actions.length}`);

    if (unSecuredRiskScore.composite > 0.4) {
        console.log('✅ Un-secured core scenario detected as higher risk.');
    }


    // 3. Final Integrity Check
    if (riskScore.composite > 0.4 && plan.actions.length > 0) {
        console.log('\n✅ SENTIENT RISK ORCHESTRATION VERIFIED SUCCESSFULLY!');
        process.exit(0);
    } else {
        console.error('\n❌ Verification Failed: Risk detection or mitigation plan invalid.');
        process.exit(1);
    }
}

runVerification().catch(err => {
    console.error('Final Verification Error:', err);
    process.exit(1);
});
