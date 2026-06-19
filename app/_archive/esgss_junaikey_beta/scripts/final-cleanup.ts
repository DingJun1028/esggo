#!/usr/bin/env tsx
/**
 * Final cleanup: Fix all remaining omniLogger parameter issues
 */

import { readFileSync, writeFileSync } from 'fs';
import { globSync } from 'glob';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

console.log('🧹 Final cleanup: Fixing all remaining omniLogger issues...\n');

const files = globSync('src/**/*.{ts,tsx}', {
    cwd: rootDir,
    absolute: true,
    ignore: ['**/node_modules/**', '**/dist/**', '**/build/**']
});

let totalFixed = 0;

for (const file of files) {
    let content = readFileSync(file, 'utf-8');
    const originalContent = content;

    // Fix pattern 1: ', data.length') → Use String()
    content = content.replace(
        /omniLogger\.(info|error|warn)\(([^,]+),\s*data\.length'\)/g,
        'omniLogger.$1($2, String(data.length))'
    );

    // Fix pattern 2: Unterminated strings like 'Unknown { error };
    content = content.replace(
        /'Unknown \{ error };/g,
        "'Unknown error');"
    );

    if (content !== originalContent) {
        writeFileSync(file, content, 'utf-8');
        totalFixed++;
        console.log(`✅ Fixed: ${file.replace(rootDir, '.')}`);
    }
}

console.log(`\n📊 Total files fixed: ${totalFixed}`);
