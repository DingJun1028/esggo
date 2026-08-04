import { arvoAgent } from './lib/services/arvoAgent';
import { HolyLinter } from './lib/core/omni-linter';

// ============================================================================
// [O-Ring 聖典協議] Omni Workflow Demo - v3.1.0-Omni
// ============================================================================

async function runDemo() {
  const query = "Analyze the carbon footprint of our Tier 1 suppliers and provide a GRI-compliant reduction strategy.";

  console.log('🚀 Starting Omnipotent Workflow Demo...');
  
  // 1. Holy Linter Seal (5T Protection Check)
  const task = { query, timestamp: Date.now() };
  const sealedTask = HolyLinter.seal(task, 'WorkflowDemo');
  console.log('✅ Task Sealed with 5T Protocol. Hash:', sealedTask._omniHeart?.trustful);

  // 2. ARVO AI Execution
  console.log('🧠 Triggering ARVO AI Agent...');
  const result = await arvoAgent.process(sealedTask.query);

  console.log('\n--- ARVO RESULT ---');
  console.log(result);
  console.log('-------------------');
  
  console.log('\n✨ Workflow Complete.');
}

runDemo().catch(console.error);
