import omniAgentService from '../server/services/omniAgentService.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * 💡 Omni Agent Integration Verification Script
 * Validates the "5T Protocol" logic directly against the service.
 */

async function verifyOmniAgent() {
  console.log('🌌 Starting Omni Agent Logic Verification (Thousand-Face Incarnation)...\n');

  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`✅ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${message}`);
    }
  }

  // 1. Traceable Check (Step Log)
  console.log('🔍 Verifying Traceability (Step Log)...');
  const stepPayload = {
    agent_role: 'Chief Architect',
    thought: 'Analyzing server structure for MECE compliance.',
    tools_used: 'list_dir',
    source_origin: 'System Architecture v6.0',
    session_id: uuidv4(),
  };

  try {
    const stepResult = await omniAgentService.logStep(stepPayload);
    assert(stepResult.status === 'logged', 'Step logged successfully');
    assert(!!stepResult.stepId, 'Step ID generated');
    assert(!!stepResult.timestamp, 'Timestamp generated');
  } catch (e: unknown) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    assert(false, `Step log failed: ${(e as any).message}`);
  }

  // 2. Calculable Check (Task Finish)
  console.log('\n🧮 Verifying Calculability (Task Finish)...');
  const taskPayload = {
    task_name: 'Calculate Carbon Footprint',
    output: '150kg CO2e',
    calculation_formula: 'Activity Data * Emission Factor',
    expected_output: 'Carbon Report',
  };

  try {
    const taskResult = await omniAgentService.finishTask(taskPayload);
    assert(taskResult.status === 'verified', 'Task verified successfully');
    assert(taskResult.calculable === true, 'Calculable flag is TRUE when formula provided');
  } catch (e: unknown) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    assert(false, `Task finish failed: ${(e as any).message}`);
  }

  // 2b. Calculable Check (Failure Case)
  console.log('   -> Testing missing formula warning...');
  const weakTaskPayload = {
    task_name: 'Calculate Risk (Weak)',
    output: 'High Risk',
    // Missing formula
  };
  const weakResult = await omniAgentService.finishTask(weakTaskPayload);
  assert(weakResult.calculable === false, 'Calculable flag is FALSE when formula missing');

  // 3. Immutable Check (Project Lock)
  console.log('\n🔒 Verifying Immutability (Project Lock)...');
  const projectPayload = {
    project_name: 'ESGss Core Refactor',
    artifacts: ['server.js', 'omniAgentConfig.md'],
    final_summary: 'Complete system overhaul.',
  };

  try {
    const lockResult = await omniAgentService.lockProject(projectPayload);
    assert(lockResult.status === 'locked', 'Project locked successfully');
    assert(!!lockResult.hash_lock, 'Hash Lock generated');
    assert(lockResult.hash_lock.length === 64, 'Hash Lock is valid SHA-256 (64 chars)');
    console.log(`   🔑 Generated Hash: ${lockResult.hash_lock.substring(0, 12)}...`);
  } catch (e: unknown) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    assert(false, `Project lock failed: ${(e as any).message}`);
  }

  console.log('\n---------------------------------------------------');
  console.log(`📊 Result: ${passed}/${total} Checks Passed`);

  if (passed === total) {
    console.log('🟢 5T Protocol Logic Verified: Traceable, Calculable, Immutable.');
    process.exit(0);
  } else {
    console.error('🔴 Verification Failed.');
    process.exit(1);
  }
}

verifyOmniAgent();
