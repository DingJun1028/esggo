const fs = require('fs');
const files = [
  'lib/agents/adk-swarm.ts',
  'lib/agents/adk-tools.ts',
  'lib/agents/omni-agent-bus.ts',
  'lib/agents/omni-commander.ts',
  'lib/agents/sustain-scribe.ts',
  'lib/memory.ts',
  'lib/memory/memory-store.ts',
  'lib/negotiation/engine.ts',
  'lib/omni-core/architecture.ts',
  'lib/omni-core/awakening.ts',
  'lib/omni-core/healer.ts',
  'lib/omni-core/impulsor.ts',
  'lib/omni-core/integrity.ts',
  'lib/services/omni-table-blue-bridge.ts'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/\.ts(['"])/g, '$1');
  fs.writeFileSync(file, content);
  console.log('Fixed ' + file);
});
