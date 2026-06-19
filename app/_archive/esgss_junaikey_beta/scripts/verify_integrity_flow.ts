
import { EvidenceVaultService } from '../server/services/EvidenceVaultService.js';
import { IntegrityPassportService } from '../server/services/IntegrityPassportService.js';
import omniLogger from '../server/utils/omniLogger.js';

async function verifyIntegrityFlow() {
    console.log('💎 Starting Integrity Passport Verification Flow...');

    const userId = 'verify-user-' + Date.now();
    const evidenceId = 'ev-' + Date.now();

    // 1. Upload Evidence (Mock)
    console.log('\n[Step 1] Uploading Evidence...');
    const mockFile = Buffer.from('This is a verifiable audit report.');
    EvidenceVaultService.storeEvidence(evidenceId, mockFile, {
        fileName: 'audit_report_2026.pdf',
        fileType: 'pdf',
        fileSizeBytes: 1024,
        category: 'governance', // Should map to GOVERNANCE domain
        subType: 'External Audit',
        tags: ['audit', '2026']
    });
    console.log('✅ Evidence stored:', evidenceId);

    // 2. Lock Evidence (Required for Crystallization)
    console.log('\n[Step 2] Locking Evidence...');
    const fileHash = EvidenceVaultService.calculateFileHash(mockFile);
    // Mock metadata hash calculation for test simplicity or use service method if accessible
    const metadataHash = 'mock-meta-hash';

    const lockResult = EvidenceVaultService.performHashLock(evidenceId, fileHash, metadataHash);
    console.log('✅ Evidence locked:', lockResult.isLocked, lockResult.lockProof);

    // 3. Crystallize Evidence (The Core Phase 114 Feature)
    console.log('\n[Step 3] Crystallizing Evidence...');
    try {
        const passport = IntegrityPassportService.sealEvidenceAsCrystal(userId, evidenceId);
        console.log('✅ Passport Updated:', passport.score);
        console.log('   Rank:', passport.rank);
        console.log('   Pillars:', JSON.stringify(passport.pillars));

        const sealed = passport.sealedCrystals.find(c => c.crystalUuid);
        if (sealed) {
            console.log('   Sealed Crystal:', sealed.crystalUuid.slice(0, 8));
            console.log('   Domain:', sealed.domain);
        } else {
            console.error('❌ No sealed crystal found in passport!');
            process.exit(1);
        }

    } catch (error: any) {
        console.error('❌ Crystallization Failed:', error.message);
        process.exit(1);
    }

    // 4. Verify Score Impact
    console.log('\n[Step 4] Verifying Score Impact...');
    const updatedPassport = IntegrityPassportService.getPassport(userId);
    if (updatedPassport.score > 0) {
        console.log('✅ Score is positive:', updatedPassport.score);
    } else {
        console.error('❌ Score should be positive after sealing evidence.');
        process.exit(1);
    }

    console.log('\n💎 Verification Complete: Integrity Passport Flow is ACTIVE.');
}

verifyIntegrityFlow().catch(console.error);
