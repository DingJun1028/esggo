import { InsideOutEmitter } from '../src/0-core/diffusion/InsideOutEmitter';
import { OmniAgent } from '../src/0-core/trinity/OmniAgent';
import { omniLogger } from '../src/utils/OmniLogger';

/**
 * 🧪 verify-diffusion-5t.ts
 * Verifies the Universal Diffusion Mechanism and 5T Protocol Compliance.
 */

async function verifyDiffusion() {
    omniLogger.info('SYSTEM', '🚀 Starting 5T Diffusion Verification...');

    // 1. Setup Mock Agent
    const agent = new OmniAgent({
        id: 'test-agent-001',
        name: 'Diffusion Tester',
        level: 10,
        experience: 0,
        role: 'VERIFIER'
    } as any);

    const emitter = new InsideOutEmitter();

    // 2. Perform Diffusion (Core -> Aura)
    omniLogger.info('SYSTEM', '🌊 Executing Inside-out Radiation...');
    const auraData = await emitter.radiate(agent.infoCore);

    // 3. 5T Compliance Checks
    omniLogger.info('SYSTEM', '🛡️ Checking 5T Compliance...');

    // [Traceable] - Origin check
    if (auraData.source_origin) {
        omniLogger.info('SYSTEM', '✅ [Traceable]: Source origin preserved in manifestation.');
    } else {
        throw new Error('❌ [Traceable]: Source origin missing!');
    }

    // [Trustworthy] - Hash Lock check
    if (auraData.hash_lock) {
        omniLogger.info('SYSTEM', '✅ [Trustworthy]: Hash lock synchronized to Aura.');
    } else {
        throw new Error('❌ [Trustworthy]: Hash lock missing!');
    }

    // [Trackable] - Resonance rs check
    if (auraData.resonance_rs !== undefined) {
        omniLogger.info('SYSTEM', `✅ [Trackable]: Resonance (Rs) calculated: ${auraData.resonance_rs}`);
    } else {
        throw new Error('❌ [Trackable]: Resonance calculation failed!');
    }

    // [Transparent] - Diffusion logic check
    if (auraData.diffusion_phi !== undefined) {
        omniLogger.info('SYSTEM', `✅ [Transparent]: Diffusion Potential (Φ) calculated: ${auraData.diffusion_phi}`);
    } else {
        throw new Error('❌ [Transparent]: Diffusion Potential missing!');
    }

    // [Tangible] - Visual Data Manifestation
    if (auraData.visual_data) {
        omniLogger.info('SYSTEM', '✅ [Tangible]: Visual data generated for Liquid Glass UI.');
    } else {
        throw new Error('❌ [Tangible]: Visual data manifestation failed!');
    }

    omniLogger.info('SYSTEM', '✨ 5T Diffusion Verification SUCCESSFUL! ♾️');
}

verifyDiffusion().catch(err => {
    console.error(`❌ Verification FAILED: ${err.message}`);
    if (err.stack) console.error(err.stack);
    process.exit(1);
});
