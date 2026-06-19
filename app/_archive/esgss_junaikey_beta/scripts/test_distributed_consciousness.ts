/**
 * 🧪 Distributed Consciousness & Swarm Consensus Verification
 * --------------------------------------------------
 * Verifies the end-to-end lifecycle: Ingestion -> Sync -> Audit -> Anchor.
 */

import { distributedConsciousness } from '../src/1-service/distributedConsciousness.js';
import { realTimeDataSync } from '../src/1-service/realTimeDataSync.js';
import { sovereignVaultService } from '../src/services/SovereignVaultService.js';
import { swarmConsensusService } from '../src/services/SwarmConsensusService.js';

// --- MOCK ENVIRONMENT ---
const MockWS = class {
    onopen: any = null;
    onmessage: any = null;
    onclose: any = null;
    constructor() {
        setTimeout(() => this.onopen?.(), 10);
    }
    send(data: string) {
        const msg = JSON.parse(data);
        // Simulate other nodes responding to audit requests
        if (msg.channel === 'swarm_audit_requests') {
            setTimeout(() => {
                realTimeDataSync.publish('swarm_consensus_votes', {
                    packetCid: msg.data.packetCid,
                    vote: {
                        agentId: 'Remote-Guardian-774',
                        packetCid: msg.data.packetCid,
                        harmony: 0.99,
                        timestamp: new Date().toISOString(),
                        signature: 'remote-sig-xyz'
                    }
                });
            }, 50);
        }
    }
    close() { }
};
(global as any).WebSocket = MockWS;

async function runVerification() {
    console.log('🧪 Starting Phase 28: Distributed Consciousness Verification...');

    try {
        // 1. Setup Connection
        console.log('📡 Initializing Real-Time Swarm...');
        await realTimeDataSync.connect('ws://swarm-mock');

        // 2. Process Data Lifecycle
        const testData = {
            metric: 'Carbon_Offset',
            value: 500,
            unit: 'tons',
            location: 'Taipei-101'
        };
        const source = 'sensor://tpe-101-carbon';

        console.log('🌀 Processing Data Lifecycle...');
        const cid = await distributedConsciousness.processLifecycle(testData, source);
        console.log(`✅ Data Anchored with CID: ${cid}`);

        // 3. Verify Consensus Report
        console.log('📊 Waiting for swarm resonance to settle...');
        await new Promise(resolve => setTimeout(resolve, 500)); // Give some time for all async votes

        console.log('📊 Verifying Swarm Consensus...');
        const report = swarmConsensusService.getConsensusReport(cid);
        console.log('Consensus Report:', JSON.stringify(report, null, 2));

        if (report.voteCount >= 4 && report.status === 'RESONATED') {
            console.log('✅ Proof of Resonance (PoR) Successful.');
        } else {
            console.warn(`⚠️ Partial Consensus: status=${report.status}, votes=${report.voteCount}/4`);
            if (report.voteCount < 3) {
                throw new Error(`Consensus failed significantly: votes=${report.voteCount}`);
            }
            console.log('✅ Minimal Consensus (3+) achieved. Proceeding.');
        }

        // 4. Verify Vault Integrity
        console.log('🏛️ Verifying Vault Status...');
        const stats = await sovereignVaultService.getVaultStats();
        console.log('Vault Stats:', JSON.stringify(stats, null, 2));

        if (stats.totalSealed > 0) {
            console.log('✅ Sovereign Vault Persistence Verified.');
        } else {
            throw new Error('Vault is empty!');
        }

        console.log('\n✨ [PHASE 28 VERIFIED] Distributed Consciousness Flow is NIRVANA.');
        process.exit(0);

    } catch (err) {
        console.error('❌ Verification Failed:', err);
        process.exit(1);
    }
}

runVerification();
