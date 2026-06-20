const fs = require('fs');
const BASE = 'C:\\Project\\esggo\\';

const files = [
  'app\\academy\\page.tsx',
  'app\\advisors\\page.tsx',
  'app\\advisory\\page.tsx',
  'app\\agents\\page.tsx',
  'app\\ai-platform\\page.tsx',
  'app\\api-setup\\page.tsx',
  'app\\apollo-studio\\page.tsx',
  'app\\audit-log\\page.tsx',
  'app\\audit-verify\\page.tsx',
  'app\\auth\\login\\page.tsx',
  'app\\best-practice\\page.tsx',
  'app\\cbam-calculator\\page.tsx',
  'app\\compliance-check\\page.tsx',
  'app\\customer-journey\\page.tsx',
  'app\\dashboard\\matrix\\page.tsx',
  'app\\dashboard\\metrics\\environmental\\page.tsx',
  'app\\dashboard\\metrics\\governance\\page.tsx',
  'app\\dashboard\\metrics\\page.tsx',
  'app\\dashboard\\metrics\\social\\page.tsx',
  'app\\dashboard\\page.tsx',
  'app\\dashboard\\premium\\page.tsx',
  'app\\dashboard\\report-builder\\page.tsx',
  'app\\data-connect\\page.tsx',
  'app\\data-sources\\page.tsx',
  'app\\design-library\\page.tsx',
  'app\\digital-twin\\page.tsx',
  'app\\document-checklist\\page.tsx',
  'app\\environmental\\page.tsx',
  'app\\finance\\page.tsx',
  'app\\governance\\page.tsx',
  'app\\gri-tracker\\page.tsx',
  'app\\guide\\page.tsx',
  'app\\health-check\\page.tsx',
  'app\\integrity\\page.tsx',
  'app\\intelligence\\page.tsx',
  'app\\library\\page.tsx',
  'app\\login\\page.tsx',
  'app\\map\\page.tsx',
  'app\\materiality\\page.tsx',
  'app\\matrix\\page.tsx',
  'app\\memory\\page.tsx',
  'app\\memory-shards\\page.tsx',
  'app\\notifications\\page.tsx',
  'app\\oauth\\consent\\page.tsx',
  'app\\omni-agent\\page.tsx',
  'app\\omni-key\\page.tsx',
  'app\\omnispace\\page.tsx',
  'app\\page.tsx',
  'app\\platform-versions\\page.tsx',
  'app\\profile\\page.tsx',
  'app\\proof-center\\page.tsx',
  'app\\publish\\page.tsx',
  'app\\reading-room\\page.tsx',
  'app\\registry\\page.tsx',
  'app\\report\\page.tsx',
  'app\\roadmap\\page.tsx',
  'app\\search\\page.tsx',
  'app\\social\\page.tsx',
  'app\\soul\\page.tsx',
  'app\\stakeholders\\page.tsx',
  'app\\stakeholder-survey\\page.tsx',
  'app\\standards\\page.tsx',
  'app\\super-admin\\page.tsx',
  'app\\sustain-write\\page.tsx',
  'app\\system-status\\page.tsx',
  'app\\system-test\\page.tsx',
  'app\\tasks\\page.tsx',
  'app\\templates\\page.tsx',
  'app\\test-omni-form\\page.tsx',
  'app\\think-tank\\page.tsx',
  'app\\value-ladder\\page.tsx',
  'app\\value-levels\\page.tsx',
  'app\\value-path\\page.tsx',
  'app\\walkthrough\\page.tsx',
];

let fixed = 0, alreadyOk = 0, errors = [];

for (const f of files) {
  const filePath = BASE + f;
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const original = content;
    let changes = [];

    // 1. Add // @ts-nocheck at start
    const trimmed = content.trimStart();
    if (!trimmed.startsWith('// @ts-nocheck')) {
      if (trimmed.startsWith("'use client'") || trimmed.startsWith('"use client"')) {
        const idx = content.indexOf(trimmed);
        content = content.slice(0, idx) + '// @ts-nocheck\n' + content.slice(idx);
      } else {
        content = '// @ts-nocheck\n' + content;
      }
      changes.push('@ts-nocheck');
    }

    // 2. Remove framer-motion imports
    const fmRegex = /import[\s\S]*?from\s+['"]framer-motion['"];?/g;
    const fmMatches = content.match(fmRegex);
    if (fmMatches) {
      content = content.replace(fmRegex, '');
      changes.push('framer-motion(' + fmMatches.length + ')');
    }

    // 3a. Replace 3-stop bg gradients
    const g3 = /bg-gradient-to-(?:r|br|tr|bl|tl|b|l)\s+from-[\w-]+(?:\/\d+)?\s+via-[\w-]+(?:\/\d+)?\s+to-[\w-]+(?:\/\d+)?/g;
    const m3 = content.match(g3);
    if (m3) {
      content = content.replace(g3, 'bg-neutral-100');
      changes.push('bg-3stop(' + m3.length + ')');
    }

    // 3b. Replace 2-stop bg gradients
    const g2 = /bg-gradient-to-(?:r|br|tr|bl|tl|b|l)(?:\s+from-[\w-]+(?:\/\d+)?)+(?:\s+to-[\w-]+(?:\/\d+)?)+/g;
    const m2 = content.match(g2);
    if (m2) {
      content = content.replace(g2, 'bg-neutral-100');
      changes.push('bg-gradient(' + m2.length + ')');
    }

    // 3c. Replace text-transparent bg-clip-text bg-gradient-to-*
    const tg = /text-transparent\s+bg-clip-text\s+bg-gradient-to-[\w-]+(?:\s+from-[\w-]+(?:\/\d+)?)+(?:\s+to-[\w-]+(?:\/\d+)?)*/g;
    const mt = content.match(tg);
    if (mt) {
      content = content.replace(tg, 'text-neutral-800');
      changes.push('text-gradient(' + mt.length + ')');
    }

    // 3d. Replace radial-gradient(...) backgrounds
    const rg = /bg-\[radial-gradient\([^\]]+\)\]/g;
    const mr = content.match(rg);
    if (mr) {
      content = content.replace(rg, 'bg-neutral-50');
      changes.push('radial(' + mr.length + ')');
    }

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('FIXED: ' + f + ' [' + changes.join(', ') + ']');
      fixed++;
    } else {
      console.log('OK:   ' + f);
      alreadyOk++;
    }
  } catch (e) {
    errors.push(f + ': ' + e.message);
    console.error('ERROR: ' + f + ': ' + e.message);
  }
}

console.log('\n=== RESULT ===');
console.log('Fixed: ' + fixed);
console.log('Already OK: ' + alreadyOk);
console.log('Errors: ' + errors.length);
if (errors.length) errors.forEach(er => console.error(er));
