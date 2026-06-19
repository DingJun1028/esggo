import { crystalSynthesisService } from '../src/services/CrystalSynthesisService';
import { evidenceVaultService } from '../server/src/services/EvidenceVaultService';
import omniLogger, { LogCategory } from '../server/utils/omniLogger';

async function testPhase21() {
    omniLogger.info(LogCategory.SYSTEM, '🚀 Starting Phase 21 Verification: Crystal Multi-Agent Sealing');

    const userId = 'user-alex-123';
    const crystalContent = `
    ESG Distilled Essence:
    - Transparency Index: 0.95
    - Trust Factor: High
    - Social Impact Score: 88
    - Eco Alignment: 92%
  `;

    try {
        omniLogger.info(LogCategory.BUSINESS, '💎 Synthesizing and Sealing Crystal...');

        // Call the new sealCrystal method
        const result = await crystalSynthesisService.sealCrystal(userId, crystalContent);

        omniLogger.info(LogCategory.BUSINESS, '📦 Sealing Result:', result);

        if (result.success) {
            omniLogger.info(LogCategory.SYSTEM, '✅ SUCCESS: Crystal sealed with multi-agent consensus.');
        } else {
            omniLogger.error(LogCategory.SYSTEM, '❌ FAILURE: Crystal sealing did not reach full consensus.');
            process.exit(1);
        }

        // Secondary verification: Check Evidence Vault directly
        omniLogger.info(LogCategory.SYSTEM, '🔍 Verifying vault entry integrity...');
        const vaultEntry = await evidenceVaultService.getEntry(result.entryId);

        if (!vaultEntry) {
            omniLogger.error(LogCategory.SYSTEM, `❌ FAILURE: Entry ${result.entryId} not found in vault.`);
            process.exit(1);
        }

        omniLogger.info(LogCategory.SYSTEM, `Entry status: ${vaultEntry.status}`);
        omniLogger.info(LogCategory.SYSTEM, `Signatures: ${vaultEntry.signatures.length}`);

        vaultEntry.signatures.forEach(sig => {
            omniLogger.info(LogCategory.SYSTEM, `  - Signed by: ${sig.signerName} (${sig.signerId})`);
        });

        if (vaultEntry.signatures.length >= 4) { // 1 user + 3 AI agents
            omniLogger.info(LogCategory.SYSTEM, '🎊 All 4 expected signatures are present.');
        } else {
            omniLogger.error(LogCategory.SYSTEM, `❌ FAILURE: Expected 4 signatures, but found ${vaultEntry.signatures.length}.`);
            process.exit(1);
        }

        omniLogger.info(LogCategory.SYSTEM, '✨ Phase 21 Verification Passed!');
    } catch (error) {
        omniLogger.error(LogCategory.SYSTEM, '💥 Critical failure during Phase 21 verification:', error);
        process.exit(1);
    }
}

testPhase21();
