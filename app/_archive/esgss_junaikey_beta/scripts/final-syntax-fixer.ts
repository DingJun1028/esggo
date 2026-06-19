
import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

const TARGET_DIR = 'src';

async function fixFiles() {
    console.log('🔧 Final Syntax Fixer - Scanning...');

    const files = await glob(`${TARGET_DIR}/**/*.{ts,tsx}`, { ignore: 'node_modules/**' });
    let fixedCount = 0;

    for (const file of files) {
        const filePath = path.resolve(file);
        let content = fs.readFileSync(filePath, 'utf-8');
        let originalContent = content;

        // 1. Fix generic pattern:  , Variable');  -> , Variable);
        // Be careful not to match strings like 'End');
        // We assume Variable is an identifier (alphanumeric)
        // Regex: , ([a-zA-Z0-9_.]+)['"]\s*\);
        content = content.replace(/,\s*([a-zA-Z0-9_.]+)['"]\s*\);/g, ', $1);');

        // 2. Fix generic pattern:  : Variable');  -> : Variable); (if used in calls)
        content = content.replace(/:\s*([a-zA-Z0-9_.]+)['"]\s*\);/g, ': $1);');

        // 3. Fix specifc broken substring pattern seen in activate-awakening (and potential others)
        // substring(0', { data: 100)} -> substring(0, 100)
        // This is very specific but let's try to match the broken artifact
        // "substring(0', { data: " -> "substring(0, "
        // and ")}...`" ??? This is hard to generalize safely without context.
        // Let's rely on manual fixes for complex logic breakage.

        // 4. Ensure LogCategory import if omniLogger is used and LogCategory is missing
        if (content.includes('omniLogger') && content.includes('LogCategory') && !content.includes('import { omniLogger, LogCategory }') && !content.includes('import { LogCategory }')) {
            // If it imports omniLogger but not LogCategory in the same line
            if (content.match(/import\s+\{\s*omniLogger\s*\}\s+from/)) {
                content = content.replace(
                    /import\s+\{\s*omniLogger\s*\}\s+from\s+(['"].*OmniLogger['"]);/,
                    "import { omniLogger, LogCategory } from $1;"
                );
            } else {
                // Maybe omniLogger is not imported but used? (Global?)
                // Or imported differently. Check if LogCategory is imported at all.
                if (!content.includes('import') || !content.includes('LogCategory')) {
                    // Add import at top
                    // content = `import { LogCategory } from '@/omni/infrastructure/logging/OmniLogger';\n` + content;
                    // Don't blindly add, it might be safer to replace existing import.
                }
            }
        }

        // 5. Fix:  omniLogger.info(LogCategory.SYSTEM, '...:', OmniAgent');
        // Covered by rule #1

        // 6. Fix:  omniLogger.info(LogCategory.SYSTEM, '[Tag] ' + variable);  --> OK
        // But if:  omniLogger.info(LogCategory.SYSTEM, '[Tag] ' + variable'); --> Broken
        // Regex:  \+ ([a-zA-Z0-9_.]+)['"]\s*\);
        content = content.replace(/\+\s*([a-zA-Z0-9_.]+)['"]\s*\);/g, '+ $1);');

        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf-8');
            fixedCount++;
            console.log(`✅ Fixed: ${path.basename(file)}`);
        }
    }

    console.log(`\n🎉 Finished! Fixed ${fixedCount} files.`);
}

fixFiles().catch(console.error);
