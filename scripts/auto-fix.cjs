const fs = require('fs');
const { execSync } = require('child_process');

try {
  // Run tsc to get the list of errors
  const tscOutput = execSync('npx tsc --noEmit', { encoding: 'utf8', stdio: 'pipe' });
} catch (e) {
  const output = e.stdout || '';
  
  // Parse TS2304 errors to find missing imports
  const lines = output.split('\n');
  const missingImports = {}; // file -> Set of missing names
  
  lines.forEach(line => {
    const match = line.match(/^app\/([^:]+)\(\d+,\d+\): error TS2304: Cannot find name '([^']+)'.$/);
    if (match) {
      const file = 'app/' + match[1];
      const name = match[2];
      if (!missingImports[file]) missingImports[file] = new Set();
      missingImports[file].add(name);
    }
    
    // Also catch TS7053 for statusConfig
    const match7053 = line.match(/^(app\/[^:]+)\(\d+,\d+\): error TS7053:.*statusConfig/);
    if (match7053) {
      const file = match7053[1];
      let content = fs.readFileSync(file, 'utf8');
      if (content.includes('const config = statusConfig[phase.status];')) {
        content = content.replace('const config = statusConfig[phase.status];', 'const config = statusConfig[phase.status as keyof typeof statusConfig];');
      } else if (content.includes('const config = statusConfig[step.status];')) {
        content = content.replace('const config = statusConfig[step.status];', 'const config = statusConfig[step.status as keyof typeof statusConfig];');
      }
      fs.writeFileSync(file, content);
    }
  });
  
  for (const [file, names] of Object.entries(missingImports)) {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;
    
    if (names.has('OmniButton') && !content.includes('import { OmniButton }') && !content.includes('import {OmniButton}')) {
       content = "import { OmniButton } from '@/components/ui/omni/OmniButton';\n" + content;
       names.delete('OmniButton');
       changed = true;
    }
    
    if (names.size > 0) {
      if (content.includes('from \'lucide-react\'')) {
        content = content.replace(/import\s+\{([^}]+)\}\s+from\s+'lucide-react';?/, (m, p1) => {
          const toAdd = Array.from(names).filter(i => !p1.includes(i));
          if (toAdd.length > 0) {
             return `import { ${p1.trim()}, ${toAdd.join(', ')} } from 'lucide-react';`;
          }
          return m;
        });
        changed = true;
      } else {
        content = `import { ${Array.from(names).join(', ')} } from 'lucide-react';\n` + content;
        changed = true;
      }
    }
    
    if (changed) {
      fs.writeFileSync(file, content);
    }
  }
  console.log('Auto-fix applied for TS2304 and TS7053');
}
