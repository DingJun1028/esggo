
import { InfoOneCore } from '../src/omni/core/InfoOneCore';
import { IMeritProfile10 } from '../src/types/esgss_schema';
import { omniLogger } from '../src/services/omniLogger';

// Mock Logger
omniLogger.info = (cat: string, msg: string) => console.log(`[INFO] [${cat}] ${msg}`);
omniLogger.warn = (cat: string, msg: string) => console.warn(`[WARN] [${cat}] ${msg}`);

async function testFulcrum() {
    console.log('☯️ Testing InfoOne Phase 17: MECE Fulcrum...');

    // Mock Data
    const baseData = {
        uuid: 'FULCRUM-TEST-001-',
        evidence: { tangible: { metric: 'TEST' } } as any,
        version: '1.0.0',
        timestamp: Date.now()
    };

    /**
     * Helper to run a test case
     */
    const runCase = async (name: string, virtues: IMeritProfile10) => {
        console.log(`\n--------------------------------------------------`);
        console.log(`🧪 Testing Case: ${name}`);

        const agent = new InfoOneCore({
            ...baseData,
            uuid: baseData.uuid + name,
            virtues
        } as any);

        // Force Active State to bypass timeout/async complexity
        (agent as any).status = 'ACTIVE';
        (agent as any).activationMatrix.status = 'ACTIVE';

        try {
            await agent.optimize();
        } catch (e) {
            console.error(`❌ Case ${name} Crashed:`, e);
        }
    };

    // Case 1: Accumulation (Low Vitality/Benevolence)
    const virtuesAccumulation: IMeritProfile10 = {
        intelligence: 5, benevolence: 3, integrity: 3, courage: 5, temperance: 5, harmony: 5
    };
    await runCase('ACCUMULATION', virtuesAccumulation);

    // Case 2: Expression (High Vitality, Courage, Control)
    const virtuesExpression: IMeritProfile10 = {
        intelligence: 8, benevolence: 9, integrity: 8, courage: 9, temperance: 8, harmony: 5
    };
    await runCase('EXPRESSION', virtuesExpression);

    // Case 3: Equilibrium
    const virtuesEquilibrium: IMeritProfile10 = {
        intelligence: 6, benevolence: 6, integrity: 6, courage: 6, temperance: 6, harmony: 6
    };
    await runCase('EQUILIBRIUM', virtuesEquilibrium);

    console.log(`\n--------------------------------------------------`);
    console.log('✅ Test Suite Complete.');
}

testFulcrum();
