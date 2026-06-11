import { executeSwarmTask } from './orchestrator';
import { addTask } from './store';

async function testGRIIntegration() {
  console.log('🧪 Starting GRI Generator Integration Test...');

  const taskId = 'test-gri-task-' + Date.now();
  
  // 1. Add a report drafting task
  addTask({
    id: taskId,
    actorId: 'test-user',
    taskType: 'report_drafting',
    title: '生成 2024 範疇二排放章節',
    prompt: '請根據最新的電力數據，生成 GRI 305-2 揭露章節草稿',
    status: 'queued'
  });

  console.log('✅ Task added to store.');

  // 2. Execute the task
  console.log('🚀 Executing task...');
  const result = await executeSwarmTask(taskId);

  console.log('✅ Task execution finished.');
  console.log('📊 Provider:', result.execution.modelProvider);
  console.log('📊 Final Content:');
  console.log(result.artifact?.content);

  // 3. Validation
  if (result.artifact?.content.includes('GRI 305-2') && result.artifact?.content.includes('594.0000 kgCO2e')) {
    console.log('🎉 SUCCESS: GRI draft generated with accurate metrics (1200 * 0.495 = 594)');
  } else {
    console.error('❌ FAILURE: GRI draft mismatch');
    process.exit(1);
  }
}

testGRIIntegration().catch(err => {
  console.error('❌ Test failed with error:', err);
  process.exit(1);
});
