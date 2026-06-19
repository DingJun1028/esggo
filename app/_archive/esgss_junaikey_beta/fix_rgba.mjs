import { readdir, readFile, writeFile } from 'fs/promises';
import { join, extname } from 'path';

const srcDir = 'src';
// Replace rgba(99,162,176,...) with rgba(0,255,255,...)
const oldRgb = /rgba?\(99\s*,\s*162\s*,\s*176/g;
const newRgb = 'rgba(0,255,255';
let count = 0;

async function walk(dir) {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
        const full = join(dir, entry.name);
        if (entry.isDirectory()) {
            await walk(full);
        } else {
            const ext = extname(entry.name);
            if (['.ts', '.tsx', '.css', '.scss'].includes(ext)) {
                const content = await readFile(full, 'utf-8');
                if (oldRgb.test(content)) {
                    oldRgb.lastIndex = 0;
                    const matches = content.match(oldRgb);
                    const replaced = content.replace(oldRgb, newRgb);
                    await writeFile(full, replaced, 'utf-8');
                    count += matches.length;
                    console.log(`Updated ${full} (${matches.length} replacements)`);
                }
            }
        }
    }
}

await walk(srcDir);
console.log(`\nTotal rgba replacements: ${count}`);
