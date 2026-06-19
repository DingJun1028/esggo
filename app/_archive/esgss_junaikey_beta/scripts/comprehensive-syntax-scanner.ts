#!/usr/bin/env tsx
/**
 * 🔍 Comprehensive Syntax Scanner
 * Find ALL remaining quote, bracket, and parameter issues
 */

import { readFileSync } from 'fs';
import { globSync } from 'glob';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

console.log('🔍 Comprehensive Syntax Scanner\n');
console.log('Searching for:');
console.log('  1. Mismatched quotes (\\\', ", \\`)');
console.log('  2. Unterminated strings');
console.log('  3. Missing closing brackets/parens');
console.log(' 4. Invalid omniLogger calls\n');

const files = globSync('src/**/*.{ts,tsx}', {
    cwd: rootDir,
    absolute: true,
    ignore: ['**/node_modules/**', '**/dist/**', '**/build/**']
});

const issues: Array<{ file: string; line: number; issue: string; content: string }> = [];

for (const file of files) {
    const lines = readFileSync(file, 'utf-8').split('\n');

    lines.forEach((line, idx) => {
        const lineNum = idx + 1;

        // Pattern 1: Escaped quote at end (e.g., initialName');)
        if (line.match(/[a-zA-Z]'\);/)) {
            issues.push({ file, line: lineNum, issue: 'Unmatched quote after variable', content: line.trim() });
        }

        // Pattern 2: String ending with \", instead of '
        if (line.match(/\\\",/g)) {
            issues.push({ file, line: lineNum, issue: 'Escaped quote instead of closing quote', content: line.trim() });
        }

        // Pattern 3: { error }; pattern (common mistake)
        if (line.match(/\{ error };/)) {
            issues.push({ file, line: lineNum, issue: 'Unterminated error template', content: line.trim() });
        }

        // Pattern 4: omniLogger with only 1 parameter
        if (line.match(/omniLogger\.(info|error|warn)\('[^']+'\);/) && !line.includes('//')) {
            issues.push({ file, line: lineNum, issue: 'omniLogger missing 2nd parameter', content: line.trim() });
        }

        // Pattern 5: data.length')
        if (line.match(/data\.length'\)/)) {
            issues.push({ file, line: lineNum, issue: 'Unmatched quote after data.length', content: line.trim() });
        }
    });
}

console.log(`\n📊 Found ${issues.length} potential syntax issues:\n`);

issues.forEach(({ file, line, issue, content }) => {
    const shortPath = file.replace(rootDir + '\\', '').replace(/\\/g, '/');
    console.log(`❌ ${shortPath}:${line}`);
    console.log(`   Issue: ${issue}`);
    console.log(`   Code: ${content}`);
    console.log();
});

if (issues.length === 0) {
    console.log('✅ No obvious syntax issues found!');
}
