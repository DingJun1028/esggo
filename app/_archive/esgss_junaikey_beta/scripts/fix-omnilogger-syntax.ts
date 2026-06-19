#!/usr/bin/env tsx
/**
 * 檢測並修正 omniLogger.error 調用中的語法錯誤
 * 特定模式：{ error }; → { error })
 */

import { readFileSync, writeFileSync } from 'fs';
import { globSync } from 'glob';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

console.log('🔍 Scanning for remaining syntax errors...\n');

const patterns = [
    /omniLogger\.error\([^)]+,\s*\{\s*error\s*\}\s*;/g,  // { error };
    /omniLogger\.warn\([^)]+,\s*\{\s*error\s*\}\s*;/g,   // warn with { error };
    /omniLogger\.info\([^)]+,\s*\{\s*error\s*\}\s*;/g,   // info with { error };
];

const files = globSync('src/**/*.{ts,tsx}', {
    cwd: rootDir,
    absolute: true,
    ignore: ['**/node_modules/**', '**/dist/**', '**/build/**']
});

let totalFixed = 0;
const fixedFiles: string[] = [];

for (const file of files) {
    let content = readFileSync(file, 'utf-8');
    let modified = content;
    let fileFixed = 0;

    for (const pattern of patterns) {
        modified = modified.replace(pattern, (match) => {
            fileFixed++;
            // Replace }; with })
            return match.replace(/}\s*;/, '})');
        });
    }

    if (fileFixed > 0) {
        writeFileSync(file, modified, 'utf-8');
        fixedFiles.push(file);
        totalFixed += fileFixed;
        console.log(`✅ Fixed ${fileFixed} error(s) in ${file.replace(rootDir, '.')}`);
    }
}

console.log(`\n📊 Summary:`);
console.log(`   Files scanned: ${files.length}`);
console.log(`   Files fixed: ${fixedFiles.length}`);
console.log(`   Total fixes: ${totalFixed}`);

if (totalFixed > 0) {
    console.log('\n✨ All syntax errors fixed!');
}
else {
    console.log('\n✓ No syntax errors found.');
}
