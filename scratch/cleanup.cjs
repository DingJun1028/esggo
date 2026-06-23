const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

function processFile(filePath) {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
  let content = fs.readFileSync(filePath, 'utf-8');
  let original = content;

  // Remove dark: prefix classes
  content = content.replace(/dark:[a-zA-Z0-9\[\]\-]+/g, '');
  
  // Remove backdrop-blur-* classes
  content = content.replace(/backdrop-blur-[a-zA-Z0-9\[\]\-]+/g, '');

  // Remove multiple spaces inside class names
  content = content.replace(/className=\"(.*?)\"/g, (match, p1) => {
    return 'className=\"' + p1.replace(/\s+/g, ' ').trim() + '\"';
  });
  content = content.replace(/className=\{\`(.*?)\`/g, (match, p1) => {
    return 'className={`' + p1.replace(/\s+/g, ' ').trim() + '`';
  });

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log('Cleaned:', filePath);
  }
}

walkDir('c:/Project/esggo/app', processFile);
walkDir('c:/Project/esggo/components', processFile);
console.log('Cleanup complete.');
