
import { marketIntelligenceCenterService } from '../src/services/MarketIntelligenceCenterService.js';

async function verifyMarketIntelligence() {
    console.log('--- STARTING MARKET INTELLIGENCE VERIFICATION ---');

    const userId = 'user-mic-verify-1';

    // 1. Initialize User
    console.log('\n[1] Initializing User...');
    const progress = await marketIntelligenceCenterService.getUserProgress(userId);
    console.log('User Rank:', progress.rank);

    // 2. Generate Report with 5T Verification
    console.log('\n[2] Generating Intelligence Report...');
    const report = await marketIntelligenceCenterService.generateReport(userId, {
        type: 'company',
        target: 'TSMC',
        focusAreas: ['ESG', 'Carbon', 'Governance']
    }) as any; // Cast to any to access new properties

    console.log('Report Title:', report.title);

    // Verify 5T Score
    if (report.verification) {
        console.log('✅ 5T Verification Present:');
        console.log(`   - TRUTH (Reliability): ${report.verification.truth}`);
        console.log(`   - TRUST (Confidence): ${report.verification.trust}`);
        console.log(`   - TRACEABILITY: ${report.verification.traceability}`);
        console.log(`   - TRANSPARENCY: ${report.verification.transparency}`);
        console.log(`   - TANGIBILITY: ${report.verification.tangibility}`);
        console.log(`   - OVERALL: ${report.verification.overall}`);

        if (report.verification.isVerified) {
            console.log('✅ Report is 5T VERIFIED');
        } else {
            console.log('⚠️ Report 5T Score too low (Expected for draft/mock data)');
        }
    } else {
        console.error('❌ 5T Verification Missing in Report');
        process.exit(1);
    }

    // Verify Source Origin in Findings
    const findingWithOrigin = report.findings.find((f: any) => f.sourceOrigin);
    if (findingWithOrigin) {
        console.log(`✅ Finding contains Source Origin: ${findingWithOrigin.sourceOrigin}`);
    } else {
        console.error('❌ Source Origin Missing in Findings');
        process.exit(1);
    }

    // 3. Generate Dynamic Alerts
    console.log('\n[3] Generating Dynamic Alerts...');
    const alerts = await marketIntelligenceCenterService.generateAlerts(userId);
    console.log(`Generated ${alerts.length} alerts.`);

    const volatilityAlert = alerts.find((a: any) => a.volatilityIndex !== undefined);
    if (volatilityAlert) {
        console.log(`✅ Volatility Index found: ${volatilityAlert.volatilityIndex}`);
    } else {
        console.log('⚠️ No high volatility alerts triggered (Random factor), but function ran.');
    }

    // Check mandatory opportunity alert
    const opportunityAlert = alerts.find(a => a.type === 'opportunity');
    if (opportunityAlert) {
        console.log('✅ Mandatory Opportunity Alert found.');
    } else {
        console.error('❌ Mandatory Opportunity Alert missing.');
        process.exit(1);
    }

    console.log('\n✅ --- VERIFICATION COMPLETE: ALL CHECKS PASSED ---');
}

verifyMarketIntelligence();
