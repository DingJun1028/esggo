import { reportGenerator } from '@/omni/services/OmniReportGenerator';
import { truthEngine } from '@/omni/services/OmniTruthEngine';
import { omniLogger } from '@/omni/infrastructure/logging/OmniLogger';

async function verifyReport() {
  console.log('🚀 Verifying Report Generation Logic...');

  // 1. Seed some dummy data if needed, or rely on existing state.
  // In a fresh run, truthEngine is empty. We should inject a claim.
  console.log('🌱 Seeding Truth Engine...');
  const claim = await truthEngine.registerClaimWithEvidence(
    'The system is verified capable of generating ESG reports.',
    [] // No real evidence IDs, but it registers a truth verified claim
  );

  // 2. Generate JSON Report
  console.log('\n📄 Generating JSON Report...');
  const jsonReport = await reportGenerator.generateReport('json');
  console.log('JSON Output (Summary):', JSON.stringify(JSON.parse(jsonReport).summary, null, 2));

  // 3. Generate Text Report
  console.log('\n📄 Generating Text Report...');
  const textReport = await reportGenerator.generateReport('text');
  console.log('Text Output (First 3 lines):', textReport.split('\n').slice(0, 3).join('\n'));

  console.log('\n✅ Verification Complete');
}

verifyReport().catch(err => {
  console.error('❌ Verification Failed:', err);
  process.exit(1);
});
