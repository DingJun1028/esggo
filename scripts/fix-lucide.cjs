const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('./app');
let fixedFiles = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  
  // Replace the exact type definition
  const regex1 = /React\.ComponentType<\s*\{\s*size\?:\s*number;?\s*className\?:\s*string;?\s*\}\s*>/g;
  const regex2 = /React\.ComponentType<\s*\{\s*size\?:\s*number\s*\|\s*string;?\s*className\?:\s*string;?\s*\}\s*>/g;
  
  if (regex1.test(content) || regex2.test(content)) {
    content = content.replace(regex1, 'LucideIcon');
    content = content.replace(regex2, 'LucideIcon');
    changed = true;
  }
  
  if (changed) {
    // Add import if missing
    if (!content.includes('import { LucideIcon }') && !content.includes('import type { LucideIcon }') && !content.includes('import { LucideIcon,')) {
      if (content.includes('from \'lucide-react\'')) {
        content = content.replace(/import\s+\{([^}]+)\}\s+from\s+'lucide-react';?/, (match, p1) => {
          if (!p1.includes('LucideIcon')) {
            return `import { LucideIcon, ${p1.trim()} } from 'lucide-react';`;
          }
          return match;
        });
      } else {
        content = content.replace(/import React[^;]+;/, match => match + "\nimport type { LucideIcon } from 'lucide-react';");
      }
    }
    fs.writeFileSync(file, content);
    fixedFiles++;
  }
});

console.log('Fixed ' + fixedFiles + ' files');
