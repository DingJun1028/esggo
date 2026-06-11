import { executeTask } from './orchestrator';
import { addTask, getLatestArtifactByTask } from './store';

async function testIntegration() {
  console.log('🧪 Starting Carbon Engine Integration Test...');

  const taskId = 'test-carbon-task-' + Date.now();
  
  // 1. Add a dummy task
  addTask({
    id: taskId,
    actorId: 'test-user',
    taskType: 'carbon_calculation',
    title: '核算 500 度的電力排放',
    prompt: '請幫我計算 500 度的電力排放量，對標 2023 係數',
    status: 'queued'
  });

  console.log('✅ Task added to store.');

  // 2. Execute the task
  console.log('🚀 Executing task...');
  const result = await executeTask(taskId);

  console.log('✅ Task execution finished.');
  console.log('📊 Provider:', result.execution.modelProvider);
  console.log('📊 Artifact Content Snippet:');
  console.log(result.artifact?.content.substring(0, 300) + '...');

  // 3. Validation
  if (result.artifact?.content.includes('247.5000 kgCO2e')) {
    console.log('🎉 SUCCESS: Calculation is accurate (500 * 0.495 = 247.5)');
  } else {
    console.error('❌ FAILURE: Calculation mismatch or content missing');
    process.exit(1);
  }
}

testIntegration().catch(err => {
  console.error('❌ Test failed with error:', err);
  process.exit(1);
});
