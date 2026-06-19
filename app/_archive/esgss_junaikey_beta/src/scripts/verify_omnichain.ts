import { TrinityManager } from '../omni/infrastructure/synchronization/TrinityManager';
import { IOmniComponent, IOmniKB, IOmniTag, TrinityComponentState, TrinityTagType, Protocol5T } from '../omni/core/types/InfoOne.types';
import { omniChain } from '../omni/core/OmniChain';
import { omniLogger, LogCategory } from '../omni/infrastructure/logging/OmniLogger';

/**
 * Verification Script: OmniChain Eternal Trust Layer
 * ------------------------------------------------
 * [TC] ?¬èƒ½/å¥§ç?å¸³æœ¬é©—è??³æœ¬ï¼šæ¸¬è©¦æ??½ç??´è??€çµ‚éŒ¨å®šã€?
 */
async function verifyOmniChain() {
    omniLogger.info(LogCategory.SYSTEM, '--- Starting OmniChain Trust Verification (çªç ´?§é?è­? ---');

    // 1. Forge a Trinity Asset
    const manager = TrinityManager.getInstance();
    const component: IOmniComponent = {
        id: 'COMP-CHAIN',
        name: 'OmniChain Test Component',
        state: TrinityComponentState.READY,
        impactMetric: 'ChainProof',
        lifecyclePath: ['init', 'forge'],
        execute: async () => { },
        cleanup: async () => { }
    };
    const knowledge: IOmniKB = {
        id: 'KB-CHAIN',
        content: 'Eternal knowledge for blockchain anchoring.',
        sourceOrigin: 'VerificationScript',
        tags: [Protocol5T.TANGIBLE],
        hashLock: ''
    };
    const identity: IOmniTag = {
        id: 'TAG-CHAIN',
        name: 'Chain Identity',
        type: TrinityTagType.IDENTITY,
        protocol: [Protocol5T.TRACEABLE],
        signature: 'CHAIN-SIG',
        value: 'ChainData',
        createdAt: new Date()
    };

    const trinity = manager.forge(component, knowledge, identity);
    const uuid = trinity.uuid;
    omniLogger.info(LogCategory.SYSTEM, `[Step 1] Created Trinity for breakthrough (å¥§ç?/?¬èƒ½): ${uuid}`);

    // 2. Anchor the Asset
    omniLogger.info(LogCategory.SYSTEM, `[Step 2] Initiating potential breakthrough to OmniChain: ${uuid}`);
    const anchorResult = await omniChain.anchorAsset(uuid);

    if (anchorResult.success && anchorResult.trinity_status === 'TRUSTWORTHY') {
        omniLogger.info(LogCategory.SYSTEM, `[Step 2] Breakthrough & Anchor Successful (?¬èƒ½?§ç¢ºç«?. Status: ${anchorResult.trinity_status}`);
        omniLogger.info(LogCategory.SYSTEM, `[Step 2] Anchor Proof: ${anchorResult.anchor.proof}`);
    } else {
        omniLogger.error(LogCategory.SYSTEM, '[Step 2] Anchor FAILED or breakthrough denied.');
        process.exit(1);
    }

    // 3. Verify the Anchor
    omniLogger.info(LogCategory.SYSTEM, `[Step 3] Verifying Anchor for ${uuid}`);
    const verifyResult = await omniChain.verifyAnchor(uuid);

    if (verifyResult.isValid && verifyResult.anchor) {
        omniLogger.info(LogCategory.SYSTEM, '[Step 3] Anchor VERIFIED. Eternal Integrity intact.');
        omniLogger.info(LogCategory.SYSTEM, '--- OMNICHAIN (?¬èƒ½/å¥§ç?) VERIFICATION SUCCESS ---');
    } else {
        omniLogger.error(LogCategory.SYSTEM, '[Step 3] Anchor Verification FAILED.');
        process.exit(1);
    }
}

verifyOmniChain().catch(err => {
    console.error(err);
    process.exit(1);
});
