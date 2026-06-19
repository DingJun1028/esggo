
import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs';
import { OmniAcceptanceService } from './server/services/OmniAcceptanceService.js';

async function verify9DAcceptance() {
    const logBuffer: string[] = [];
    const log = (msg: string) => {
        // console.log(msg); // Disable console log to avoid interference
        logBuffer.push(msg);
    };

    log('🔮 Initiating 9-Dimensional Acceptance Verification Protocol...');

    try {
        const service = OmniAcceptanceService.getInstance();
        const systemName = 'Omni-System-Integration-Verification';

        log(`📊 Running Full Acceptance Test for: ${systemName}`);

        // Wait for logger initialization
        await new Promise(resolve => setTimeout(resolve, 500));

        const result = await service.runFullAcceptance(systemName);

        // Wait for any async logs to flush
        await new Promise(resolve => setTimeout(resolve, 2000));

        log('\n✅ Acceptance Test Complete!');
        log('--------------------------------------------------');
        log(`System: ${result.systemName}`);
        log(`Overall Score: ${result.overallScore.toFixed(2)}`);
        log(`Status: ${result.status}`);
        log(`Gate: ${result.acceptanceGate}`);
        log('--------------------------------------------------');
        log('9-Dimensional Scores:');
        log(`1. Function: ${result.scores.function.toFixed(2)}`);
        log(`2. Performance: ${result.scores.performance.toFixed(2)}`);
        log(`3. Efficiency (🆕): ${result.scores.efficiency.toFixed(2)}`);
        log(`4. Capacity: ${result.scores.capacity.toFixed(2)}`);
        log(`5. Probability (🆕): ${result.scores.probability.toFixed(2)}`);
        log(`6. Capability (🆕): ${result.scores.capability.toFixed(2)}`);
        log(`7. Potential: ${result.scores.potential.toFixed(2)}`);
        log(`8. Potential Energy (🆕): ${result.scores.potentialEnergy.toFixed(2)}`);
        log(`9. Momentum: ${result.scores.momentum.toFixed(2)}`);
        log('--------------------------------------------------');

        // Fix: Use .uuid access safely
        const uuid = (result.artifact as any).uuid || (result.artifact as any).id || 'undefined';
        log(`Artifact UUID: ${uuid}`);

        if (result.scores.efficiency > 0 && result.scores.probability > 0 &&
            result.scores.capability > 0 && result.scores.potentialEnergy > 0) {
            log('\n✨ VERIFICATION SUCCESS: All 4 new dimensions returned positive scores.');
        } else {
            log('\n⚠️ VERIFICATION WARNING: Some new dimensions returned 0 score. Check data sources.');
        }

        // Write to file
        fs.writeFileSync('verification_result.txt', logBuffer.join('\n'), 'utf8');
        console.log('📝 Results written to verification_result.txt');

        process.exit(0);

    } catch (error) {
        console.error('❌ Verification Failed:', error);
        process.exit(1);
    }
}

// execute
verify9DAcceptance();
