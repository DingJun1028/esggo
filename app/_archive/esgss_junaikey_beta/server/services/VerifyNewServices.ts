import { AgentCore } from './AgentCore.js';
import { AuditSelfHealingService } from './AuditSelfHealingService.js';
import { OmniHeartbeat } from './OmniHeartbeat.js';

async function verify() {
  console.log('=== Verifying New Services ===\n');

  // 1. Verify AgentCore
  console.log('--- 1. Testing AgentCore (AI Game Loop) ---');
  const core = new AgentCore({ maxIterations: 2 });
  const result = await core.generateWithAudit({ topic: 'ESG Reporting' });
  console.log('AgentCore Result:', JSON.stringify(result, null, 2));
  if (result.metadata) console.log('??AgentCore PASS');
  else console.error('??AgentCore FAIL');

  // 2. Verify AuditSelfHealing
  console.log('\n--- 2. Testing AuditSelfHealing ---');
  const healer = new AuditSelfHealingService();
  const badText = 'This is some good stuff about carbon.';
  const fixedText = await healer.detectAndFix(badText, ['Vague terminology']);
  console.log(`Original: "${badText}"`);
  console.log(`Fixed:    "${fixedText}"`);
  if (fixedText.includes('positive impact')) console.log('??SelfHealing PASS');
  else console.error('??SelfHealing FAIL');

  // 3. Verify Heartbeat
  console.log('\n--- 3. Testing OmniHeartbeat ---');
  const heartbeat = new OmniHeartbeat();
  const health = await heartbeat.checkIntegrity();
  console.log('Heartbeat Health:', JSON.stringify(health, null, 2));
  if (health.healthy) console.log('??Heartbeat PASS');
  else console.error('??Heartbeat FAIL');

  console.log('\n=== Verification Complete ===');
}

verify().catch(console.error);
