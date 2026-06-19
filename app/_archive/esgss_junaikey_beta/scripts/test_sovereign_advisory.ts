import { sovereignAdvisoryService } from '../src/services/ai/SovereignAdvisoryService';
import { omniLogger } from '../src/omni/infrastructure/logging/OmniLogger';

async function testAdvisory() {
    console.log('🚀 Starting Sovereign Advisory Verification...');

    try {
        const advice = await sovereignAdvisoryService.generateProactiveAdvice();
        console.log('✅ Advice Generated:');
        console.log(JSON.stringify(advice, null, 2));

        if (advice.id && advice.suggestion) {
            console.log('✨ [PASSED] Advice structure is valid.');
        } else {
            throw new Error('Invalid advice structure received.');
        }

        const history = sovereignAdvisoryService.getAdviceHistory();
        console.log(`📊 History Count: ${history.length}`);

    } catch (error) {
        console.error('❌ [FAILED] Advisory test failed:', error);
        process.exit(1);
    }
}

testAdvisory();
