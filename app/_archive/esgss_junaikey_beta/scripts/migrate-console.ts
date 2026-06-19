/**
 * 🛠️ 奧秘遷移腳本：Console to OmniLogger
 * --------------------------------------------------
 * [目標] 掃描指定目錄，將 console.log/warn/error 替換為 omniLogger 調用
 * [安全] 僅對 src/services 目錄進行 dry-run 或實際執行
 */

import * as fs from 'fs';
import * as path from 'path';

const TARGET_DIR = 'src/services';
const DRY_RUN = false; // Set to false to actually modify files

function getAllFiles(dirPath: string, arrayOfFiles: string[] = []) {
  if (!fs.existsSync(dirPath)) return arrayOfFiles;

  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, arrayOfFiles);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

function migrateFile(filePath: string) {
  const content = fs.readFileSync(filePath, 'utf-8');
  let newContent = content;
  let modified = false;

  // Regex to match console.log/warn/error calls
  const patterns = [
    { regex: /console\.log\(([\s\S]*?)\);?/g, level: 'info' },
    { regex: /console\.warn\(([\s\S]*?)\);?/g, level: 'warn' },
    { regex: /console\.error\(([\s\S]*?)\);?/g, level: 'error' },
  ];

  patterns.forEach(({ regex, level }) => {
    if (regex.test(newContent)) {
      // Check if omniLogger is imported
      if (!newContent.includes('omniLogger')) {
        const omniLoggerPath = 'src/omni/infrastructure/logging/OmniLogger';
        // Simple relative path logic
        // For files in src/services/*, it is ../omni...
        // But for subdirs, it is ../../
        // Let's use a standard import relative to src alias if possible, but standard relative is safer.

        // We will try to calculate relative path.
        // Assuming CWD is project root.
        const fileDir = path.dirname(filePath);
        let relativePath = path.relative(fileDir, omniLoggerPath).replace(/\\/g, '/');
        if (!relativePath.startsWith('.')) {
          relativePath = './' + relativePath;
        }

        const importStmt = `import { omniLogger, LogCategory } from '${relativePath}';\n`;
        if (!newContent.startsWith(importStmt)) {
          newContent = importStmt + newContent;
        }
      }

      newContent = newContent.replace(regex, (match, args) => {
        modified = true;
        const source = path.basename(filePath, path.extname(filePath));

        let cleanArgs = args.trim();

        // Simple quoted string heuristic
        if (
          (cleanArgs.startsWith("'") && cleanArgs.endsWith("'")) ||
          (cleanArgs.startsWith('"') && cleanArgs.endsWith('"')) ||
          (cleanArgs.startsWith('`') && cleanArgs.endsWith('`'))
        ) {
          if (!cleanArgs.includes(',') && !cleanArgs.includes('\n')) {
            return `omniLogger.${level}(LogCategory.SYSTEM, ${cleanArgs}, { source_origin: '${source}' })`;
          }
        }

        // Default fallback: Message + Details
        // We wrap args in an object or array to avoid syntax errors if there are multiple args
        return `omniLogger.${level}(LogCategory.SYSTEM, 'Log from ${source}', { data: [${cleanArgs}], source_origin: '${source}' })`;
      });
    }
  });

  if (modified) {
    if (DRY_RUN) {
      console.log(`[DryRun] Would modify: ${filePath}`);
    } else {
      console.log(`[Migrate] Modifying: ${filePath}`);
      fs.writeFileSync(filePath, newContent, 'utf-8');
    }
  }
}

// Execution
try {
  const files = getAllFiles(TARGET_DIR);
  console.log(`Found ${files.length} files to scan in ${TARGET_DIR}`);
  files.forEach(migrateFile);
  console.log('Migration completed.');
} catch (error) {
  console.error('Migration failed:', error);
}
