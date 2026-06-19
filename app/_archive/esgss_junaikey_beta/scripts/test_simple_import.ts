
import { IBalanceFulcrum } from '../src/0-domain/contracts/IBalanceFulcrum';
import { OmniBalanceService } from '../src/omni/core/OmniBalanceService';
import { InfoOneCore } from '../src/omni/core/InfoOneCore';

async function test() {
    console.log('1. Checking IBalanceFulcrum...');
    // Types might be erased, but let's check if the module resolves
    console.log('✅ IBalanceFulcrum module resolved (compile time check).');

    console.log('2. checking OmniBalanceService...');
    try {
        const svc = new OmniBalanceService();
        console.log('✅ OmniBalanceService instantiated:', !!svc);
    } catch (e) {
        console.error('❌ OmniBalanceService instantiation failed:', e);
    }

    console.log('3. Checking InfoOneCore...');
    try {
        console.log('Class InfoOneCore:', !!InfoOneCore);
        const data = {
            uuid: 'IMPORT-TEST-001',
            evidence: { tangible: { metric: 'TEST' } } as any,
            virtues: { intelligence: 5, benevolence: 5, integrity: 5, courage: 5, temperance: 5, harmony: 5 }
        };
        const agent = new InfoOneCore(data);
        console.log('✅ InfoOneCore instantiated.');

        console.log('4. Calling Agent Methods...');
        agent.activate();
        console.log('✅ Activated.');

        await agent.optimize();
        console.log('✅ Optimization cycle complete.');

    } catch (e) {
        console.error('❌ InfoOneCore check failed:', e);
    }
}

test();
