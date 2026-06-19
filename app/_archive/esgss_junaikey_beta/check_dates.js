const fs = require('fs');
const path = require('path');

const searchDates = () => {
  const projectDir = 'c:/Project/esgss_junaikey_beta';
  const datePattern = /202[4-6]-\d{2}-\d{2}/g;
  
  const excludedDirs = ['.git', 'node_modules', '.vscode', 'dist', 'build'];
  
  const filesToCheck = [];
  
  const traverseDir = (dir) => {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);
      
      if (stats.isDirectory()) {
        if (!excludedDirs.includes(path.basename(filePath))) {
          traverseDir(filePath);
        }
      } else {
        if (file.endsWith('.md') || file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js')) {
          filesToCheck.push(filePath);
        }
      }
    });
  };
  
  traverseDir(projectDir);
  
  console.log('搜索包含日期的文件...');
  const filesWithDates = [];
  
  filesToCheck.forEach(filePath => {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const matches = content.match(datePattern);
      
      if (matches) {
        filesWithDates.push({
          file: filePath,
          dates: matches
        });
      }
    } catch (error) {
      console.error(`無法讀取文件: ${filePath}`, error);
    }
  });
  
  console.log(`找到 ${filesWithDates.length} 個包含日期的文件:`);
  filesWithDates.forEach(item => {
    console.log(`\n${item.file}:`);
    console.log(item.dates.join('\n'));
  });
};

searchDates();