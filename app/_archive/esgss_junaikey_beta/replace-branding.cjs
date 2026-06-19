const fs = require('fs');
const path = require('path');

const baseDir = 'c:/Project/esgss_junaikey_beta/esgss_junaikey_beta';
const pattern = /奧秘/g;
const replacement = '奧秘';
const excludeDirs = ['node_modules', '.git', 'dist', '.next', 'artifacts', 'brain'];
const extensions = ['.ts', '.tsx', '.js', '.jsx', '.md', '.json', '.sql', '.html', '.cjs', '.mjs', '.bat', '.sh', '.py', '.log', '.txt', '.yml', '.yaml', '.ps1'];

function walk(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            if (excludeDirs.includes(file)) continue;
            walk(fullPath);
        } else if (stat.isFile()) {
            const ext = path.extname(file).toLowerCase();
            if (extensions.includes(ext)) {
                try {
                    const content = fs.readFileSync(fullPath, 'utf8');
                    if (content.includes('奧秘')) {
                        const updated = content.replace(pattern, replacement);
                        fs.writeFileSync(fullPath, updated, 'utf8');
                        console.log(`Updated: ${fullPath}`);
                    }
                } catch (err) {
                    console.error(`Error processing ${fullPath}: ${err.message}`);
                }
            }
        }
    }
}

console.log('🚀 Starting Omni Branding Replacement (Node.js)...');
walk(baseDir);
console.log('✅ Replacement complete!');
