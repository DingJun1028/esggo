import fs from 'fs';
import path from 'path';

function isUtf8(buffer) {
    let i = 0;
    while (i < buffer.length) {
        if (buffer[i] <= 0x7F) {
            i += 1;
        } else if (buffer[i] >= 0xC2 && buffer[i] <= 0xDF) {
            if (i + 1 >= buffer.length || buffer[i + 1] < 0x80 || buffer[i + 1] > 0xBF) return false;
            i += 2;
        } else if (buffer[i] >= 0xE0 && buffer[i] <= 0xEF) {
            if (i + 2 >= buffer.length || buffer[i + 1] < 0x80 || buffer[i + 1] > 0xBF || buffer[i + 2] < 0x80 || buffer[i + 2] > 0xBF) return false;
            i += 3;
        } else if (buffer[i] >= 0xF0 && buffer[i] <= 0xF4) {
            if (i + 3 >= buffer.length || buffer[i + 1] < 0x80 || buffer[i + 1] > 0xBF || buffer[i + 2] < 0x80 || buffer[i + 2] > 0xBF || buffer[i + 3] < 0x80 || buffer[i + 3] > 0xBF) return false;
            i += 4;
        } else {
            return false;
        }
    }
    return true;
}

function scanDir(dir, excludes = ['node_modules', '.git', 'dist', '.vercel', '.firebase']) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (excludes.includes(file)) continue;
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            scanDir(fullPath, excludes);
        } else if (file.endsWith('.md') || file.endsWith('.ts') || file.endsWith('.js') || file.endsWith('.sql')) {
            const buffer = fs.readFileSync(fullPath);
            if (!isUtf8(buffer)) {
                console.log(`[NON-UTF8] ${fullPath}`);
            }
        }
    }
}

const targetDir = process.argv[2] || '.';
console.log(`Scanning ${targetDir} for non-UTF8 files...`);
scanDir(targetDir);
console.log('Scan complete.');
