
import { InfoOneCore } from '../src/omni/core/InfoOneCore';
import { IMeritProfile10 } from '../src/types/esgss_schema';

async function testPhase18Full() {
    console.log('💎 Testing Phase 18: Omni-Truth Full Cycle...');

    // 1. Setup Mock Agent
    const virtues: IMeritProfile10 = {
        intelligence: 7, benevolence: 8, integrity: 9, courage: 7, temperance: 8, harmony: 8
    };

    const agent = new InfoOneCore({
        uuid: 'OMNI-TRUTH-001',
        name: 'Truth Seeker',
        virtues: virtues,
        evidence: {
            tangible: {
                metric: 'Carbon_Capture',
                value: 50,
                proof_url: 'http://iot-sensor-grid/v1/report'
            }
        },
        formula: 'Carbon Reduction = Energy * Efficiency',
        impactMetric: 'Omni'
    } as any);

    console.log('Initialized Agent:', agent.uuid);

    // 2. Mock Activation
    // Force active state to bypass timeouts
    (agent as any).status = 'ACTIVE';
    (agent as any).activationMatrix.status = 'ACTIVE';

    // 3. Run Optimization (Should trigger ARVO -> Evolution -> Sync)
    console.log('\n[Action] Running Optimization Cycle...');
    try {
        await agent.optimize();
    } catch (e) {
        console.error('Optimization Failed:', e);
    }

    // 4. Verify ARVO Status
    console.log('\n[Verification] Checking ARVO Status...');
    // ARVO status is stored in agent.arvoStatus
    console.log(`ARVO Status: ${(agent as any).arvoStatus}`);

    // 5. Verify Omni-Crystal (Evidence Vault)
    // Note: The optimize() in InfoOneCore currently triggers:
    // Sync -> Balance -> Evolution -> Sync
    // It does NOT explicitly call `secureEvidenceVault` unless we satisfy a condition or call it manually.
    // Looking at InfoOneCore.ts: `secureEvidenceVault` is L4. `optimize` calls L5, L2, L3.
    // Wait, the order in optimize() seems to be:
    // L5 (Sync Prep)
    // L17 (Balance)
    // L16 (Evolution)
    // L5 (Sync Dispatch)

    // It seems L4 (secureEvidenceVault) is NOT called in `optimize()`.
    // It might be intended to be called separately or I missed it in InfoOneCore.
    // Let's call it manually to verify the service works within the Core context.

    console.log('\n[Action] Securing Evidence Vault...');
    await (agent as any).secureEvidenceVault();

    console.log('\n[Verification] Omni-Crystal:');
    console.log((agent as any).omniCrystal);

    if ((agent as any).omniCrystal && (agent as any).omniCrystal.hash) {
        console.log('✅ Omni-Crystal successfully generated and anchored.');
    } else {
        console.error('❌ Omni-Crystal missing.');
    }

    console.log('\n💎 Phase 18 Cycle Complete.');
}

testPhase18Full();
