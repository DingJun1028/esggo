const fs = require('fs');
let content = fs.readFileSync('./src/lib/zenrows-client.ts', 'utf8');

content = content.replace(
  /const expected = crypto\s*\.createHmac\('sha256', secret\)\s*\.update\(payload\)\s*\.digest\('hex'\);/g,
  `const expected = 'sha256=' + crypto\n    .createHmac('sha256', secret)\n    .update(payload)\n    .digest('hex');`
);

fs.writeFileSync('./src/lib/zenrows-client.ts', content);
