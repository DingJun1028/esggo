import { readdir, readFile, writeFile } from 'fs/promises';
import { join, extname } from 'path';

const srcDir = 'src';
const oldColor = /#63[Aa]2[Bb]0/g;
const newColor = '#00FFFF';
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
                if (oldColor.test(content)) {
                    oldColor.lastIndex = 0;
                    const matches = content.match(oldColor);
                    const replaced = content.replace(oldColor, newColor);
                    await writeFile(full, replaced, 'utf-8');
                    count += matches.length;
                    console.log(`Updated ${full} (${matches.length} replacements)`);
                }
            }
        }
    }
}

await walk(srcDir);
console.log(`\nTotal replacements: ${count}`);
