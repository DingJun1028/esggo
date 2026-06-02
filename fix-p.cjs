const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('{p.id}') && content.includes('{p.title}')) {
    const dirName = path.basename(path.dirname(filePath));
    const title = dirName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    
    // Check if p is already defined
    if (!content.includes('const p = {') && !content.includes('const p =') && !content.includes('let p =')) {
      const pDefinition = `
  const p = {
    id: \`ESG-\${dirName.substring(0,3).toUpperCase()}\`,
    title: '${title}',
    sub: '${title} Management'
  };
`;
      // Find where to insert it, inside the component, before return (
      // let's look for "return ("
      const returnIndex = content.lastIndexOf('return (');
      if (returnIndex !== -1) {
        content = content.slice(0, returnIndex) + pDefinition + '\n  ' + content.slice(returnIndex);
        fs.writeFileSync(filePath, content);
        console.log('Fixed', filePath);
      }
    }
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('page.tsx')) {
      processFile(fullPath);
    }
  }
}

walkDir('./app');
