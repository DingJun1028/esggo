
import { OmniAgent } from './OmniAgent';
import { omniLogger, LogCategory } from '../../omni/infrastructure/logging/OmniLogger';
import { sovereignLedger } from '../../1-service/SovereignLedger';

async function testSimple() {
    console.log('--- Simple OmniAgent Test + Dependencies ---');
    const mockAgent: any = {
        id: 'test-agent',
        name: 'Test Agent',
        agent_status: 'ACTIVE',
        level: 1,
        dna: {},
        createdAt: new Date()
    };

    try {
        console.log('Testing Logger...');
        omniLogger.info(LogCategory.SYSTEM, 'Logger Check');

        console.log('Testing Ledger Instance...');
        console.log('Ledger UUID:', (sovereignLedger as any).getInstance ? 'HasInstance' : 'DirectObject');

        const agent = new OmniAgent(mockAgent);
        console.log('Initialization Success:', agent.uuid);

        console.log('--- End Simple Test ---');
    } catch (error) {
        console.error('Test Failed:', error);
        process.exit(1);
    }
}

testSimple();
