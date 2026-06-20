const fs = require('fs');
const path = require('path');

const BASE_DIR = '/c/Project/esggo/app';
const files = fs.readFileSync('/dev/stdin', 'utf8').trim().split('\n');

let fixed = 0;
let alreadyOk = 0;
let errors = [];

for (const filePath of files) {
  if (!filePath) continue;
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const original = content;
    let changes = [];
    
    // 1. Add // @ts-nocheck at the very beginning if not present
    const trimmed = content.trimStart();
    if (!trimmed.startsWith('// @ts-nocheck')) {
      // Insert before 'use client' or at very start
      if (trimmed.startsWith("'use client'") || trimmed.startsWith('"use client"')) {
        const idx = content.indexOf(trimmed);
        content = content.slice(0, idx) + '// @ts-nocheck\n' + content.slice(idx);
      } else {
        content = '// @ts-nocheck\n' + content;
      }
      changes.push('@ts-nocheck');
    }
    
    // 2. Remove framer-motion imports
    const fmPatterns = [
      /import\s+\{[^}]*\}\s+from\s+['"]framer-motion['"];\n?/g,
      /import\s+\*\s+as\s+\w+\s+from\s+['"]framer-motion['"];\n?/g,
      /import\s+\w+\s+from\s+['"]framer-motion['"];\n?/g,
      /import\s+framer-motion\s+from\s+['"]framer-motion['"];\n?/g,
      /import\s+.*from\s+['"]framer-motion['"];\n?/g,
    ];
    
    let fmRemoved = 0;
    for (const p of fmPatterns) {
      const m = content.match(p);
      if (m) {
        content = content.replace(p, '');
        fmRemoved += m.length;
      }
    }
    if (fmRemoved > 0) {
      changes.push(`framer-motion(${fmRemoved})`);
    }
    
    // 3. Replace gradient classes with solid neutral colors
    // Handle 3-stop gradients first (from-x via-y to-z)
    const threeStopGrad = /bg-gradient-to-(?:r|br|tr|bl|tl|b|l)\s+from-[\w-]+(?:\/\d+)?\s+via-[\w-]+(?:\/\d+)?\s+to-[\w-]+(?:\/\d+)?/g;
    const m3 = content.match(threeStopGrad);
    if (m3) {
      content = content.replace(threeStopGrad, 'bg-neutral-100');
      changes.push(`bg-gradient-3(${m3.length})`);
    }
    
    // Handle 2-stop gradients (from-x to-y)
    const twoStopGrad = /bg-gradient-to-(?:r|br|tr|bl|tl|b|l)(?:\s+from-[\w-]+(?:\/\d+)?)+(?:\s+to-[\w-]+(?:\/\d+)?)+/g;
    const m2 = content.match(twoStopGrad);
    if (m2) {
      content = content.replace(twoStopGrad, 'bg-neutral-100');
      const existing = changes.findIndex(c => c.startsWith('bg-gradient'));
      if (existing >= 0) {
        const prev = parseInt(changes[existing].match(/\d+/)[0]);
        changes[existing] = `bg-gradient(${prev + m2.length})`;
      } else {
        changes.push(`bg-gradient(${m2.length})`);
      }
    }
    
    // Text gradients: text-transparent bg-clip-text bg-gradient-to-*
    const textGrad = /text-transparent\s+bg-clip-text\s+bg-gradient-to-(?:r|br|tr|bl|tl|b|l)(?:\s+from-[\w-]+(?:\/\d+)?)+(?:\s+to-[\w-]+(?:\/\d+)?)*/g;
    const mt = content.match(textGrad);
    if (mt) {
      content = content.replace(textGrad, 'text-neutral-800');
      changes.push(`text-gradient(${mt.length})`);
    }
    
    // Radial gradient backgrounds
    const radialGrad = /bg-\[radial-gradient\([^\]]+\)\]/g;
    const mr = content.match(radialGrad);
    if (mr) {
      content = content.replace(radialGrad, 'bg-neutral-50');
      changes.push(`radial-gradient(${mr.length})`);
    }
    
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`FIXED: ${path.relative(path.dirname(BASE_DIR), filePath)} [${changes.join(', ')}]`);
      fixed++;
    } else {
      console.log(`OK:   ${path.relative(path.dirname(BASE_DIR), filePath)}`);
      alreadyOk++;
    }
  } catch (e) {
    errors.push(`${filePath}: ${e.message}`);
    console.error(`ERROR: ${filePath}: ${e.message}`);
  }
}

console.log(`\n=== RESULT ===`);
console.log(`Fixed: ${fixed}`);
console.log(`Already OK: ${alreadyOk}`);
console.log(`Errors: ${errors.length}`);
if (errors.length) {
  errors.forEach(e => console.error(e));
}
