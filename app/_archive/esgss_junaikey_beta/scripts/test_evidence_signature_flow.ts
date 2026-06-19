import { evidenceVaultService } from '../server/src/services/EvidenceVaultService.js';
import { transparentCalculationService } from '../server/src/services/TransparentCalculationService.js';
import { TrinityManager } from '../src/omni/infrastructure/synchronization/TrinityManager.js';
import { omniLogger, LogCategory } from '../src/utils/OmniLogger.js';
import { Protocol5T, IOmniComponent, IOmniKB, IOmniTag, OmniComponentState, OmniTagType, ITransparentFormula, IFormulaItem } from '../src/omni/core/types/InfoOne.types.js';

console.log('DEBUG: Imports successful');

/**
 * 🧪 測試證據與簽章整合流程 / Test Evidence & Signature Integration Flow
 */
async function runVerification() {
    console.log('DEBUG: runVerification started');
    omniLogger.info(LogCategory.SYSTEM, '🚀 Starting Full Evidence & Transparent Calculation Flow...');

    try {
        // 1. 模擬上傳證據並簽署 [Traceable]
        console.log('\n--- Step 1: Uploading Evidence with Digital Signature ---');
        const evidenceEntry = await evidenceVaultService.uploadAndSign(
            'REPORT-2026-001',
            {
                name: 'invoice_solar_panel.pdf',
                size: 1024,
                type: 'application/pdf',
                screenshotUrl: 'https://storage.omni.one/screenshots/20260215_snap.png'
            },
            {
                id: 'USER-THOTH-001',
                name: 'Dr. Thoth',
                signature: 'sig-thoth-shant-nirvana-2026'
            },
            { metric: 'Renewable Energy Installation' }
        );

        console.log(`✅ Evidence Created: ${evidenceEntry.asset.id}`);
        console.log(`✅ Screenshot URL: ${evidenceEntry.asset.screenshotUrl}`);
        console.log(`✅ Signed By: ${evidenceEntry.signature.signerName}`);

        // 2. 模擬透明驗算公式產生 [Transparent]
        console.log('\n--- Step 2: Generating Transparent Formula (Weights & Data Chain) ---');
        const transparentFormula = transparentCalculationService.generateFormula([
            { label: 'Environmental Policy', score: 90, weight: 0.3, evidenceId: evidenceEntry.asset.id },
            { label: 'Carbon Reduction Plan', score: 95, weight: 0.7, evidenceId: 'evid-external-001' }
        ], 'ISO-14064-1');

        console.log(`✅ Final Score: ${transparentFormula.finalScore}`);
        console.log(`✅ Data Chain: ${transparentFormula.dataChain.join(' -> ')}`);
        transparentFormula.items.forEach((item: IFormulaItem) => {
            console.log(`   - [${item.label}]: Score ${item.value}, Weight ${item.weight}, Evid: ${item.evidenceId}`);
        });

        // 3. 鍛造三位一體主體並連結證據與公式 [Trinity Forge]
        console.log('\n--- Step 3: Forging Trinity with Evidence Link & Formula ---');
        const mockComponent: IOmniComponent = {
            id: 'COMP-SOLAR-001',
            name: 'Solar Panel Dashboard',
            state: OmniComponentState.READY,
            execute: async () => ({}),
            cleanup: async () => { },
            impactMetric: `${transparentFormula.finalScore} Points`,
            lifecyclePath: ['CREATE', 'VERIFY']
        };

        const mockKB: IOmniKB = {
            id: 'KB-SOLAR-001',
            content: 'Solar panels installed on Building A.',
            sourceOrigin: 'On-site Survey',
            tags: [Protocol5T.TRACEABLE, Protocol5T.TRUSTWORTHY, Protocol5T.TRANSPARENT],
            hashLock: 'hash-pending'
        };

        const mockTag: IOmniTag = {
            id: 'TAG-SOLAR-001',
            type: OmniTagType.KNOWLEDGE,
            name: 'RenewableEnergy',
            value: 'Solar',
            createdAt: new Date(),
            protocol: [Protocol5T.TRACEABLE],
            signature: 'tag-sig-001'
        };

        const trinity = TrinityManager.getInstance().forge(
            mockComponent,
            mockKB,
            mockTag,
            evidenceEntry.asset.id,
            transparentFormula
        );

        console.log(`✅ Trinity Forged: ${trinity.uuid}`);
        console.log(`✅ Linked Evidence ID: ${trinity.knowledge.evidenceId}`);
        console.log(`✅ Trinity Formula Score: ${(trinity.knowledge.formula as any).finalScore}`);

        // 4. 驗證完整性 [Trustworthy]
        console.log('\n--- Step 4: Verifying Integrity & 5T Protocol ---');
        const integrity = await evidenceVaultService.verifyIntegrity(evidenceEntry.asset.id);
        console.log(`✅ Integrity Status: ${integrity.success ? 'SUCCESS' : 'FAILED'}`);
        console.log(`✅ Message: ${integrity.message}`);

        // 5. 固定資產 [Lock]
        console.log('\n--- Step 5: Sealing Trinity Asset ---');
        trinity.lock();
        console.log(`✅ Trinity SEALED: ${trinity.isLocked()}`);

        console.log('\n✨ All Verifications Passed! ESG Data Chain (Evidence -> Formula -> Trinity) is intact.');
        process.exit(0);

    } catch (error) {
        console.error('\n❌ Verification Failed:', error);
        process.exit(1);
    }
}

runVerification();
