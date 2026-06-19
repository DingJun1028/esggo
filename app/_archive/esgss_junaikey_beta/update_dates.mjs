import fs from 'fs';
import path from 'path';

const updateDates = () => {
  const projectDir = 'c:/Project/esgss_junaikey_beta';
  const targetDate = '2026-02-19';
  
  // 需要檢查的文件類型
  const fileExtensions = ['.md', '.ts', '.tsx', '.js', '.jsx'];
  
  // 排除的目錄
  const excludedDirs = ['.git', 'node_modules', '.vscode', 'dist', 'build', 'Users', 'openclaw'];
  
  // 需要檢查的文件列表
  const filesToCheck = [];
  
  // 遞歸遍歷目錄
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
        if (fileExtensions.some(ext => file.endsWith(ext))) {
          filesToCheck.push(filePath);
        }
      }
    });
  };
  
  traverseDir(projectDir);
  
  console.log(`找到 ${filesToCheck.length} 個需要檢查的文件`);
  
  // 檢查並更新日期
  let updatedFiles = 0;
  
  filesToCheck.forEach(filePath => {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // 查找所有日期模式 (YYYY-MM-DD)
      const datePattern = /202[4-6]-\d{2}-\d{2}/g;
      const matches = content.match(datePattern);
      
      if (matches) {
        // 檢查是否包含需要更新的日期
        const needsUpdate = matches.some(date => {
          // 如果日期不是2026-02-19且是最近的日期，可能需要更新
          return date !== targetDate && date >= '2026-02-01';
        });
        
        if (needsUpdate) {
          console.log(`檢查文件: ${filePath}`);
          console.log(`包含日期: ${matches.join(', ')}`);
          
          // 這裡可以添加更新邏輯
          // 目前只打印需要檢查的文件
          updatedFiles++;
        }
      }
    } catch (error) {
      console.error(`無法讀取文件: ${filePath}`, error);
    }
  });
  
  console.log(`\n需要檢查的文件數量: ${updatedFiles}`);
};

updateDates();