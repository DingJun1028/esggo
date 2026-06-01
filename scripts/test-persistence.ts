import { OmniAgentBus } from '../lib/agents/omni-agent-bus';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load .env.local
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

async function testPersistence() {
  console.log('Initializing OmniAgentBus...');
  const bus = OmniAgentBus.getInstance();
  
  console.log('Publishing test event: frn_loss:consensus...');
  bus.publish('frn_loss:consensus', {
    evidenceUuid: 'test-evidence-uuid-1234',
    colorDropId: 'cyan-drop-001',
    timestamp: new Date().toISOString(),
    details: 'Testing automated persistence to Postgres AuditRecord'
  });
  
  // Wait a moment for async operations to complete
  await new Promise(resolve => setTimeout(resolve, 2000));
  console.log('Test completed.');
}

testPersistence().catch(console.error);
