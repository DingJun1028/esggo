import { omniIdentityService } from '../src/services/OmniIdentityService.js';
import { globalIntegrityScanService } from '../src/services/GlobalIntegrityScanService.js';
import { sovereignVaultService } from '../src/services/SovereignVaultService.js';
import { omniLogger, LogCategory } from '../src/omni/infrastructure/logging/OmniLogger.js';

/**
 * 🧪 Phase 28 Verification Script: Sovereign Identity & Integrity
 * -----------------------------------------------------------
 * 此腳本驗證：
 * 1. OmniIdentityService 的 DID 生成與主權簽章。
 * 2. GlobalIntegrityScanService 的分相掃描與證書簽發。
 * 3. 5T 協議在主權認證流程中的貫徹。
 */

async function runVerification() {
    console.log('\n--- 🚀 PHASE 28 SOVEREIGN INTEGRITY VERIFICATION ---');

    try {
        // 1. 驗證主權身份 (Sovereign Identity)
        console.log('\n[1/3] Verifying Identity Genesis...');
        const identity = await omniIdentityService.getMyIdentity();
        console.log(`✅ Identity MINTED: ${identity.did}`);
        console.log(`- Type: ${identity.type}`);
        console.log(`- Level: ${identity.level}`);

        // 2. 驗證主權簽章 (Sovereign Signing)
        console.log('\n[2/3] Verifying Sovereign Signature...');
        const payload = { test: 'Phase 28 DNA', value: 42 };
        const sig = await omniIdentityService.signPayload(payload);
        const isValid = await omniIdentityService.verifySignature(payload, sig);

        if (isValid) {
            console.log('✅ Signature VALIDATED');
            console.log(`- Signer: ${sig.signer_did}`);
            console.log(`- Payloal Hash: ${sig.payload_hash}`);
        } else {
            throw new Error('Signature verification failed');
        }

        // 3. 驗證全域誠信掃描 (Global Integrity Scan)
        console.log('\n[3/3] Executing Full System Audit...');

        // 先錨定一些測試數據
        await sovereignVaultService.anchorData({ module: 'Identity', status: 'VERIFIED' });
        await sovereignVaultService.anchorData({ module: 'Scan', status: 'INITIATED' });

        const certificate = await globalIntegrityScanService.performFullSystemAudit();

        console.log('✅ Global Audit COMPLETED');
        console.log(`- Serial: ${certificate.serial_number}`);
        console.log(`- Resonance Score: ${(certificate.audit_summary.global_resonance_score * 100).toFixed(2)}%`);
        console.log(`- Anchored Crystals: ${certificate.audit_summary.total_crystals_anchored}`);
        console.log(`- Signature Seal: ${certificate.signature_seal.substring(0, 32)}...`);

        if (certificate.audit_summary.integrity_status === 'VALIDATED') {
            console.log('\n🌟 PHASE 28 SOVEREIGN STATUS: NIRVANA ACHIEVED 🌟');
        } else {
            console.log('\n⚠️ PHASE 28 SOVEREIGN STATUS: ANCHORING STABLE');
        }

    } catch (error) {
        console.error('\n❌ Verification failed:', error);
        process.exit(1);
    }
}

runVerification();
