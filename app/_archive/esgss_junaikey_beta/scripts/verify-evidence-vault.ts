import { DocumentProcessingService } from '../src/services/integration/DocumentProcessingService';
import { EvidenceVault } from '../src/services/EvidenceVault';
import { ImmutableLock } from '../src/utils/ImmutableLock';
import assert from 'assert';

async function runVerification() {
  console.log('--- Running Evidence Vault Verification Script ---');

  // 1. Initialize services
  const docProcessor = new DocumentProcessingService({ provider: 'local' });
  console.log('✅ DocumentProcessingService initialized');

  // Ensure vault is clean before test
  EvidenceVault.destroy();
  console.log('🧹 EvidenceVault cleared for test run.');

  // 2. Simulate file upload and processing
  const mockFile = new File(
    ['This is the content of the 2026 Carbon Emissions Report.'],
    '2026年碳排放報告.pdf',
    { type: 'application/pdf' }
  );
  console.log(`📄 Simulating upload of: ${mockFile.name}`);

  const processedDoc = await docProcessor.processDocument(mockFile);
  console.log('✅ Document processed.');

  // 3. Verify deposit in EvidenceVault
  const allEvidence = EvidenceVault.getAllEvidence();
  assert.strictEqual(allEvidence.length, 1, 'Test Failed: Evidence should have been deposited.');
  const evidence = allEvidence[0];
  console.log('✅ Evidence found in vault.');

  // 4. Verify hash consistency
  const expectedHash = await ImmutableLock.generateHash(processedDoc.markdown || '');
  assert.strictEqual(
    evidence.fileHash,
    expectedHash,
    'Test Failed: Hash of deposited evidence is inconsistent.'
  );
  console.log('✅ Hash consistency verified.');
  assert.strictEqual(
    evidence.originalFileName,
    mockFile.name,
    'Test Failed: Original filename mismatch.'
  );
  console.log('✅ Metadata (filename) verified.');

  // 5. Check deduplication
  console.log(`🔄 Simulating re-upload of the same document to check deduplication...`);
  const processedDocAgain = await docProcessor.processDocument(mockFile);

  const allEvidenceAfterRedeposit = EvidenceVault.getAllEvidence();
  assert.strictEqual(
    allEvidenceAfterRedeposit.length,
    1,
    'Test Failed: Deduplication failed. A new record was created for the same file.'
  );

  const evidenceAfterRedeposit = allEvidenceAfterRedeposit[0];
  assert.strictEqual(
    evidenceAfterRedeposit.id,
    evidence.id,
    'Test Failed: Deduplication returned a different evidence object.'
  );
  console.log('✅ Deduplication check passed. Vault size is still 1.');

  console.log('\n--- Evidence Vault Verification Successful! ---');
  console.dir(evidence, { depth: null });
}

runVerification().catch(error => {
  console.error('\n--- 🚨 Verification Failed! ---');
  console.error(error);
  process.exit(1);
});
