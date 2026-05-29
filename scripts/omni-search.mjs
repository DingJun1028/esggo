import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * OmniSearch: 萬能搜尋工具 (Universal Cross-Platform Search)
 * 用於取代 grep，確保在 Windows, Linux 與 CI/CD 環境中行為一致。
 */

const args = process.argv.slice(2);
const patternString = args[0];
const searchPaths = args.slice(1);

if (!patternString || searchPaths.length === 0) {
  console.log('Usage: node scripts/omni-search.mjs <regex> <path1> <path2> ...');
  process.exit(0);
}

const pattern = new RegExp(patternString, 'u');

function walk(dir, callback) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stats = fs.statSync(fullPath);
    if (stats.isDirectory()) {
      if (file !== 'node_modules' && file !== '.next' && file !== '.git') {
        walk(fullPath, callback);
      }
    } else {
      callback(fullPath);
    }
  }
}

let foundCount = 0;

for (const startPath of searchPaths) {
  if (!fs.existsSync(startPath)) continue;
  
  const stats = fs.statSync(startPath);
  const targetFiles = [];
  
  if (stats.isDirectory()) {
    walk(startPath, (p) => targetFiles.push(p));
  } else {
    targetFiles.push(startPath);
  }

  for (const file of targetFiles) {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');
    lines.forEach((line, index) => {
      if (pattern.test(line)) {
        console.log(`${file}:${index + 1}: ${line.trim()}`);
        foundCount++;
      }
    });
  }
}

if (foundCount === 0) {
  process.exit(1); // 符合 grep 行為：未找到則返回非零狀態
}
