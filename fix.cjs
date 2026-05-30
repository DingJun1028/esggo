const fs = require('fs');
let content = fs.readFileSync('lib/agents/omni-commander.ts', 'utf8');
content = content.replace(/\\`/g, '`').replace(/\\\$\{/g, '${');
fs.writeFileSync('lib/agents/omni-commander.ts', content, 'utf8');
