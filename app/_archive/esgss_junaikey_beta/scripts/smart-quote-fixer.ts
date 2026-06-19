#!/usr/bin/env tsx
/**
 * 🔧 Smart Quote Fixer - Find and fix ALL quote mismatches
 */

import { readFileSync, writeFileSync } from 'fs';
import { globSync } from 'glob';

const rootDir = 'C:\\Project\\esgss_junaikey_beta\\esgss_junaikey_beta';

console.log('🔧 Smart Quote Fixer - Scanning for mismatches...\n');

const files = globSync('src/**/*.{ts,tsx}', {
    cwd: rootDir,
    absolute: true,
    ignore: ['**/node_modules/**', '**/dist/**']
});

let totalFixed = 0;

for (const file of files) {
    let content = readFileSync(file, 'utf-8');
    const original = content;

    // Fix 1: response'); → response);
    content = content.replace(/response'\);/g, 'response);');

    // Fix 2: initialName'); → initialName);
    content = content.replace(/initialName'\);/g, 'initialName);');

    // Fix 3: Remove excessive escaping \\\" → "
    content = content.replace(/\\\\"/g, '"');

    // Fix 4: Fix { error }; patterns
    content = content.replace(/'Unknown \{ error };/g, "'Unknown error');");

    if (content !== original) {
        writeFileSync(file, content, 'utf-8');
        totalFixed++;
        const shortPath = file.replace(rootDir + '\\\\', '').replace(/\\\\/g, '/');
        console.log(`✅ Fixed: ${shortPath}`);
    }
}

console.log(`\n📊 Total files fixed: ${totalFixed}`);
console.log('✨ Done!');
