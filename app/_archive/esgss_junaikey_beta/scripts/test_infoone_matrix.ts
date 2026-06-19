
import { InfoOneCore } from '../src/omni/core/InfoOneCore';
import { InfoOneSyncDomain } from '../src/services/InfoOneSyncDomain';
import { IComponentCore } from '../src/0-domain/contracts/IComponentCore';
import { omniLogger } from '../src/services/omniLogger';

// Mock logger
omniLogger.info = (cat, msg) => console.log(`[INFO] ${msg}`);
omniLogger.warn = (cat, msg) => console.warn(`[WARN] ${msg}`);

async function testActivationMatrix() {
    console.log('🧪 Testing InfoOne Activation Matrix (Genesis Sync)...');

    // 1. Initialize Dormant Agent
    const data: Omit<IComponentCore, 'status' | 'lock'> = {
        uuid: 'GENESIS-001',
        evidence: { tangible: { metric: 'TEST' } } as any,
    };
    const agent = new InfoOneCore(data);

    if (agent.status === 'DORMANT') {
        console.log('✅ Case 1: Initial State is DORMANT.');
    } else {
        console.error('❌ Case 1 Failed:', agent.status);
    }

    // 2. Setup Sync Domain
    const syncDomain = InfoOneSyncDomain.getInstance();
    syncDomain.subscribe('TEST-CLIENT-01', (state) => {
        console.log('📡 [Client] Received Sync Update:', state);
    });

    // 3. Initiate Activation
    console.log('🚀 Initiating Activation...');
    agent.activate();

    // Check INITIALIZING state
    if (agent.status === 'INITIALIZING') {
        console.log('✅ Case 2: Transitioned to INITIALIZING.');
    } else {
        console.error('❌ Case 2 Failed:', agent.status);
    }

    // Wait for activation to complete (1.1s)
    await new Promise(r => setTimeout(r, 1100));

    if (agent.status === 'ACTIVE') {
        console.log('✅ Case 3: Transitioned to ACTIVE.');
    } else {
        console.error('❌ Case 3 Failed:', agent.status);
    }

    // 4. Test Sync & Optimization
    console.log('🔄 Testing Optimization & Sync...');
    await agent.optimize();

    // Broadcast state
    syncDomain.broadcastState(agent);

    // Simulate External Signal
    syncDomain.receiveSignal(agent, {
        type: 'HEARTBEAT',
        payload: { source: 'Metaverse-Alpha', timestamp: Date.now() - 50 }
    });

    if (agent.activationMatrix.syncState.target === 'Metaverse-Alpha') {
        console.log('✅ Case 4: Bidirectional Sync Verified.');
    } else {
        console.error('❌ Case 4 Failed: Sync State not updated.');
    }

    // 5. Termination
    console.log('🛑 Initiating Termination...');
    agent.terminate();

    // Wait for termination (1.1s)
    await new Promise(r => setTimeout(r, 1100));

    if (agent.status === 'DORMANT') {
        console.log('✅ Case 5: Cycle Complete. Returned to DORMANT.');
    } else {
        console.error('❌ Case 5 Failed:', agent.status);
    }
}

testActivationMatrix();
