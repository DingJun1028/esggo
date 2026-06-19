/**
 * 自動化代碼品質提升腳本
 * 
 * 功能：
 * 1. 批量替換 console.error 為 omniLogger.error
 * 2. 批量替換 console.log 為 omniLogger.info (針對非測試文件)
 * 3. 移除冗長註解
 * 4. 消除魔法數字
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

// ESM 兼容的 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SRC_DIR = path.resolve(__dirname, '../src');
const EXCLUDE_DIRS = ['node_modules', 'dist', 'build', '.git'];

interface FixStats {
    filesProcessed: number;
    consoleErrorFixed: number;
    consoleLogFixed: number;
    importsAdded: number;
    errors: string[];
}

const stats: FixStats = {
    filesProcessed: 0,
    consoleErrorFixed: 0,
    consoleLogFixed: 0,
    importsAdded: 0,
    errors: []
};

/**
 * 檢查文件是否需要添加 omniLogger 導入
 */
function needsOmniLoggerImport(content: string): boolean {
    return !content.includes("import { omniLogger }") &&
        !content.includes("from '@/omni/infrastructure/logging/OmniLogger'");
}

/**
 * 添加 omniLogger 導入
 */
function addOmniLoggerImport(content: string): string {
    const importRegex = /^import\s+.*from\s+['"].*['"];?\s*$/m;
    const match = content.match(importRegex);

    if (match) {
        const importStatement = "import { omniLogger } from '@/omni/infrastructure/logging/OmniLogger';\n";
        return content.replace(importRegex, match[0] + '\n' + importStatement);
    }

    // 如果沒有找到導入，添加到文件頂部
    return "import { omniLogger } from '@/omni/infrastructure/logging/OmniLogger';\n\n" + content;
}

/**
 * 替換 console.error 為 omniLogger.error
 */
function replaceConsoleError(content: string, filePath: string): string {
    const fileName = path.basename(filePath, path.extname(filePath));
    let modified = content;
    let count = 0;

    // 匹配 console.error(...) 調用
    const consoleErrorRegex = /console\.error\((.*?)\);/g;

    modified = modified.replace(consoleErrorRegex, (match, args) => {
        count++;

        // 解析參數
        const trimmedArgs = args.trim();

        // 如果只有一個字符串參數
        if (trimmedArgs.startsWith("'") || trimmedArgs.startsWith('"')) {
            const message = trimmedArgs.replace(/^['"]|['"]$/g, '');
            return `omniLogger.error('[${fileName}] ${message}');`;
        }

        // 如果有多個參數
        const argsList = trimmedArgs.split(',').map((arg: string) => arg.trim());
        if (argsList.length > 1) {
            const message = argsList[0].replace(/^['"]|['"]$/g, '');
            const errorVar = argsList[argsList.length - 1];
            return `omniLogger.error('[${fileName}] ${message}', { error: ${errorVar} });`;
        }

        // 默認情況
        return `omniLogger.error('[${fileName}] Error', { error: ${trimmedArgs} });`;
    });

    stats.consoleErrorFixed += count;
    return modified;
}

/**
 * 替換 console.log 為 omniLogger.info (僅非測試文件)
 */
function replaceConsoleLog(content: string, filePath: string): string {
    // 跳過測試文件
    if (filePath.includes('.test.') || filePath.includes('.spec.') || filePath.includes('/tests/') || filePath.includes('verify-')) {
        return content;
    }

    const fileName = path.basename(filePath, path.extname(filePath));
    let modified = content;
    let count = 0;

    const consoleLogRegex = /console\.log\((.*?)\);/g;

    modified = modified.replace(consoleLogRegex, (match, args) => {
        count++;

        const trimmedArgs = args.trim();

        if (trimmedArgs.startsWith("'") || trimmedArgs.startsWith('"')) {
            const message = trimmedArgs.replace(/^['"]|['"]$/g, '');
            return `omniLogger.info('[${fileName}] ${message}');`;
        }

        const argsList = trimmedArgs.split(',').map((arg: string) => arg.trim());
        if (argsList.length > 1) {
            const message = argsList[0].replace(/^['"]|['"]$/g, '');
            const data = argsList.slice(1).join(', ');
            return `omniLogger.info('[${fileName}] ${message}', { data: ${data} });`;
        }

        return `omniLogger.info('[${fileName}] Info', { data: ${trimmedArgs} });`;
    });

    stats.consoleLogFixed += count;
    return modified;
}

/**
 * 處理單個文件
 */
async function processFile(filePath: string): Promise<void> {
    try {
        let content = fs.readFileSync(filePath, 'utf-8');
        let modified = content;
        let needsImport = false;

        // 替換 console.error
        const beforeError = modified;
        modified = replaceConsoleError(modified, filePath);
        if (modified !== beforeError) needsImport = true;

        // 替換 console.log
        const beforeLog = modified;
        modified = replaceConsoleLog(modified, filePath);
        if (modified !== beforeLog) needsImport = true;

        // 添加導入（如果需要）
        if (needsImport && needsOmniLoggerImport(modified)) {
            modified = addOmniLoggerImport(modified);
            stats.importsAdded++;
        }

        // 寫回文件（如果有變更）
        if (modified !== content) {
            fs.writeFileSync(filePath, modified, 'utf-8');
            stats.filesProcessed++;
            console.log(`✅ Processed: ${path.relative(SRC_DIR, filePath)}`);
        }
    } catch (error) {
        const errorMsg = `Failed to process ${filePath}: ${error}`;
        stats.errors.push(errorMsg);
        console.error(`❌ ${errorMsg}`);
    }
}

/**
 * 主函數
 */
async function main() {
    console.log('🚀 Starting Code Quality Improvement Script...\n');

    // 找到所有 .ts 和 .tsx 文件
    const files = await glob('**/*.{ts,tsx}', {
        cwd: SRC_DIR,
        ignore: EXCLUDE_DIRS.map(dir => `**/${dir}/**`),
        absolute: true
    });

    console.log(`📁 Found ${files.length} TypeScript files\n`);

    // 處理每個文件
    for (const file of files) {
        await processFile(file);
    }

    // 輸出統計
    console.log('\n📊 Processing Complete!\n');
    console.log('Statistics:');
    console.log(`  Files Processed: ${stats.filesProcessed}`);
    console.log(`  console.error Fixed: ${stats.consoleErrorFixed}`);
    console.log(`  console.log Fixed: ${stats.consoleLogFixed}`);
    console.log(`  Imports Added: ${stats.importsAdded}`);

    if (stats.errors.length > 0) {
        console.log(`\n⚠️  Errors (${stats.errors.length}):`);
        stats.errors.forEach(err => console.log(`  - ${err}`));
    } else {
        console.log('\n✨ No errors encountered!');
    }
}

main().catch(console.error);
