import { omniComprehense } from '../omni/core/OmniComprehense';
import { omniRecurse } from '../omni/core/OmniRecurse';
import { TrinityManager } from '../omni/infrastructure/synchronization/TrinityManager';
import { IOmniComponent, IOmniKB, IOmniTag, TrinityComponentState, TrinityTagType, Protocol5T } from '../omni/core/types/InfoOne.types';
import { omniLogger, LogCategory } from '../omni/infrastructure/logging/OmniLogger';

/**
 * Verification Script: Sovereign Loop Recursion
 * -------------------------------------------
 * Target: Verify that transcendent insights are correctly injected back into OmniKB.
 */
async function verifyRecursion() {
    omniLogger.info(LogCategory.SYSTEM, '--- Starting Sovereign Loop Verification ---');

    // 1. Forge a Mock Trinity
    const manager = TrinityManager.getInstance();
    const component: IOmniComponent = {
        id: 'COMP-TEST',
        name: 'Recursion Test Component',
        state: TrinityComponentState.READY,
        impactMetric: 'Test',
        lifecyclePath: ['init'],
        execute: async () => { },
        cleanup: async () => { }
    };
    const knowledge: IOmniKB = {
        id: 'KB-TEST',
        content: 'Original knowledge content.',
        sourceOrigin: 'VerificationScript',
        tags: [Protocol5T.TANGIBLE],
        hashLock: ''
    };
    const identity: IOmniTag = {
        id: 'TAG-TEST',
        name: 'Test Identity',
        type: TrinityTagType.IDENTITY,
        protocol: [Protocol5T.TRUSTWORTHY],
        signature: 'TEST-SIG',
        value: 'IdentityData',
        createdAt: new Date()
    };

    const trinity = manager.forge(component, knowledge, identity);
    const uuid = trinity.uuid;
    omniLogger.info(LogCategory.SYSTEM, `[Step 1] Forged Trinity: ${uuid}`);

    // 2. Reach Transcendence
    const topicId = 'ESG_UNIVERSAL_SOP';
    omniLogger.info(LogCategory.SYSTEM, `[Step 2] Evolving topic: ${topicId}`);

    await omniComprehense.synthesize(topicId, 0.5);
    await omniComprehense.abstract(topicId, 0.8);
    let state = await omniComprehense.deepen(topicId);

    // Ensure it's transcended
    while (state.status !== 'TRANSCENDED') {
        state = await omniComprehense.deepen(topicId);
    }
    omniLogger.info(LogCategory.SYSTEM, `[Step 2] Topic TRANSCENDED: ${state.insight}`);

    // 3. Inject Insight (Close the Loop)
    omniLogger.info(LogCategory.SYSTEM, `[Step 3] Injecting Insight into ${uuid}`);
    const result = await omniRecurse.injectInsight(uuid, topicId);

    if (result.success) {
        omniLogger.info(LogCategory.SYSTEM, `[Step 3] Injection successful: ${result.insight}`);
    }

    // 4. Verify Final State
    const updatedTrinity = manager.getTrinity(uuid);
    if (updatedTrinity && updatedTrinity.knowledge.content.includes('[Transcendent Insight]')) {
        omniLogger.info(LogCategory.SYSTEM, '--- VERIFICATION SUCCESS: Loop Closed ---');
        console.log('\nFINAL KB CONTENT:\n', updatedTrinity.knowledge.content);
    } else {
        omniLogger.error(LogCategory.SYSTEM, '--- VERIFICATION FAILED: Content not updated ---');
        process.exit(1);
    }
}

verifyRecursion().catch(err => {
    console.error(err);
    process.exit(1);
});
