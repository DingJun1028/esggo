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
    } else if (file.endsWith('.tsx')) {
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
  
  if (content.includes('<OmniButton') && !content.includes('import { OmniButton }') && !content.includes('import {OmniButton}')) {
    const importStatement = "\nimport { OmniButton } from '@/components/ui/omni/OmniButton';";
    
    // Insert after the last import
    const lastImportIndex = content.lastIndexOf('import ');
    if (lastImportIndex !== -1) {
      const endOfLastImport = content.indexOf('\n', lastImportIndex);
      content = content.slice(0, endOfLastImport) + importStatement + content.slice(endOfLastImport);
    } else {
      content = importStatement + "\n" + content;
    }
    changed = true;
  }
  
  // Find missing Lucide icons
  const iconRegex = /<([A-Z][a-zA-Z0-9]+)\s+className=/g;
  let match;
  const usedIcons = new Set();
  while ((match = iconRegex.exec(content)) !== null) {
    // Only consider typical lucide icons (we can guess if it's not imported)
    usedIcons.add(match[1]);
  }
  
  // Simple check for some common ones missing in errors
  const commonIcons = ['Plus', 'Layers', 'GitBranch', 'ArrowRight', 'CheckCircle2', 'Play'];
  const missingIcons = commonIcons.filter(icon => content.includes(`<${icon}`) && !content.includes(icon) && !new RegExp(`import.*\\b${icon}\\b`).test(content));
  
  if (missingIcons.length > 0) {
     if (content.includes('from \'lucide-react\'')) {
        content = content.replace(/import\s+\{([^}]+)\}\s+from\s+'lucide-react';?/, (m, p1) => {
          const toAdd = missingIcons.filter(i => !p1.includes(i));
          if (toAdd.length > 0) {
             return `import { ${p1.trim()}, ${toAdd.join(', ')} } from 'lucide-react';`;
          }
          return m;
        });
        changed = true;
     }
  }

  if (changed) {
    fs.writeFileSync(file, content);
    fixedFiles++;
  }
});

console.log('Fixed imports in ' + fixedFiles + ' files');
