import { OmniAcceptanceService } from './server/services/OmniAcceptanceService';

async function main() {
  const acceptance = OmniAcceptanceService.getInstance();
  const result = await acceptance.runFullAcceptance('ESGss-JunAiKey');
  
  console.log('=== OmniAcceptance 9D Verification ===');
  console.log('Overall Score:', result.overallScore);
  console.log('Status:', result.status);
  console.log('Gate:', result.acceptanceGate);
  console.log('');
  console.log('Scores:');
  Object.entries(result.scores).forEach(([key, value]) => {
    if (typeof value === 'object') {
      console.log(`  ${key}:`, JSON.stringify(value, null, 2));
    } else {
      console.log(`  ${key}:`, value);
    }
  });
}

main().catch(console.error);
