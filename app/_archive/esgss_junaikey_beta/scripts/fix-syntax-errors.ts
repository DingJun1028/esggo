/**
 * 修正自動化替換導致的語法錯誤
 * 將 error') 替換為 { error }
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SRC_DIR = path.resolve(__dirname, '../src');

let fixedCount = 0;
let filesFixed = 0;

async function fixFile(filePath: string) {
    try {
        let content = fs.readFileSync(filePath, 'utf-8');
        const original = content;

        // 修正 error') 為 { error }
        content = content.replace(/error'\)/g, '{ error }');

        if (content !== original) {
            fs.writeFileSync(filePath, content, 'utf-8');
            const count = (original.match(/error'\)/g) || []).length;
            fixedCount += count;
            filesFixed++;
            console.log(`✅ Fixed ${count} occurrences in: ${path.relative(SRC_DIR, filePath)}`);
        }
    } catch (error) {
        console.error(`❌ Failed to fix ${filePath}:`, error);
    }
}

async function main() {
    console.log('🔧 Fixing syntax errors...\n');

    const files = await glob('**/*.{ts,tsx}', {
        cwd: SRC_DIR,
        ignore: ['**/node_modules/**', '**/dist/**'],
        absolute: true
    });

    for (const file of files) {
        await fixFile(file);
    }

    console.log('\n📊 Summary:');
    console.log(`  Files fixed: ${filesFixed}`);
    console.log(`  Total replacements: ${fixedCount}`);
}

main().catch(console.error);
