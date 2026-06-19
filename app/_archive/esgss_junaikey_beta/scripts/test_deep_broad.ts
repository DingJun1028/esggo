
import { InfoOneCore } from '../src/omni/core/InfoOneCore';
import { SyncVFXService } from '../src/omni/core/SyncVFXService';
import { EvolutionService } from '../src/omni/core/EvolutionService';
import { VirtueAttributeMapper } from '../src/omni/core/VirtueAttributeMapper';
import { IComponentCore, IMeritProfile10 } from '../src/0-domain/contracts/IComponentCore';
import { omniLogger } from '../src/services/omniLogger';

// Mock logger
omniLogger.info = (cat, msg) => console.log(`[INFO] [${cat}] ${msg}`);
omniLogger.warn = (cat, msg) => console.warn(`[WARN] [${cat}] ${msg}`);

async function testDeepBroad() {
    console.log('🧪 Testing InfoOne Phase 16: Deep-Broad Optimization...');

    // 1. Setup Broad Connectivity (Event Bus Subscription)
    const syncService = new SyncVFXService();
    let visualUpdateReceived = false;

    syncService.subscribeToVisuals((payload) => {
        console.log(`📡 [Frontend] Received Visual Update for ${payload.componentId}`);
        console.log(`   - Color: ${payload.vfx.resonanceColor}`);
        console.log(`   - Glow: ${payload.vfx.glowIntensity}`);
        visualUpdateReceived = true;
    });

    // 2. Setup Deep Penetration (Virtue Attribute Mapper with Kernel)
    // Create an anomaly profile (High Intelligence, Low Integrity) to trigger Kernel
    const riskyVirtues: IMeritProfile10 = {
        intelligence: 10,
        benevolence: 5,
        integrity: 2, // Too low for Int 10
        courage: 5,
        temperance: 5,
        harmony: 5
    };

    console.log('🔍 Testing Deep Penetration (Kernel Check)...');
    const mapper = new VirtueAttributeMapper();
    // Logic is internal to Mapper now via Kernel
    const attributes = mapper.convert(riskyVirtues);

    // INTELLIGENCE should be capped/adjusted by Kernel because Integrity is low
    // Original Int: 10. Kernel Rule: Int > 8 && Int < 5 -> Cap Int at 8.
    // Let's verify if the mapped MP (Intelligence) reflects this.
    // Mapper log should show warning.

    if (attributes.mp <= 8) {
        console.log(`✅ Deep Penetration Verified: Intelligence capped at ${attributes.mp} due to low Integrity.`);
    } else {
        console.warn(`❌ Deep Penetration Failed: Intelligence is ${attributes.mp} (Expected <= 8).`);
    }

    // 3. InfoOne Integration
    const data: Omit<IComponentCore, 'status' | 'lock'> = {
        uuid: 'OMNI-DEEP-BROAD-001',
        evidence: { tangible: { metric: 'TEST' } } as any,
        virtues: riskyVirtues,
        partnerAttributes: attributes
    };

    const agent = new InfoOneCore(data);
    agent.activate();
    await new Promise(r => setTimeout(r, 1100)); // Wait for activation

    // 4. Run Optimization Cycle (Triggers SyncVFX)
    console.log('🔄 Running Optimization Cycle...');
    // Mock the external services used inside optimize() for standalone test context
    // Ideally we'd use DI, but here we rely on the class structure.

    // We override the syncVisualDomain method temporarily or just trust the real one if dependencies are clean.
    // SyncVFXService is instantiated inside InfoOneCore.optimize(). 
    // Wait, InfoOneCore creates NEW instances of services internally.
    // To catch the event, we rely on the Singleton EventBus!

    await agent.optimize();

    // 5. Verify Broad Connectivity
    // Wait for async dispatch
    await new Promise(r => setTimeout(r, 200));

    if (visualUpdateReceived) {
        console.log('✅ Broad Connectivity Verified: Frontend received visual update.');
    } else {
        console.error('❌ Broad Connectivity Failed: No visual update received.');
    }

    console.log('🧪 Test Complete.');
}

testDeepBroad();
