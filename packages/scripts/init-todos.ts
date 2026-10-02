// Initialize OmniTodo with required tasks
import { OmniTodoEngine } from '../src/core/omni-todo';

const engine = new OmniTodoEngine();

const todos = [
  {
    title: 'Verify VPS Agent deployment via relay (cmd_20260706232614_11 result)',
    description: 'Check the result of the queued VPS agent deployment command via the relay service at http://localhost:9999/result to ensure the agent is registered and running.',
    priority: 'urgent' as const,
    category: 'general' as const,
    tags: ['vps', 'deployment', 'relay'],
    dueDate: '2026-07-08T12:00:00Z'
  },
  {
    title: 'Implement explicit OmniSoul awakening function',
    description: 'Create a dedicated function to awaken OmniSoul beyond the initialization flow, allowing manual re-awakening or re-alignment as part of the 萬能覺醒儀式.',
    priority: 'high' as const,
    category: 'esg_compliance' as const,
    tags: ['omni-soul', 'awakening', 'ritual']
  },
  {
    title: 'Implement OmniSeed awakening lifecycle (plant-observe-grow)',
    description: 'Add methods to OmniSeed to handle planting, observing growth, and achieving full awakening, integrating with OmniCore lifecycle.',
    priority: 'high' as const,
    category: 'esg_compliance' as const,
    tags: ['omni-seed', 'lifecycle', 'awakening']
  },
  {
    title: 'Integrate OA-Summon ritual into system startup (summonAndInitialize)',
    description: 'Ensure that on system start, the OA-Summon ritual is automatically invoked before OmniCore initialization to guarantee proper awakening sequence.',
    priority: 'medium' as const,
    category: 'general' as const,
    tags: ['oa-summon', 'startup', 'ritual']
  },
  {
    title: 'Validate 萬能果證 runtime behavior via live health check through relay',
    description: 'Perform a live health check of the VPS agent through the relay to confirm 無作妙德 (self-healing) and 圓通無礙 (unobstructed circulation) are functioning in real-time.',
    priority: 'urgent' as const,
    category: 'esg_report' as const,
    tags: ['fruit-proof', 'health-check', 'relay']
  },
  {
    title: 'Monitor VPS Agent registration and quantum entanglement stability',
    description: 'Continuously monitor the VPS agent registration status and quantum entanglement fidelity with OmniCore, alerting on decoherence.',
    priority: 'medium' as const,
    category: 'general' as const,
    tags: ['monitoring', 'quantum-entanglement', 'vps']
  }
];

for (const todo of todos) {
  const created = engine.createTodo(todo);
  console.log(`Created: ${created.title} | ID: ${created.id.substring(0,8)}... | Status: ${created.status}`);
}

console.log(`\nTotal todos: ${engine.query({}).items.length}`);

// Export markdown
console.log('\n--- MARKDOWN EXPORT ---');
console.log(engine.exportMarkdown());