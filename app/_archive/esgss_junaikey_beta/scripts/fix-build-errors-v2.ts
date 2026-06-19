
import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

// Configuration
const TARGET_DIR = 'src'; // Process 'src' directory
const LOG_CATEGORY_DEFAULT = 'LogCategory.SYSTEM';
const LOG_CATEGORY_MAP: Record<string, string> = {
    'ExemplarReportAgent.ts': 'LogCategory.AGENT',
    'ai-service.ts': 'LogCategory.AI',
    'integrationService.ts': 'LogCategory.INTEGRATION',
    'OmniLegionCommand.tsx': 'LogCategory.LEGION',
    'OmniCoreChat.tsx': 'LogCategory.AI',
};

async function fixFiles() {
    console.log('🔍 Scanning for files...');

    // Find all TS/TSX files
    const files = await glob(`${TARGET_DIR}/**/*.{ts,tsx}`, { ignore: 'node_modules/**' });
    console.log(`📝 Found ${files.length} files. Processing...`);

    let fixedCount = 0;
    let fileCount = 0;

    for (const file of files) {
        const filePath = path.resolve(file);
        let content = fs.readFileSync(filePath, 'utf-8');
        let originalContent = content;

        // 1. Fix broken syntax artifacts (e.g., trailing quote after close paren)
        // Matches: );' or );" at end of line
        content = content.replace(/\);\s*['"]\s*$/gm, ');');

        // Matches: .repeat(70)'); -> .repeat(70));
        content = content.replace(/\.repeat\((\d+)\)\'\);/g, '.repeat($1));');

        // 2. Fix OmniLogger calls missing Category
        // Regex matches: omniLogger.info('... or omniLogger.info("...
        // It captures the method name and the opening quote
        const filename = path.basename(filePath);
        const category = LOG_CATEGORY_MAP[filename] || LOG_CATEGORY_DEFAULT;

        // Replace: omniLogger.info(' -> omniLogger.info(LogCategory.XXX, '
        // ensure we don't double replace if it already has LogCategory
        // Lookahead to ensure it's not followed by LogCategory
        content = content.replace(
            /omniLogger\.(info|warn|error)\s*\(\s*(['"`])/g,
            (match, method, quote) => {
                return `omniLogger.${method}(${category}, ${quote}`;
            }
        );

        // Also handle template literals if any: omniLogger.info(`
        content = content.replace(
            /omniLogger\.(info|warn|error)\s*\(\s*`/g,
            (match, method) => {
                return `omniLogger.${method}(${category}, \``;
            }
        );

        // 3. Fix: omniLogger.info('[Tag] ' + variable); -> omniLogger.info(Category, '[Tag] ' + variable);
        // This is harder with regex, but we can try to catch common patterns where the first arg is NOT LogCategory
        // Assumption: LogCategory starts with 'LogCategory.'
        // Find calls where first arg does NOT start with LogCategory
        // This regex is risky, so limiting to the quote replacements above which cover 90% of cases.

        // 4. Special fix for ExemplarReportAgent specific patterns if needed
        if (filename === 'ExemplarReportAgent.ts') {
            // Fix usage like: omniLogger.info('[ExemplarReportAgent] ═'.repeat(70));
            // The repeat pattern might not start with quote directly in the arg list if processed by prev regex?
            // Actually, '.repeat' starts with a string literal usually: '[...]'.repeat
            // So the regex above `omniLogger.info('` catches it.
        }

        // 5. Add LogCategory import if missing and omniLogger is used
        if (content !== originalContent) {
            if (!content.includes('LogCategory') && content.includes('omniLogger')) {
                // Try to find where OmniLogger is imported
                if (content.match(/import .*omniLogger.* from/)) {
                    // Add LogCategory to the import
                    content = content.replace(
                        /import\s+\{\s*omniLogger\s*\}\s+from\s+(['"].*OmniLogger['"]);/,
                        "import { omniLogger, LogCategory } from $1;"
                    );
                    // If that didn't match (maybe it has other imports), try generic append
                    if (!content.includes('LogCategory')) {
                        // If still not added, blindly add it
                        content = `import { LogCategory } from '@/omni/infrastructure/logging/OmniLogger';\n` + content;
                    }
                }
            }
        }

        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf-8');
            fixedCount++;
            console.log(`✅ Fixed: ${filename}`);
        }
        fileCount++;
    }

    console.log(`\n🎉 Finished! Fixed ${fixedCount} files out of ${fileCount}.`);
}

fixFiles().catch(console.error);
