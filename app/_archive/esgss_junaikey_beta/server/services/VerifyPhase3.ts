import { TypstService } from './TypstService.js';
import { BerkeleyCertificationService } from './BerkeleyCertificationService.js';

async function verifyPhase3() {
  console.log('=== Verifying Phase 3: Output & Certification ===\n');

  // 1. Test Typst Compilation
  console.log('--- 1. Testing TypstService ---');
  const typst = new TypstService();
  const result = await typst.renderReport({
    title: 'Verification Report',
    summary: 'Testing Typst compilation.',
  });

  if (result instanceof Buffer && result.toString().startsWith('%PDF')) {
    console.log('??Typst PDF Generated (Mock)');
  } else {
    console.error('??Typst Generation Failed');
  }

  // 2. Test Certification Issuance
  console.log('\n--- 2. Testing CertificationService ---');
  const certService = new BerkeleyCertificationService(null); // Mock blockchain
  const user = { id: 'U-TEST', name: 'Test User' };
  const cert = await certService.issueCertificate(user, 'SustainabilityProfessional');

  console.log(`Certificate ID: ${cert.id}`);
  console.log(`Type: ${cert.type}`);
  console.log(`Signature: ${cert.signature}`);

  if (cert.anchored && cert.signature) {
    console.log('??Certificate Issued & Anchored');
  } else {
    console.error('??Certification Failed');
  }

  console.log('\n=== Verification Complete ===');
}

verifyPhase3().catch(console.error);
