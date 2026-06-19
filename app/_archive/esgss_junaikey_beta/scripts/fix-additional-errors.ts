/**
 * 修正 `, e')` 和其他類似的語法錯誤
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

        // 修正 , e') 為 , { error: e })
        content = content.replace(/, e'\)/g, ', { error: e })');

        // 修正其他變數名 (err, err', error')
        content = content.replace(/, err'\)/g, ', { error: err })');

        if (content !== original) {
            fs.writeFileSync(filePath, content, 'utf-8');
            const changes = content.length - original.length;
            fixedCount++;
            filesFixed++;
            console.log(`✅ Fixed: ${path.relative(SRC_DIR, filePath)}`);
        }
    } catch (error) {
        console.error(`❌ Failed to fix ${filePath}:`, error);
    }
}

async function main() {
    console.log('🔧 Fixing additional syntax errors...\n');

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
    console.log(`  Total changes: ${fixedCount}`);
}

main().catch(console.error);
